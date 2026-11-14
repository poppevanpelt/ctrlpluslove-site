import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const assetsDir = path.join(process.cwd(), "public", "2go-assets");

const assets = [
  { name: "hero", chunks: 3 },
  { name: "extras", chunks: 4 },
];

for (const asset of assets) {
  const parts = [];
  for (let i = 1; i <= asset.chunks; i += 1) {
    const chunkPath = path.join(assetsDir, `${asset.name}.b64.${i}`);
    parts.push((await readFile(chunkPath, "utf8")).trim());
  }

  const bytes = Buffer.from(parts.join(""), "base64");

  if (bytes.subarray(0, 4).toString("ascii") !== "RIFF" ||
      bytes.subarray(8, 12).toString("ascii") !== "WEBP") {
    throw new Error(`${asset.name}: reconstructed file is not a WebP`);
  }

  const declaredSize = bytes.readUInt32LE(4) + 8;
  if (declaredSize !== bytes.length) {
    throw new Error(
      `${asset.name}: WebP is incomplete (declares ${declaredSize} bytes, reconstructed ${bytes.length})`
    );
  }

  await writeFile(path.join(assetsDir, `${asset.name}.webp`), bytes);
  console.log(`Restored ${asset.name}.webp (${bytes.length} bytes)`);
}

// Restore the approved faculty and instrument photographs from the checked-in archive.
const { mkdir } = await import("node:fs/promises");
const { inflateRawSync } = await import("node:zlib");
const archive = await readFile(path.join(process.cwd(), "ctrl-love-final-assets.zip"));
const approvedNames = new Set(["public/room/personas/ines-valera.webp","public/room/personas/otto-rehm.webp","public/room/personas/nina-bell.webp","public/room/personas/arthur-pike.webp","public/room/personas/miriam-finch.webp","public/room/personas/elias-stern.webp","public/room/personas/noor-haddad.webp","public/room/personas/greta-lund.webp","public/room/personas/mateo-rivas.webp","public/room/personas/celine-morin.webp","public/room/personas/felix-owusu.webp","public/room/personas/beatrice-shaw.webp","public/room/personas/kenji-sato.webp","public/room/personas/ada-kessler.webp","public/room/personas/rosa-bakker.webp","public/room/personas/samir-desai.webp","public/room/personas/edith-cole.webp","public/room/personas/hugo-march.webp","public/purge-1964.webp","public/chase-1964.webp","public/ai-y-fier-1964.webp","public/fizz-1964.webp","public/swat-1964.webp"]);
let offset = 0, restored = 0;
while (offset + 30 <= archive.length && archive.readUInt32LE(offset) === 0x04034b50) {
  const flags = archive.readUInt16LE(offset + 6);
  const method = archive.readUInt16LE(offset + 8);
  const compressed = archive.readUInt32LE(offset + 18);
  const size = archive.readUInt32LE(offset + 22);
  const nameLength = archive.readUInt16LE(offset + 26);
  const extraLength = archive.readUInt16LE(offset + 28);
  const name = archive.subarray(offset + 30, offset + 30 + nameLength).toString("utf8");
  const start = offset + 30 + nameLength + extraLength;
  if ((flags & 9) || !approvedNames.has(name)) throw new Error("Unexpected archive entry: " + name);
  const raw = archive.subarray(start, start + compressed);
  const bytes = method === 8 ? inflateRawSync(raw) : method === 0 ? raw : null;
  if (!bytes || bytes.length !== size || bytes.toString("ascii",0,4) !== "RIFF" || bytes.toString("ascii",8,12) !== "WEBP" || bytes.readUInt32LE(4)+8 !== bytes.length) throw new Error("Invalid WebP: " + name);
  const target = path.join(process.cwd(), name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  restored++;
  offset = start + compressed;
}
if (restored !== 23) throw new Error("Expected 23 faculty and instrument assets, restored " + restored);
console.log("Restored all 23 faculty and instrument photographs");
