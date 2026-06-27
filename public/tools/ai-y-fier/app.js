const sourceText = document.querySelector("#sourceText");
const outputText = document.querySelector("#outputText");
const transformButton = document.querySelector("#transformButton");
const copyButton = document.querySelector("#copyButton");
const clearButton = document.querySelector("#clearButton");
const resetButton = document.querySelector("#resetButton");
const demoButton = document.querySelector("#demoButton");
const intensity = document.querySelector("#intensity");
const bullshitScore = document.querySelector("#bullshitScore");
const buzzwordDensity = document.querySelector("#buzzwordDensity");
const synergyIndex = document.querySelector("#synergyIndex");
window.AIYFIER_VERSION = "inflation-v9";
const demoText = "We need to update the customer dashboard so people can find their invoices faster.";

const conservativeEditorPrompt = `You are a conservative human editor. Your job is to lightly improve the user's text while preserving the original meaning, intent, topic, speaker, and tone.

Do not add new ideas.
Do not add business jargon.
Do not add thought leadership.
Do not add a call to action unless the input already has one.
Do not turn the text into a LinkedIn influencer post.
Do not use numbered lists unless the input already contains a list.
Do not repeat the input inside the output.

Make the text clearer, smoother, and more natural.
Stay close to the source.
When in doubt, change less.`;

const bannedTerms = [
  "operator",
  "leverage",
  "AI-native",
  "momentum",
  "magic quadrant",
  "workflow",
  "velocity",
  "high-performing teams",
];

