import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const sourceDir = new URL("../out/", import.meta.url);
const previewDir = new URL("../static-preview/", import.meta.url);

const pages = [
  "index.html",
  "museum.html",
  "artifacts.html",
  "rob.html",
  "marjan.html",
  "reality.html",
];

const assets = [
  "favicon.ico",
  "dear-rob.png",
  "dear-marjan.png",
  "reality-poster.png",
];

const themeHeadScript = `<script>
(function () {
  var storageKey = "ctrl-love-theme";

  function currentTheme() {
    try {
      return localStorage.getItem(storageKey) === "night" ? "night" : "day";
    } catch (error) {
      return "day";
    }
  }

  function applyTheme(theme) {
    var isNight = theme === "night";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = isNight ? "dark" : "light";
  }

  try {
    applyTheme(currentTheme());
  } catch (error) {}
})();
</script>`;

const themeBodyScript = `<script>
(function () {
  var storageKey = "ctrl-love-theme";

  function currentTheme() {
    try {
      return localStorage.getItem(storageKey) === "night" ? "night" : "day";
    } catch (error) {
      return "day";
    }
  }

  function applyTheme(theme) {
    var isNight = theme === "night";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = isNight ? "dark" : "light";
    var toggles = document.querySelectorAll("[data-theme-toggle], .theme-toggle");
    toggles.forEach(function (toggle) {
      toggle.textContent = isNight ? "Day mode" : "Night mode";
      toggle.setAttribute("aria-label", isNight ? "Switch to day mode" : "Switch to night mode");
      toggle.setAttribute("aria-pressed", String(isNight));
    });
  }

  function setTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {}
    applyTheme(theme);
  }

  function toggleTheme() {
    setTheme(document.documentElement.dataset.theme === "night" ? "day" : "night");
  }

  applyTheme(currentTheme());

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var toggle = target.closest("[data-theme-toggle], .theme-toggle");
    if (!toggle) return;
    event.preventDefault();
    toggleTheme();
  });
})();
</script>`;

function inlineCss(html, css) {
  return html.replace(
    /<link rel="stylesheet" href="(?:\.\/|\/)?_next\/static\/css\/[^"]+"[^>]*>/,
    `<style>${css}</style>`
  );
}

function addThemeScripts(html) {
  return html
    .replace("<head>", `<head>${themeHeadScript}`)
    .replace("</body>", `${themeBodyScript}</body>`);
}

function removeRuntime(html) {
  return html
    .replace(/<link rel="preload" as="script"[^>]*>/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<div hidden="">\s*<\/div>/g, "")
    .replace(/<link rel="icon" href="\/favicon\.ico\?[^"]*"([^>]*)>/g, '<link rel="icon" href="favicon.ico"$1>')
    .replace(/href="\//g, 'href="')
    .replace(/href=""/g, 'href="index.html"')
    .replace(/href="museum"/g, 'href="museum.html"')
    .replace(/href="artifacts"/g, 'href="artifacts.html"')
    .replace(/href="rob"/g, 'href="rob.html"')
    .replace(/href="marjan"/g, 'href="marjan.html"')
    .replace(/href="reality"/g, 'href="reality.html"');
}

const cssDir = new URL("_next/static/css/", sourceDir);
const cssFile = (await readdir(cssDir)).find((file) => file.endsWith(".css"));

if (!cssFile) {
  throw new Error("No exported CSS file found.");
}

const cssPath = new URL(cssFile, cssDir);
const css = await readFile(cssPath, "utf8");

await mkdir(previewDir, { recursive: true });

for (const page of pages) {
  const sourcePath = new URL(page, sourceDir);
  const targetPath = new URL(page, previewDir);
  const html = await readFile(sourcePath, "utf8");
  const standalone = addThemeScripts(removeRuntime(inlineCss(html, css)));
  await writeFile(targetPath, standalone, "utf8");
}

for (const asset of assets) {
  await copyFile(new URL(asset, sourceDir), new URL(asset, previewDir));
}

console.log(
  `Created standalone preview at ${join(previewDir.pathname, basename("index.html"))}`
);
