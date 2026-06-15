"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./ai-y-fier.module.css";

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

const stylesByMode = {
  vc: {
    opener: "We believe this represents a category-defining opportunity to",
    frame:
      "By reframing the underlying user intent as a scalable market primitive, the initiative becomes a high-conviction wedge into a much larger workflow fabric.",
    close:
      "The result is a venture-scale narrative with clear expansion potential, measurable urgency, and the kind of inevitable momentum that sophisticated capital can underwrite.",
  },
  founder: {
    opener: "We are not merely executing; we are personally bending reality to",
    frame:
      "This demands extreme ownership, taste, speed, and a refusal to accept the legacy assumption that practical work should be described practically.",
    close:
      "We will ship the wedge, own the narrative, and turn every mundane constraint into an unfair advantage.",
  },
  consultant: {
    opener: "Our recommendation is to initiate a phased transformation program that will",
    frame:
      "The path forward requires stakeholder calibration, capability mapping, and a governance-backed operating model to ensure value capture across the end-to-end journey.",
    close:
      "This creates a durable transformation architecture while preserving optionality for future workstreams, steering committees, and premium advisory extensions.",
  },
  enterprise: {
    opener: "The platform should deploy an enterprise-grade AI orchestration layer to",
    frame:
      "By embedding policy-aware automation into the system of record, teams can operationalize knowledge assets without compromising trust, controls, or quarterly roadmap theater.",
    close:
      "This positions the organization to accelerate adoption, reduce cognitive load, and establish an AI-native foundation for durable digital excellence.",
  },
};

type Mode = keyof typeof stylesByMode;

const modeNames: Record<Mode, string> = {
  vc: "VC Memo",
  founder: "Founder Mode",
  consultant: "Consultant Fog",
  enterprise: "Enterprise AI",
};

function cleanInput(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function sentenceCase(text: string) {
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1).replace(/[.!?]+$/, "");
}

