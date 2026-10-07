import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Build a complete alternate-host checkout without changing production source.
const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
function option(name) { const i = argv.indexOf(name); return i < 0 ? undefined : argv[i + 1]; }
const destination = option('--destination');
const plugin = option('--sites-plugin-root');
const cabinet = option('--cabinet-source');
if (!destination || !plugin || !isAbsolute(destination) || !isAbsolute(plugin)) {
  throw new Error('Supply absolute --destination and --sites-plugin-root paths. Optional --cabinet-source is the restored Cabinet dist directory.');
}
if (destination === source || destination.startsWith(source + '/')) {
  throw new Error('Use a separate checkout outside the production repository.');
}
await mkdir(destination, { recursive: true });
if ((await readdir(destination)).length) throw new Error('Destination must be empty; existing files will not be overwritten.');
function run(args) {
  const result = spawnSync(args[0], args.slice(1), { cwd: destination, stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Preparation step failed: ${args[0]} (exit ${result.status})`);
}
run([process.execPath, join(plugin, 'scripts/project-setup.mjs')]);
run([process.execPath, join(plugin, 'scripts/install-dependencies.mjs')]);
await rm(join(destination, 'app'), { recursive: true });
for (const name of ['src', 'public', 'tests']) await cp(join(source, name), join(destination, name), { recursive: true });
for (const name of ['next.config.ts', 'tsconfig.json']) await cp(join(source, name), join(destination, name));
await cp(join(source, 'scripts/restore-2go-assets.mjs'), join(destination, 'scripts/restore-2go-assets.mjs'));
await cp(join(source, 'hosting/sites-proxy.ts'), join(destination, 'src/proxy.ts'));

// Explicit relative imports avoid Vinext/Vite path-alias resolution failures.
async function normalizeImports(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = join(directory, entry.name);
    if (entry.isDirectory()) { await normalizeImports(filename); continue; }
    if (!/\.tsx?$/.test(entry.name)) continue;
    const before = await readFile(filename, 'utf8');
    const after = before.replace(/(["'])@\/([^"']+)\1/g, (_, quote, path) => {
      let target = relative(dirname(filename), join(destination, 'src', path)).replaceAll('\\', '/');
      if (!target.startsWith('.')) target = './' + target;
      return quote + target + quote;
    });
    if (after !== before) await writeFile(filename, after);
  }
}
await normalizeImports(join(destination, 'src'));
const vitePath = join(destination, 'vite.config.ts');
let vite = await readFile(vitePath, 'utf8');
vite = vite.replace('import vinext from "vinext";', 'import vinext from "vinext";\nimport { fileURLToPath } from "node:url";');
vite = vite.replace('return {\n    server:', 'return {\n    resolve: { tsconfigPaths: false, alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },\n    server:');
await writeFile(vitePath, vite);

if (process.env.SITES_PNPM_BIN) {
  run([process.execPath, process.env.SITES_PNPM_BIN, 'add', '@vapi-ai/web@2.6.1', '@vercel/analytics@2.0.1', '@vercel/speed-insights@2.0.0']);
} else {
  run(['npm', 'install', '@vapi-ai/web@2.6.1', '@vercel/analytics@2.0.1', '@vercel/speed-insights@2.0.0']);
}

if (cabinet) {
  if (!isAbsolute(cabinet)) throw new Error('--cabinet-source must be absolute.');
  await cp(cabinet, join(destination, 'public/cabinet'), { recursive: true });
  const path = join(destination, 'public/cabinet/index.html');
  const html = (await readFile(path, 'utf8'))
    .replaceAll('src="assets/', 'src="/cabinet/assets/')
    .replaceAll('href="assets/', 'href="/cabinet/assets/')
    .replaceAll('url(assets/', 'url(/cabinet/assets/')
    .replaceAll("plate('assets/", "plate('/cabinet/assets/");
  await writeFile(path, html);
}
run([process.execPath, 'scripts/restore-2go-assets.mjs']);
run([process.execPath, 'scripts/run-framework.mjs', 'build']);
console.log(JSON.stringify({ checkout: destination, status: 'built', deployed: false }));