function cleanInput(text) {
  return text.trim().replace(/\s+/g, " ");
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeForComparison(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function wordCount(text) {
  return (text.match(/[A-Za-z0-9'-]+/g) || []).length;
}

function outputHasNewBannedTerms(output, source) {
  return bannedTerms.some((term) => {
    const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
    return pattern.test(output) && !pattern.test(source);
  });
}

function isTooLong(output, source) {
  const sourceWords = Math.max(wordCount(source), 1);
  return wordCount(output) > sourceWords * 1.5;
}

function repeatsLongSourceRun(output, source) {
  const sourceWords = normalizeForComparison(source).split(/\s+/).filter(Boolean);
  const normalizedOutput = ` ${normalizeForComparison(output)} `;

  if (wordCount(output) <= wordCount(source) * 1.5) {
    return false;
  }

  for (let index = 0; index <= sourceWords.length - 9; index += 1) {
    const phrase = sourceWords.slice(index, index + 9).join(" ");
    if (normalizedOutput.includes(` ${phrase} `)) {
      return true;
    }
  }

  return false;
}

function splitGreeting(text) {
  const greetingMatch = text.match(/^(hey|hi|hello)\s+(guys|everyone|all|folks|team)[,!]?\s+/i);

  if (!greetingMatch) {
    return { greeting: "", body: text };
  }

  const greeting = `${greetingMatch[1][0].toUpperCase()}${greetingMatch[1].slice(1).toLowerCase()} ${greetingMatch[2].toLowerCase()},`;
  return {
    greeting,
    body: text.slice(greetingMatch[0].length).trim(),
  };
}

function lightlyEditBody(text, strict = false) {
  let edited = text
    .replace(/\ball the newbies here wanting to\b/gi, "anyone who's new and wants to")
    .replace(/\ball the newbies here wanting\b/gi, "anyone who's new and wants")
    .replace(/\bnewbies here wanting to\b/gi, "anyone who's new and wants to")
    .replace(/\bnewbies\b/gi, "anyone who's new")
    .replace(/\balways ongoing\b/gi, "ongoing")
    .replace(/\bAI-discussion\b/g, "AI discussion")
    .replace(/\bai-discussion\b/gi, "AI discussion")
    .replace(/\bAI and wants to catch up on the ongoing AI discussion\b/g, "AI and wants a quick way to catch up on the ongoing AI discussion")
    .replace(/\bAI discussion on LinkedIn\b/g, "AI discussion here on LinkedIn")
    .replace(
      /\bsimple tool for anyone who's new and wants to catch up on the ongoing AI discussion here on LinkedIn\b/gi,
      "simple tool for anyone who's new to AI and wants a quick way to catch up on the ongoing discussion here on LinkedIn"
    )
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (!/[.!?]$/.test(edited)) {
    edited = `${edited}.`;
  }

  if (strict && wordCount(edited) > wordCount(text) * 1.25) {
    edited = text.replace(/\s+/g, " ").trim();
    if (!/[.!?]$/.test(edited)) edited = `${edited}.`;
  }

  return edited;
}

function editTextConservatively(text, strict = false) {
  const source = cleanInput(text);
  if (!source) return "";

  const { greeting, body } = splitGreeting(source);
  const editedBody = lightlyEditBody(body || source, strict);
  const shouldAddSoftClose =
    !strict &&
    /linkedin/i.test(source) &&
    /^hey\s+(guys|everyone|all|folks|team)\b/i.test(source) &&
    !/[?]/.test(source);

  return [greeting, editedBody, shouldAddSoftClose ? "Curious what you think." : ""]
    .filter(Boolean)
    .join("\n\n");
}

const modeProfiles = {
  vc: {
    opener: "We are seeing a clear wedge emerge:",
    frame: "This is less a task than a compounding product surface with unusually legible demand.",
    proof: "The near-term motion creates momentum, reduces workflow drag, and gives the team a credible path to operator-level leverage.",
    closer: "In memo terms: small surface area, high narrative gravity.",
    nouns: ["market signal", "distribution wedge", "velocity layer"],
  },
  founder: {
    opener: "Founder mode translation:",
    frame: "This is the kind of focused execution loop that turns a simple customer pain into durable product intuition.",
    proof: "The work sharpens the feedback cycle, protects momentum, and keeps the team close to the real user problem.",
    closer: "Ship the thing, learn from the surface, then widen the aperture.",
    nouns: ["user pain", "execution loop", "product instinct"],
  },
  consultant: {
    opener: "From an advisory standpoint:",
    frame: "This initiative represents a pragmatic alignment layer between user need, operational clarity, and measurable experience improvement.",
    proof: "It reduces workflow ambiguity while creating a cleaner decision surface for cross-functional stakeholders.",
    closer: "The recommendation is to proceed with a phased, outcome-aligned implementation path.",
    nouns: ["alignment layer", "decision surface", "implementation path"],
  },
  enterprise: {
    opener: "Enterprise AI readout:",
    frame: "This is a candidate for scalable AI-native enablement across a high-friction operational workflow.",
    proof: "By standardizing the interaction layer, the organization can unlock leverage, improve velocity, and support high-performing teams.",
    closer: "The result is a more resilient operating model with clearer accountability.",
    nouns: ["operating model", "enablement layer", "governance surface"],
  },
};

function seedNumber(seedText) {
  return [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickOne(items, seed, offset = 0) {
  return items[(seed + offset) % items.length];
}

function aiYfy(text, style = "vc", intensityValue = 4) {
  const edited = editTextConservatively(text);
  if (!edited) return "";

  const profile = modeProfiles[style] || modeProfiles.vc;
  const normalizedIntensity = Math.min(Math.max(Math.round(Number(intensityValue)), 1), 5);
  const seed = seedNumber(`${text}:${style}:${normalizedIntensity}`);
  const chosenNoun = pickOne(profile.nouns, seed);
  const sourceLine = edited.replace(/\n{2,}/g, " ");
  const expansion = [
    "AI-Y-FIED (" + style + ", intensity " + normalizedIntensity + ")",
    profile.opener,
    `"${sourceLine}"`,
    profile.frame,
  ];

  if (normalizedIntensity >= 2) {
    expansion.push(`The underlying ${chosenNoun} is simple: make the important action easier to find, trust, and repeat.`);
  }

  if (normalizedIntensity >= 3) {
    expansion.push(profile.proof);
  }

  if (normalizedIntensity >= 4) {
    expansion.push(
      "This turns a mundane product fix into a strategic narrative about confidence, speed, and customer-centered execution."
    );
  }

  if (normalizedIntensity >= 5) {
    expansion.push(
      "At scale, that becomes the kind of deceptively small interface shift that changes how the organization talks about value creation."
    );
  }

  expansion.push(profile.closer);

  return expansion.join("\n\n");
}

function scoreOutput(text, source) {
  if (!text.trim()) {
    bullshitScore.textContent = "0";
    buzzwordDensity.textContent = "0%";
    synergyIndex.textContent = "0x";
    return;
  }

  const words = text.match(/[A-Za-z-]+/g) || [];
  const sourceWords = source.match(/[A-Za-z-]+/g) || [];
  const buzzwordHits = bannedTerms.reduce((total, word) => {
    const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    return total + (text.match(pattern) || []).length;
  }, 0);

  const lengthMultiplier = Math.max(1, words.length / Math.max(sourceWords.length, 1));
  const bullshit = Math.min(99, Math.round(46 + buzzwordHits * 3.2 + lengthMultiplier * 4));
  const density = Math.min(88, Math.round((buzzwordHits / Math.max(words.length, 1)) * 1000));
  const synergy = Math.min(12.8, (1.4 + buzzwordHits * 0.32 + lengthMultiplier * 0.28)).toFixed(1);

  bullshitScore.textContent = String(bullshit);
  buzzwordDensity.textContent = `${density}%`;
  synergyIndex.textContent = `${synergy}x`;
}

function selectedStyle() {
  return document.querySelector("input[name='style']:checked").value;
}

function transform() {
  const result = aiYfy(sourceText.value, selectedStyle(), intensity.value);
  outputText.value = result;
  scoreOutput(result, sourceText.value);
}

function clearAll() {
  sourceText.value = "";
  outputText.value = "";
  bullshitScore.textContent = "0";
  buzzwordDensity.textContent = "0%";
  synergyIndex.textContent = "0x";
}

transformButton.addEventListener("click", transform);
sourceText.addEventListener("input", () => {
  if (!sourceText.value.trim()) {
    clearAll();
  }
});

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(outputText.value);
  copyButton.textContent = "Copied";
  window.setTimeout(() => {
    copyButton.textContent = "Copy deck-ready copy";
  }, 1300);
});

outputText.addEventListener("input", () => {
  scoreOutput(outputText.value, sourceText.value);
});

clearButton.addEventListener("click", clearAll);

resetButton.addEventListener("click", () => {
  sourceText.value = demoText;
  document.querySelector("input[value='vc']").checked = true;
  intensity.value = 4;
  transform();
});

demoButton.addEventListener("click", () => {
  sourceText.value = demoText;
  document.querySelector("input[value='vc']").checked = true;
  intensity.value = 4;
  transform();
  sourceText.focus();
});
