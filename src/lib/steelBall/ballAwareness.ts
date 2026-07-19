export type BallPresenceMood =
  | "focused"
  | "playful"
  | "relaxed"
  | "curious"
  | "energetic"
  | "building"
  | "reflective"
  | "hopeful"
  | "restless"
  | "inventive"
  | "unknown";

export type BallAttentionTargetKind =
  | "embassy"
  | "persona"
  | "office-note"
  | "headline"
  | "living-office";

export type BallAttentionTarget = {
  kind: BallAttentionTargetKind;
  label: string;
  selector: string;
  element: Element;
  weight: number;
};

const ATTENTION_SELECTORS: Array<{
  selector: string;
  kind: BallAttentionTargetKind;
  weight: number;
}> = [
  { selector: ".embassy-card, .embassy-home-link, [href*='embass']", kind: "embassy", weight: 0.8 },
  { selector: ".persona-card, .persona-portrait, .ambassador-face", kind: "persona", weight: 0.72 },
  { selector: ".living-office-feed, .office-bell, .living-office", kind: "living-office", weight: 0.58 },
  { selector: ".office-note, .founder-note, blockquote, aside", kind: "office-note", weight: 0.52 },
  { selector: "h1, h2, [data-ball-attention]", kind: "headline", weight: 0.44 },
];

const READING_SELECTOR = [
  "p",
  "article",
  ".long-form",
  ".content-block",
  ".steel-ball-description",
  ".ambassador-profile-copy",
].join(",");

function getLabel(element: Element) {
  const explicit = element.getAttribute("aria-label") ?? element.getAttribute("data-ball-attention");
  const text = explicit ?? element.textContent ?? element.className.toString();

  return text.trim().replace(/\s+/g, " ").slice(0, 72);
}

export function getAttentionTargets(root: ParentNode = document): BallAttentionTarget[] {
  const targets: BallAttentionTarget[] = [];
  const seen = new Set<Element>();

  for (const config of ATTENTION_SELECTORS) {
    root.querySelectorAll(config.selector).forEach((element) => {
      if (seen.has(element)) {
        return;
      }

      seen.add(element);
      targets.push({
        kind: config.kind,
        label: getLabel(element),
        selector: config.selector,
        element,
        weight: config.weight,
      });
    });
  }

  return targets;
}

export function getReadableElementAt(x: number, y: number) {
  const element = document.elementFromPoint(x, y);
  const readable = element?.closest(READING_SELECTOR) ?? null;

  if (!readable) {
    return null;
  }

  const text = readable.textContent?.trim() ?? "";
  return text.length >= 120 ? readable : null;
}

export function getDominantMoodFromDom(): BallPresenceMood {
  const value = document.querySelector(".living-office__indicator em")?.textContent ?? "";
  const mood = value.replace(/global mood:/i, "").trim().toLowerCase();

  if (
    mood === "focused" ||
    mood === "playful" ||
    mood === "relaxed" ||
    mood === "curious" ||
    mood === "energetic" ||
    mood === "building" ||
    mood === "reflective" ||
    mood === "hopeful" ||
    mood === "restless" ||
    mood === "inventive"
  ) {
    return mood;
  }

  return "unknown";
}

export function getOfficeActivityFromDom() {
  const feed = document.querySelector(".living-office-feed");
  const text = feed?.textContent?.trim().replace(/\s+/g, " ") ?? "";

  return text || null;
}

export function getMoodInfluence(mood: BallPresenceMood) {
  switch (mood) {
    case "focused":
      return { motionScale: 0.72, probabilityScale: 0.82, precision: 0.88 };
    case "playful":
    case "hopeful":
      return { motionScale: 1.12, probabilityScale: 1.18, precision: 1 };
    case "restless":
    case "energetic":
      return { motionScale: 0.96, probabilityScale: 1.08, precision: 0.94 };
    case "relaxed":
    case "reflective":
      return { motionScale: 0.82, probabilityScale: 0.9, precision: 0.92 };
    case "building":
    case "inventive":
      return { motionScale: 0.9, probabilityScale: 1, precision: 0.9 };
    default:
      return { motionScale: 1, probabilityScale: 1, precision: 1 };
  }
}
