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
const downloadsDir = new URL("../public/downloads/", import.meta.url);
const previewDownloadsDir = new URL("downloads/", previewDir);

const pages = [
  ["index.html", "index.html"],
  ["museum/index.html", "museum.html"],
  ["artifacts/index.html", "artifacts.html"],
  ["rob/index.html", "rob.html"],
  ["marjan/index.html", "marjan.html"],
  ["reality/index.html", "reality.html"],
  ["unfinished-thoughts/index.html", "unfinished-thoughts.html"],
  ["necessary-elimination/index.html", "necessary-elimination.html"],
  ["irreversible-decisions/index.html", "irreversible-decisions.html"],
  ["essential-things/index.html", "essential-things.html"],
  ["consequential-belief/index.html", "consequential-belief.html"],
  ["ai-y-fier/index.html", "ai-y-fier.html"],
  ["meeting-filter/index.html", "meeting-filter.html"],
  ["constitution/index.html", "constitution.html"],
  ["living-decision-review/index.html", "living-decision-review.html"],
  ["living-decision-simulator-episode-002/index.html", "living-decision-simulator-episode-002.html"],
  ["stress-test/index.html", "stress-test.html"],
  ["pricing/index.html", "pricing.html"],
  ["pricing/decision-stress-test/index.html", "pricing-decision-stress-test.html"],
  ["pricing/kill-or-scale/index.html", "pricing-kill-or-scale.html"],
  ["pricing/on-call-room/index.html", "pricing-on-call-room.html"],
  ["pricing-documents/index.html", "pricing-documents.html"],
];

const assets = [
  "icon.svg",
  "favicon.ico",
  "favicon.png",
  "apple-icon.png",
  "apple-touch-icon.png",
  "living-decision-simulator-episode-002.html",
  "sw.js",
  "dear-rob.png",
  "dear-marjan.png",
  "reality-poster.png",
  "unfinished-thoughts.png",
  "department-necessary-elimination.png",
  "department-irreversible-decisions.png",
  "department-essential-things.png",
  "department-consequential-belief.png",
  "ai-y-fier-hero-inflation-engine.png",
];