function pickBuzzwords(count: number, seedText: string) {
  const seed = [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Array.from({ length: count }, (_, index) => buzzwords[(seed + index * 7) % buzzwords.length]);
}

function metricList(items: string[]) {
  return items.map((item) => item.toUpperCase()).join(" / ");
}

function aiYfy(text: string, mode: Mode, level: number) {
  const original = cleanInput(text);
  if (!original) return "";

  const config = stylesByMode[mode];
  const picked = pickBuzzwords(12 + level, `${mode}:${original}`);
  const verbs = Array.from({ length: level + 3 }, (_, index) => {
    const seed = original.length + mode.length + index * 3;
    return actionVerbs[seed % actionVerbs.length];
  });
  const normalized = sentenceCase(original);
  const originalSentence = `${config.opener} ${normalized}.`;
  const requestedOutcome = `The underlying ask remains unchanged: ${normalized}.`;

  if (mode === "vc") {
    const layers = Array.from({ length: level }, (_, index) => {
      const first = picked[(index + 4) % picked.length];
      const second = picked[(index + 8) % picked.length];
      return `Proof point ${index + 1}: the ${first} wedge expands naturally into a ${second} surface area once stakeholders realize the original request was actually a platform-shaped inevitability.`;
    });

    return [
      originalSentence,
      `Thesis: this is not a task; it is an entry point into ${picked[0]}, ${picked[1]}, and ${picked[2]} demand capture.`,
      `Market signal: teams already feel the pain, they simply lack the vocabulary to call it ${picked[3]}.`,
      ...layers,
      requestedOutcome,
      config.close,
    ].join(" ");
  }

  if (mode === "founder") {
    const mandates = Array.from({ length: level }, (_, index) => {
      return `We will ${verbs[index]} until the ${picked[(index + 2) % picked.length]} layer stops behaving like a meeting topic and starts behaving like momentum.`;
    });

    return [
      originalSentence,
      `No committee needs to discover this twice. The move is to preserve the simple intent, remove the apologetic language, and force the organization to experience ${picked[0]} velocity.`,
      ...mandates,
      `What matters is not whether this sounds reasonable. What matters is whether it makes the original thing happen with more conviction, more surface area, and fewer ambient excuses.`,
      requestedOutcome,
      config.close,
    ].join(" ");
  }

  if (mode === "consultant") {
    const workstreams = Array.from({ length: level }, (_, index) => {
      return `Workstream ${index + 1} will ${verbs[index]} ${picked[(index + 3) % picked.length]} alignment, establish a ${picked[(index + 6) % picked.length]} governance cadence, and translate the original need into accountable stakeholder motion.`;
    });

    return [
      `Executive summary: ${normalized}.`,
      `Recommended posture: treat the request as a managed transformation from operational friction to ${picked[0]} value realization.`,
      config.frame,
      ...workstreams,
      `Success will be measured through ${metricList([picked[1], picked[4], picked[7]])}, with appropriate caveats around adoption, enablement, and narrative continuity.`,
      requestedOutcome,
      config.close,
    ].join(" ");
  }

  const enterpriseLayers = Array.from({ length: level }, (_, index) => {
    return `Capability layer ${index + 1}: ${verbs[index]} policy-aware ${picked[(index + 5) % picked.length]} across the workflow, then expose it through a trust-calibrated interface that keeps the original user outcome intact.`;
  });

  return [
    originalSentence,
    `Reference architecture: a ${picked[0]} control plane, a ${picked[1]} experience layer, and a ${picked[2]} feedback loop operating above the existing system of record.`,
    config.frame,
    ...enterpriseLayers,
    `Deployment posture: launch quietly, measure loudly, and call the whole thing ${picked[3]} enablement before anyone asks why the request used to fit in one sentence.`,
    requestedOutcome,
    config.close,
  ].join(" ");
}

function scoreOutput(text: string, source: string) {
  if (!text.trim()) {
    return {
      bullshit: "0",
      density: "0%",
      synergy: "0x",
    };
  }

  const words = text.match(/[A-Za-z-]+/g) || [];
  const sourceWords = source.match(/[A-Za-z-]+/g) || [];
  const buzzwordHits = buzzwords.reduce((total, word) => {
    const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    return total + (text.match(pattern) || []).length;
  }, 0);
  const lengthMultiplier = Math.max(1, words.length / Math.max(sourceWords.length, 1));

  return {
    bullshit: String(Math.min(99, Math.round(46 + buzzwordHits * 3.2 + lengthMultiplier * 4))),
    density: `${Math.min(88, Math.round((buzzwordHits / Math.max(words.length, 1)) * 1000))}%`,
    synergy: `${Math.min(12.8, 1.4 + buzzwordHits * 0.32 + lengthMultiplier * 0.28).toFixed(1)}x`,
  };
}

export default function AiYFierClient() {
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("vc");
  const [intensity, setIntensity] = useState(4);
  const scores = useMemo(() => scoreOutput(output, source), [output, source]);

  function transform() {
    setOutput(aiYfy(source, mode, intensity));
  }

  function clearAll() {
    setSource("");
    setOutput("");
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link className={styles.siteLink} href="/">
          ctrl+love
        </Link>
        <a className={styles.brand} href="#product" aria-label="AI-y-fier home">
          <span className={styles.brandMark}>A</span>
          <span>AI-y-fier</span>
        </a>
        <nav className={styles.navActions} aria-label="Company links">
          <a href="#product">Product</a>
          <a href="#metrics">Metrics</a>
          <a href="#waitlist">Enterprise</a>
        </nav>
        <button className={styles.demoButton} type="button" onClick={() => setSource("We need to update the customer dashboard so people can find their invoices faster.")}>
          Book a demo
        </button>
      </header>

      <Link className={styles.homeRibbon} href="/">
        Part of ctrl+love. Return to the main site →
      </Link>

      <section className={styles.hero} id="product">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Narrative infrastructure for modern teams</p>
          <h1>Turn perfectly normal sentences into board-approved AI gravity.</h1>
          <p className={styles.lede}>
            Paste mundane text. Select a transformation style. Receive a maximally confident,
            abstract, lengthened artifact that preserves the original meaning while radiating
            funded inevitability.
          </p>
          <div className={styles.trustRow}>
            <span>Backed by vibes</span>
            <span>0 patents pending</span>
            <span>SOC 2 adjacent</span>
          </div>
        </div>

        <section className={styles.terminalPanel} aria-label="Live funding signal">
          <Image
            className={styles.heroVisual}
            src="/ai-y-fier-hero.png"
            alt="Glossy abstract AI dashboard panels for AI-y-fier"
            width={1280}
            height={720}
            priority
          />
          <div className={styles.terminalHeader}>
            <span />
            <span />
            <span />
          </div>
          <p className={styles.terminalKicker}>LIVE MODEL OUTPUT</p>
          <p className={styles.terminalLine}>
            We are operationalizing semantic surplus through a venture-native confidence layer.
          </p>
          <div className={styles.fundingMeter} aria-hidden="true">
            <span />
          </div>
          <p className={styles.terminalFootnote}>Confidence allocated across every clause.</p>
        </section>
      </section>

      <section className={styles.workspace} aria-label="AI-y-fier generator">
        <div className={styles.composer}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Input</p>
            <h2>Mundane text</h2>
          </div>
          <textarea
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              if (!event.target.value.trim()) setOutput("");
            }}
            spellCheck
            aria-label="Mundane text to transform"
            placeholder="Paste something mundane, then press AI-y-fy this."
          />

          <div className={styles.controls}>
            <fieldset>
              <legend>Transformation style</legend>
              <div className={styles.styleGrid}>
                {[
                  "vc",
                  "founder",
                  "consultant",
                  "enterprise",
                ].map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="style"
                      value={value}
                      checked={mode === value}
                      onChange={() => setMode(value as Mode)}
                    />
                    <span>{modeNames[value as Mode]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className={styles.intensityControl}>
              <span>Inflation intensity</span>
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
              />
            </label>
          </div>

          <button className={styles.primaryAction} type="button" onClick={transform}>
            AI-y-fy this
          </button>
        </div>

        <aside className={styles.results} aria-live="polite">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Output</p>
            <h2>Strategic narrative</h2>
          </div>
          <article className={styles.outputCard}>
            <textarea
              value={output}
              onChange={(event) => setOutput(event.target.value)}
              spellCheck
              aria-label="Generated strategic narrative"
            />
          </article>
          <div className={styles.resultActions}>
            <button type="button" onClick={() => navigator.clipboard.writeText(output)}>
              Copy deck-ready copy
            </button>
            <button type="button" onClick={clearAll}>
              Clear all
            </button>
            <button
              type="button"
              onClick={() => {
                const demo = "We need to update the customer dashboard so people can find their invoices faster.";
                setSource(demo);
                setMode("vc");
                setIntensity(4);
                setOutput(aiYfy(demo, "vc", 4));
              }}
            >
              Reset
            </button>
          </div>
        </aside>
      </section>

      <section className={styles.metricsBand} id="metrics" aria-label="Generated metrics">
        <article>
          <span>Bullshit Score</span>
          <strong>{scores.bullshit}</strong>
          <span>Investor-grade certainty</span>
        </article>
        <article>
          <span>Buzzword Density</span>
          <strong>{scores.density}</strong>
          <span>Jargon per useful noun</span>
        </article>
        <article>
          <span>Synergy Index</span>
          <strong>{scores.synergy}</strong>
          <span>Cross-functional aura</span>
        </article>
      </section>

      <section className={styles.investorProof} id="waitlist">
        <div>
          <p className={styles.eyebrow}>Enterprise-ready theater</p>
          <h2>The only platform purpose-built to add length without adding accountability.</h2>
        </div>
        <div className={styles.proofGrid}>
          <span>Agentic</span>
          <span>Composable</span>
          <span>Outcome-aligned</span>
          <span>Paradigm-safe</span>
          <span>AI-native</span>
          <span>Roadmap-positive</span>
        </div>
      </section>
    </main>
  );
}
