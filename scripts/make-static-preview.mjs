import { cp, copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const sourceDir = new URL("../out/", import.meta.url);
const previewDir = new URL("../static-preview/", import.meta.url);
const aiYFierToolDir = new URL("../public/tools/ai-y-fier/", import.meta.url);
const previewAiYFierToolDir = new URL("tools/ai-y-fier/", previewDir);
const museumAssetDir = new URL("../public/museum/", import.meta.url);
const previewMuseumAssetDir = new URL("museum/", previewDir);
const pricingAssetDir = new URL("../public/pricing/", import.meta.url);
const previewPricingAssetDir = new URL("pricing/", previewDir);

const pages = [
  ["index.html", "index.html"],
  ["museum/index.html", "museum.html"],
  ["artifacts/index.html", "artifacts.html"],
  ["rob/index.html", "rob.html"],
  ["marjan/index.html", "marjan.html"],
  ["reality/index.html", "reality.html"],
  ["unfinished-thoughts/index.html", "unfinished-thoughts.html"],
  ["ai-y-fier/index.html", "ai-y-fier.html"],
  ["meeting-filter/index.html", "meeting-filter.html"],
  ["constitution/index.html", "constitution.html"],
  ["living-decision-review/index.html", "living-decision-review.html"],
  ["pricing/index.html", "pricing.html"],
  ["pricing-documents/index.html", "pricing-documents.html"],
];

const assets = [
  "icon.svg",
  "favicon.ico",
  "favicon.png",
  "apple-icon.png",
  "apple-touch-icon.png",
  "sw.js",
  "dear-rob.png",
  "dear-marjan.png",
  "reality-poster.png",
  "unfinished-thoughts.png",
  "ai-y-fier-hero-inflation-engine.png",
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

const documentViewerScript = `<script>
(function () {
  var steps = [1, 0.82, 0.62, 0.42, 0];
  var image = document.querySelector(".document-image[style*='scale']");
  var controls = document.querySelector(".document-controls");

  if (!image || !controls) return;

  var zoomOut = controls.querySelector("[aria-label='Zoom out']");
  var zoomIn = controls.querySelector("[aria-label='Zoom in']");
  var transform = image.style.transform || "";
  var match = transform.match(/translate\\((-?\\d+(?:\\.\\d+)?)vw,\\s*(-?\\d+(?:\\.\\d+)?)vh\\)\\s*scale\\((-?\\d+(?:\\.\\d+)?)\\)/);

  if (!zoomOut || !zoomIn || !match) return;

  var initialX = parseFloat(image.dataset.initialX || match[1]);
  var initialY = parseFloat(image.dataset.initialY || match[2]);
  var initialScale = parseFloat(image.dataset.initialScale || match[3]);
  var currentStep = parseInt(image.dataset.initialStep || "0", 10);

  function render() {
    var progress = steps[currentStep];
    var scale = 1 + (initialScale - 1) * progress;
    var x = initialX * progress;
    var y = initialY * progress;

    image.style.transform = "translate(-50%, -50%) translate(" + x + "vw, " + y + "vh) scale(" + scale + ")";
    zoomOut.disabled = currentStep === steps.length - 1;
    zoomIn.disabled = currentStep === 0;
  }

  zoomOut.addEventListener("click", function () {
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    render();
  });

  zoomIn.addEventListener("click", function () {
    currentStep = Math.max(currentStep - 1, 0);
    render();
  });

  render();
})();
</script>`;

const meetingFilterScript = `<script>
(function () {
  var filter = document.querySelector("#meeting-filter");
  var intro = document.querySelector("#intro");

  if (!filter) return;

  function openFilter() {
    filter.classList.add("is-open");
    filter.setAttribute("aria-hidden", "false");
    filter.scrollIntoView({ block: "start" });
  }

  function closeFilter() {
    filter.classList.remove("is-open");
    filter.setAttribute("aria-hidden", "true");
    if (intro) intro.scrollIntoView({ block: "start" });
  }

  function syncFromHash() {
    if (window.location.hash === "#meeting-filter") {
      openFilter();
    } else {
      closeFilter();
    }
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var link = target.closest('a[href="#meeting-filter"], a[href="#intro"].meeting-filter-return');
    if (!link) return;

    event.preventDefault();

    if (link.hash === "#meeting-filter") {
      window.history.replaceState(null, "", "#meeting-filter");
      openFilter();
      return;
    }

    window.history.replaceState(null, "", "#intro");
    closeFilter();
  });

  window.addEventListener("hashchange", syncFromHash);
  syncFromHash();
})();
</script>`;

const aiYFierStaticScript = `<script>
(function () {
  var sourceText = document.querySelector("[data-aiy-source]");
  var outputText = document.querySelector("[data-aiy-output]");
  var demoButton = document.querySelector("[data-aiy-demo]");
  var transformButton = document.querySelector("[data-aiy-transform]");
  var copyButton = document.querySelector("[data-aiy-copy]");
  var stripButton = document.querySelector("[data-aiy-strip]");
  var clearButton = document.querySelector("[data-aiy-clear]");
  var resetButton = document.querySelector("[data-aiy-reset]");
  var demoText = "We need to update the customer dashboard so people can find their invoices faster.";

  if (!sourceText || !outputText) return;

  function cleanInput(text) {
    return text.trim().replace(/\\s+/g, " ");
  }

  function aiYfy(text) {
    var source = cleanInput(text);
    if (!source) return "";

    return [
      "AI-Y-FIED (vc, intensity 4)",
      "We are seeing a clear wedge emerge:",
      '"' + source + '"',
      "This is less a task than a compounding product surface with unusually legible demand.",
      "The underlying market signal is simple: make the important action easier to find, trust, and repeat.",
      "The near-term motion creates momentum, reduces workflow drag, and gives the team a credible path to operator-level leverage.",
      "This turns a mundane product fix into a strategic narrative about confidence, speed, and customer-centered execution.",
      "In memo terms: small surface area, high narrative gravity."
    ].join("\\n\\n");
  }

  function transform() {
    outputText.value = aiYfy(sourceText.value);
  }

  function runDemo() {
    sourceText.value = demoText;
    outputText.value = aiYfy(demoText);
    outputText.dispatchEvent(new Event("input", { bubbles: true }));
    outputText.focus();
  }

  if (demoButton) demoButton.addEventListener("click", runDemo);
  if (resetButton) resetButton.addEventListener("click", runDemo);
  if (transformButton) transformButton.addEventListener("click", transform);
  if (stripButton) stripButton.addEventListener("click", function () {
    outputText.value = sourceText.value;
  });
  if (clearButton) clearButton.addEventListener("click", function () {
    sourceText.value = "";
    outputText.value = "";
  });
  if (copyButton) copyButton.addEventListener("click", function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(outputText.value).catch(function () {});
    }
    copyButton.textContent = "Copied";
    window.setTimeout(function () {
      copyButton.textContent = "Copy";
    }, 1200);
  });
  sourceText.addEventListener("input", function () {
    if (!sourceText.value.trim()) outputText.value = "";
  });
})();
</script>`;

const previewIconLinks = `<link rel="icon" href="favicon.ico?v=20260626-favicon" sizes="32x32" />
<link rel="shortcut icon" href="favicon.ico?v=20260626-favicon" />
<link rel="icon" href="favicon.png?v=20260626-favicon" type="image/png" sizes="32x32" />
<link rel="icon" href="icon.svg?v=20260626-favicon" type="image/svg+xml" />
<link rel="apple-touch-icon" href="apple-touch-icon.png?v=20260626-favicon" sizes="180x180" />`;

function inlineCss(html, css) {
  let injected = false;

  return html.replace(
    /<link rel="stylesheet" href="(?:\.\/|\/)?_next\/static\/css\/[^"]+"[^>]*>/g,
    () => {
      if (injected) {
        return "";
      }

      injected = true;
      return `<style>${css}</style>`;
    }
  );
}

function addThemeScripts(html) {
  return html
    .replace(
      "<head>",
      `<head>${themeHeadScript}<meta http-equiv="Cache-Control" content="no-store, max-age=0" /><meta http-equiv="Pragma" content="no-cache" /><meta http-equiv="Expires" content="0" />${previewIconLinks}`
    )
    .replace(
      "</body>",
      `${themeBodyScript}${documentViewerScript}${meetingFilterScript}${aiYFierStaticScript}</body>`
    );
}

function removeRuntime(html) {
  return html
    .replace(/<link rel="preload" as="script"[^>]*>/g, "")
    .replace(/<link rel="(?:shortcut icon|icon|apple-touch-icon)"[^>]*>/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<div hidden="">\s*<\/div>/g, "")
    .replace(/<link rel="icon" href="\/favicon\.ico\?[^"]*"([^>]*)>/g, '<link rel="icon" href="favicon.ico"$1>')
    .replace(/href="\//g, 'href="')
    .replace(/src="\//g, 'src="')
    .replace(/href=""/g, 'href="index.html"')
    .replace(/href="museum"/g, 'href="museum.html"')
    .replace(/href="pricing-documents\/"/g, 'href="pricing-documents.html"')
    .replace(/href="pricing-documents"/g, 'href="pricing-documents.html"')
    .replace(/href="pricing\/"/g, 'href="pricing.html"')
    .replace(/href="pricing"/g, 'href="pricing.html"')
    .replace(/href="artifacts"/g, 'href="artifacts.html"')
    .replace(/href="rob"/g, 'href="rob.html"')
    .replace(/href="marjan"/g, 'href="marjan.html"')
    .replace(/href="reality"/g, 'href="reality.html"')
    .replace(/href="unfinished-thoughts"/g, 'href="unfinished-thoughts.html"')
    .replace(/href="ai-y-fier"/g, 'href="tools/ai-y-fier/index.html"')
    .replace(/href="meeting-filter"/g, 'href="meeting-filter.html"')
    .replace(/href="living-decision-review\/"/g, 'href="living-decision-review.html"')
    .replace(/href="living-decision-review"/g, 'href="living-decision-review.html"')
    .replace(/href="constitution"/g, 'href="constitution.html"');
}

const cssDir = new URL("_next/static/css/", sourceDir);
const cssFiles = (await readdir(cssDir)).filter((file) => file.endsWith(".css")).sort();

if (cssFiles.length === 0) {
  throw new Error("No exported CSS file found.");
}

const css = (
  await Promise.all(cssFiles.map((file) => readFile(new URL(file, cssDir), "utf8")))
).join("\n");

await rm(previewDir, { recursive: true, force: true });
await mkdir(previewDir, { recursive: true });

for (const [sourcePage, targetPage] of pages) {
  const sourcePath = new URL(sourcePage, sourceDir);
  const targetPath = new URL(targetPage, previewDir);
  const html = await readFile(sourcePath, "utf8");
  const standalone = addThemeScripts(removeRuntime(inlineCss(html, css)));
  await writeFile(targetPath, standalone, "utf8");
}

for (const asset of assets) {
  await copyFile(new URL(asset, sourceDir), new URL(asset, previewDir));
}

await cp(aiYFierToolDir, previewAiYFierToolDir, { recursive: true, force: true });
await cp(museumAssetDir, previewMuseumAssetDir, { recursive: true, force: true });
await cp(pricingAssetDir, previewPricingAssetDir, { recursive: true, force: true });

const aiYFierIndexPath = new URL("index.html", previewAiYFierToolDir);
const aiYFierIndex = await readFile(aiYFierIndexPath, "utf8");
await writeFile(
  aiYFierIndexPath,
  aiYFierIndex
    .replace(/href="http:\/\/localhost:3000\/"/g, 'href="../../index.html"')
    .replace(/href="#"/g, 'href="index.html"'),
  "utf8"
);

const aiYFierToolRedirect = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Cache-Control" content="no-store, max-age=0" />
    <meta http-equiv="refresh" content="0; url=../../ai-y-fier.html" />
    <title>AI-y-fier</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #f8fbff;
        background:
          linear-gradient(135deg, rgba(93, 228, 255, 0.18), transparent 34%),
          linear-gradient(225deg, rgba(72, 240, 173, 0.13), transparent 30%),
          #070a12;
      }

      body {
        display: grid;
        min-height: 100vh;
        margin: 0;
        place-items: center;
      }

      main {
        width: min(34rem, calc(100% - 32px));
      }

      a {
        color: #48f0ad;
        font-weight: 900;
      }
    </style>
  </head>
  <body>
    <main>
      <p>Redirecting to the current AI-y-fier preview.</p>
      <p><a href="../../ai-y-fier.html">Open the current AI-y-fier</a></p>
    </main>
    <script>
      window.location.replace("../../ai-y-fier.html");
    </script>
  </body>
</html>
`;

for (const staleAiYFierPage of [
  "index.html",
  "index-v11.html",
  "index-v12.html",
  "index-v13.html",
  "index-v14.html",
]) {
  await writeFile(new URL(staleAiYFierPage, previewAiYFierToolDir), aiYFierToolRedirect, "utf8");
}

console.log(
  `Created standalone preview at ${join(previewDir.pathname, basename("index.html"))}`
);