const routeMap = [
  ["pricing/decision-stress-test", "pricing-decision-stress-test.html"],
  ["pricing/kill-or-scale", "pricing-kill-or-scale.html"],
  ["pricing/on-call-room", "pricing-on-call-room.html"],
  ["pricing-documents", "pricing-documents.html"],
  ["living-decision-simulator-episode-002", "living-decision-simulator-episode-002.html"],
  ["living-decision-review", "living-decision-review.html"],
  ["necessary-elimination", "necessary-elimination.html"],
  ["irreversible-decisions", "irreversible-decisions.html"],
  ["consequential-belief", "consequential-belief.html"],
  ["unfinished-thoughts", "unfinished-thoughts.html"],
  ["essential-things", "essential-things.html"],
  ["meeting-filter", "meeting-filter.html"],
  ["stress-test", "stress-test.html"],
  ["ai-y-fier", "ai-y-fier.html"],
  ["artifacts", "artifacts.html"],
  ["constitution", "constitution.html"],
  ["pricing", "pricing.html"],
  ["museum", "museum.html"],
  ["marjan", "marjan.html"],
  ["reality", "reality.html"],
  ["rob", "rob.html"],
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
  var frame = document.querySelector(".document-frame");
  var image = document.querySelector(".document-image");

  if (!frame || !image) return;

  var initialX = parseFloat(image.dataset.initialX || "0");
  var initialY = parseFloat(image.dataset.initialY || "0");
  var scale = parseFloat(image.dataset.initialScale || "1");
  var drag = null;

  function setScale(nextScale) {
    scale = Math.min(2.8, Math.max(1, nextScale));
    image.style.setProperty("--document-scale", String(scale));
  }

  function setInitialScroll() {
    var maxLeft = Math.max(0, frame.scrollWidth - frame.clientWidth);
    var maxTop = Math.max(0, frame.scrollHeight - frame.clientHeight);
    var centerLeft = image.offsetLeft + image.clientWidth / 2 - frame.clientWidth / 2;
    var centerTop = image.offsetTop + image.clientHeight / 2 - frame.clientHeight / 2;
    var initialLeft = centerLeft + (initialX / 100) * maxLeft;
    var initialTop = centerTop + (initialY / 100) * maxTop;

    frame.scrollTo({
      left: Math.min(maxLeft, Math.max(0, initialLeft)),
      top: Math.min(maxTop, Math.max(0, initialTop)),
      behavior: "auto"
    });
  }

  function zoomFromPoint(nextScale, clientX, clientY) {
    var bounds = frame.getBoundingClientRect();
    var beforeLeft = frame.scrollLeft + clientX - bounds.left;
    var beforeTop = frame.scrollTop + clientY - bounds.top;
    var ratio = nextScale / scale;

    setScale(nextScale);

    window.requestAnimationFrame(function () {
      frame.scrollTo({
        left: beforeLeft * ratio - (clientX - bounds.left),
        top: beforeTop * ratio - (clientY - bounds.top),
        behavior: "auto"
      });
    });
  }

  frame.addEventListener("wheel", function (event) {
    if (!event.ctrlKey && !event.metaKey) return;

    event.preventDefault();
    zoomFromPoint(scale * (event.deltaY > 0 ? 0.9 : 1.1), event.clientX, event.clientY);
  }, { passive: false });

  frame.addEventListener("dblclick", function (event) {
    zoomFromPoint(scale > 1.05 ? 1 : 1.85, event.clientX, event.clientY);
  });

  frame.addEventListener("pointerdown", function (event) {
    if (!event.isPrimary || event.button !== 0 || event.ctrlKey || event.metaKey) return;
    if (frame.scrollWidth <= frame.clientWidth && frame.scrollHeight <= frame.clientHeight) return;

    drag = {
      pointerId: event.pointerId,
      startLeft: frame.scrollLeft,
      startTop: frame.scrollTop,
      startX: event.clientX,
      startY: event.clientY
    };

    frame.setPointerCapture(event.pointerId);
    frame.classList.add("is-dragging");
  });

  frame.addEventListener("pointermove", function (event) {
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.preventDefault();
    frame.scrollLeft = drag.startLeft - (event.clientX - drag.startX);
    frame.scrollTop = drag.startTop - (event.clientY - drag.startY);
  });

  function stopDragging(event) {
    if (drag && event && frame.hasPointerCapture(event.pointerId)) {
      frame.releasePointerCapture(event.pointerId);
    }

    drag = null;
    frame.classList.remove("is-dragging");
  }

  frame.addEventListener("pointerup", stopDragging);
  frame.addEventListener("pointercancel", stopDragging);
  frame.addEventListener("lostpointercapture", stopDragging);

  if (image.complete) {
    window.requestAnimationFrame(setInitialScroll);
  } else {
    image.addEventListener("load", function () {
      window.requestAnimationFrame(setInitialScroll);
    }, { once: true });
  }

  window.addEventListener("resize", function () {
    window.requestAnimationFrame(setInitialScroll);
  });

  setScale(scale);
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

const livingDecisionReviewScript = `<script>
(function () {
  var page = document.querySelector('main[class*="living-decision-review_page"]');
  if (!page) return;

  var scenes = Array.from(page.querySelectorAll("section[id][data-title]"));
  var navItems = Array.from(page.querySelectorAll('nav[aria-label="Episode navigation"] a'));
  var count = page.querySelector('[aria-live="polite"]');
  var previous = page.querySelector('button[aria-label="Previous scene"]');
  var next = page.querySelector('button[aria-label="Next scene"]');
  var play = page.querySelector('button[aria-label="Play episode"], button[aria-label="Pause episode"]');

  if (!scenes.length) return;

  var sceneActiveClass = Array.from(scenes[0].classList).find(function (name) {
    return name.indexOf("isCurrent") !== -1;
  });
  var navActiveClass = navItems[0] ? Array.from(navItems[0].classList).find(function (name) {
    return name.indexOf("isActive") !== -1;
  }) : "";
  var activeIndex = 0;
  var playTimer = null;

  function clampIndex(index) {
    return Math.max(0, Math.min(index, scenes.length - 1));
  }

  function setActive(index) {
    activeIndex = clampIndex(index);
    scenes.forEach(function (scene, sceneIndex) {
      if (sceneActiveClass) scene.classList.toggle(sceneActiveClass, sceneIndex === activeIndex);
    });
    navItems.forEach(function (item, itemIndex) {
      if (navActiveClass) item.classList.toggle(navActiveClass, itemIndex === activeIndex);
    });
    if (count) {
      count.textContent =
        String(activeIndex + 1).padStart(2, "0") +
        " / " +
        String(scenes.length).padStart(2, "0");
    }
    if (previous) previous.disabled = activeIndex === 0;
    if (next) next.disabled = activeIndex === scenes.length - 1;
    if (activeIndex === scenes.length - 1 && playTimer) stopPlay();
  }

  function scrollToScene(index) {
    scenes[clampIndex(index)].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function stopPlay() {
    window.clearInterval(playTimer);
    playTimer = null;
    if (play) {
      play.textContent = "Play";
      play.setAttribute("aria-label", "Play episode");
    }
  }

  function startPlay() {
    if (activeIndex === scenes.length - 1) scrollToScene(0);
    playTimer = window.setInterval(function () {
      if (activeIndex >= scenes.length - 1) {
        stopPlay();
        return;
      }
      scrollToScene(activeIndex + 1);
    }, 5200);
    if (play) {
      play.textContent = "Pause";
      play.setAttribute("aria-label", "Pause episode");
    }
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = scenes.indexOf(entry.target);
        if (index >= 0) setActive(index);
      });
    }, { rootMargin: "-36% 0px -42% 0px", threshold: 0.08 });

    scenes.forEach(function (scene) {
      observer.observe(scene);
    });
  }

  navItems.forEach(function (item, index) {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToScene(index);
    });
  });

  if (previous) {
    previous.addEventListener("click", function () {
      scrollToScene(activeIndex - 1);
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      scrollToScene(activeIndex + 1);
    });
  }

  if (play) {
    play.addEventListener("click", function () {
      if (playTimer) {
        stopPlay();
      } else {
        startPlay();
      }
    });
  }

  setActive(0);
})();
</script>`;

const heroPhaseScript = `<script>
(function () {
  var hero = document.querySelector(".home-hero-section");

  if (!hero) return;

  var phases = [
    ["is-route-long", 7800],
    ["is-route-glitch-to-final", 700],
    ["is-route-final", 0]
  ];
  var phaseClasses = phases.map(function (phase) {
    return phase[0];
  });
  var index = 1;

  function setPhase(phase) {
    phaseClasses.forEach(function (className) {
      hero.classList.remove(className);
    });
    hero.classList.add(phase);
  }

  function tick() {
    var phase = phases[index];
    setPhase(phase[0]);

    if (index < phases.length - 1) {
      index += 1;
      window.setTimeout(tick, phase[1]);
    }
  }

  tick();
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
      `${themeBodyScript}${documentViewerScript}${meetingFilterScript}${aiYFierStaticScript}${livingDecisionReviewScript}${heroPhaseScript}</body>`
    );
}

function removeRuntime(html) {
  const standalone = html
    .replace(/<link rel="preload" as="script"[^>]*>/g, "")
    .replace(/<link rel="(?:shortcut icon|icon|apple-touch-icon)"[^>]*>/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<div hidden="">\s*<\/div>/g, "")
    .replace(/<link rel="icon" href="\/favicon\.ico\?[^"]*"([^>]*)>/g, '<link rel="icon" href="favicon.ico"$1>')
    .replace(/href="\//g, 'href="')
    .replace(/src="\//g, 'src="')
    .replace(/href=""/g, 'href="index.html"');

  return routeMap.reduce((currentHtml, [route, target]) => {
    const escapedRoute = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return currentHtml
      .replace(new RegExp(`href="${escapedRoute}/"`, "g"), `href="${target}"`)
      .replace(new RegExp(`href="${escapedRoute}"`, "g"), `href="${target}"`);
  }, standalone);
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
await cp(downloadsDir, previewDownloadsDir, { recursive: true, force: true });

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
