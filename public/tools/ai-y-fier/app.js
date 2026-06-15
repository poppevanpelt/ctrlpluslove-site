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

const buzzwords = [
  "agentic",
  "AI-native",
  "composable",
  "outcome-aligned",
  "zero-friction",
  "full-stack",
  "semantic",
  "operating layer",
  "category-defining",
  "human-in-the-loop",
  "strategic",
  "autonomous",
  "cross-functional",
  "enterprise-grade",
  "flywheel",
  "modalities",
  "workflow fabric",
  "velocity",
  "platform shift",
  "north star",
  "paradigm",
  "latent value",
  "knowledge graph",
  "decision intelligence",
  "compounding",
  "mission-critical",
  "alignment layer",
];

const actionVerbs = [
  "operationalize",
  "orchestrate",
  "leverage",
  "unlock",
  "accelerate",
  "de-risk",
  "replatform",
  "synthesize",
  "institutionalize",
  "productize",
];

const styleConfig = {
  vc: {
    title: "VC Memo",
    opener: "We believe this represents a category-defining opportunity to",
    frame:
      "By reframing the underlying user intent as a scalable market primitive, the initiative becomes a high-conviction wedge into a much larger workflow fabric.",
    close:
      "The result is a venture-scale narrative with clear expansion potential, measurable urgency, and the kind of inevitable momentum that sophisticated capital can underwrite.",
  },
  founder: {
    title: "Founder Mode",
    opener: "We are not merely executing; we are personally bending reality to",
    frame:
      "This demands extreme ownership, taste, speed, and a refusal to accept the legacy assumption that practical work should be described practically.",
    close:
      "We will ship the wedge, own the narrative, and turn every mundane constraint into an unfair advantage.",
  },
  consultant: {
    title: "Consultant Fog",
    opener: "Our recommendation is to initiate a phased transformation program that will",
    frame:
      "The path forward requires stakeholder calibration, capability mapping, and a governance-backed operating model to ensure value capture across the end-to-end journey.",
    close:
      "This creates a durable transformation architecture while preserving optionality for future workstreams, steering committees, and premium advisory extensions.",
  },
  enterprise: {
    title: "Enterprise AI",
    opener: "The platform should deploy an enterprise-grade AI orchestration layer to",
    frame:
      "By embedding policy-aware automation into the system of record, teams can operationalize knowledge assets without compromising trust, controls, or quarterly roadmap theater.",
    close:
      "This positions the organization to accelerate adoption, reduce cognitive load, and establish an AI-native foundation for durable digital excellence.",
  },
};

function cleanInput(text) {
  return text.trim().replace(/\s+/g, " ");
}

function sentenceCase(text) {
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1).replace(/[.!?]+$/, "");
}

function pickBuzzwords(count, seedText) {
  const seed = [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Array.from({ length: count }, (_, index) => buzzwords[(seed + index * 7) % buzzwords.length]);
}

function aiYfy(text, style, level) {
  const original = cleanInput(text);
  if (!original) {
    return "";
  }

  const config = styleConfig[style];
  const picked = pickBuzzwords(6 + Number(level), original);
  const verbs = Array.from({ length: Number(level) + 3 }, (_, index) => {
    const seed = original.length + index * 3;
    return actionVerbs[seed % actionVerbs.length];
  });
  const normalized = sentenceCase(original);
  const expansion = [
    `${config.opener} ${normalized}.`,
    `In practical terms, this means converting the existing request into a capability shaped by ${picked[0]}, ${picked[1]}, and ${picked[2]}, helping stakeholders experience the original outcome with substantially more confidence and ceremonial altitude.`,
    config.frame,
  ];

  for (let i = 0; i < Number(level); i += 1) {
    expansion.push(
      `At layer ${i + 1}, we ${verbs[i]} the ${picked[(i + 5) % picked.length]} operating model so the organization can ${verbs[i + 1]} a measurable ${picked[(i + 8) % picked.length]} outcome without losing fidelity to the simple thing that needed to happen in the first place.`
    );
  }

  expansion.push(config.close);
  return expansion.join(" ");
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
  const buzzwordHits = buzzwords.reduce((total, word) => {
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
  sourceText.value = "We need to update the customer dashboard so people can find their invoices faster.";
  document.querySelector("input[value='vc']").checked = true;
  intensity.value = 4;
  transform();
});

demoButton.addEventListener("click", () => {
  sourceText.focus();
  sourceText.select();
});
