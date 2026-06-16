"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./ai-y-fier.module.css";

const bannedTerms = [
  "operator",
  "leverage",
  "AI-native",
  "momentum",
  "magic quadrant",
  "workflow",
  "velocity",
  "high-performing teams",
  "alignment",
  "aligned",
  "strategic",
  "framework",
  "stakeholder",
  "future-facing",
  "scalable",
  "narrative",
  "confidence",
];

const liveModelOutputs = [
  "We have identified a scalable opportunity to leverage alignment around narrative-enabled value realization.",
  "Following a strategic language uplift, the statement now better reflects the ambition embedded within its future-facing potential.",
  "This initiative creates a framework for unlocking stakeholder-aligned momentum at scale.",
  "The observation has been reframed as an enterprise-ready signal with expanded confidence architecture.",
  "We are activating a language layer that increases perceived clarity without materially altering the underlying facts.",
];

const tickerMessages = [
  "CONFIDENCE LAYER DETECTED",
  "MEANING UNCHANGED",
  "LENGTH UP 340%",
  "ACCOUNTABILITY DOWN 12%",
  "EXECUTIVE APPROVAL PROBABILITY INCREASING",
  "STRATEGIC ALTITUDE ACHIEVED",
  "4 EXECUTIVES CURRENTLY NODDING",
  "INVESTOR VOICE SIMULATED",
  "SYNERGY EVENT ACTIVE",
  "NARRATIVE INFLATION DETECTED",
  "THIS SENTENCE HAS BEEN FUTURE-PROOFED",
  "REALITY VISIBILITY REDUCED",
  "BOARDROOM GRAVITY INCREASING",
];

const confidenceExamples = [
  {
    reality: "We don't know yet.",
    aiYfied: "We are actively exploring multiple future-oriented pathways.",
  },
  {
    reality: "Sales are down.",
    aiYfied: "We are navigating temporary market headwinds.",
  },
  {
    reality: "This campaign isn't working.",
    aiYfied: "We are still building awareness.",
  },
];

function cleanInput(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function seedNumber(seedText: string) {
  return [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickOne<T>(items: T[], seed: number, offset = 0) {
  return items[(seed + offset) % items.length];
}

function plainSummary(text: string) {
  const summary = cleanInput(text);
  if (!summary) return "";
  return /[.!?]$/.test(summary) ? summary : `${summary}.`;
}

function wordCount(text: string) {
  return text.match(/[A-Za-z0-9'-]+/g)?.length ?? 0;
}

function splitGreeting(text: string) {
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

function lightlyEditBody(text: string, strict = false) {
  let edited = text
    .replace(/\bI built\b/g, "I built")
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

function editTextConservatively(text: string, strict = false) {
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

function stripFinalPunctuation(text: string) {
  return text.replace(/[.!?]+$/g, "").trim();
}

function lowercaseFirst(text: string) {
  return text ? `${text[0].toLowerCase()}${text.slice(1)}` : text;
}

function makeBoardApprovedSentence(sourceLine: string, seed: number) {
  const compactSource = stripFinalPunctuation(sourceLine);
  const lowerSource = compactSource.toLowerCase();

  if (/\b(we|i)\s+(do not|don't)\s+know\b/.test(lowerSource) || /\bnot sure\b/.test(lowerSource)) {
    return "We are actively exploring multiple future-oriented pathways while maintaining the flexibility required to convert emerging uncertainty into a more actionable strategic position.";
  }

  if (/\bsales\s+(are|were|is)\s+down\b/.test(lowerSource)) {
    return "We are navigating temporary market headwinds while strengthening the commercial learning loop required to restore stakeholder-aligned revenue momentum.";
  }

  if (/\b(isn't|is not|aren't|are not|wasn't|was not)\s+working\b/.test(lowerSource)) {
    return "The initiative is still building awareness, generating directional learning, and creating the conditions for a more scalable performance narrative over time.";
  }

  const needMatch = compactSource.match(/^we\s+need\s+to\s+(.+)$/i);
  if (needMatch) {
    return `We are advancing a strategically aligned effort to ${lowercaseFirst(
      stripFinalPunctuation(needMatch[1])
    )}, creating a clearer foundation for cross-functional prioritization, stakeholder confidence, and future-ready execution.`;
  }

  const shouldMatch = compactSource.match(/^(we|i|the team)\s+should\s+(.+)$/i);
  if (shouldMatch) {
    return `We have identified an opportunity to ${lowercaseFirst(
      stripFinalPunctuation(shouldMatch[2])
    )}, positioning the organization to move with greater clarity, confidence, and narrative consistency.`;
  }

  const statusFrames = [
    "We are reframing the current signal",
    "We have identified a strategically relevant indicator",
    "We are elevating the underlying observation",
    "We are converting the operational update",
  ];

  const outcomes = [
    "into a clearer basis for alignment, prioritization, and future-facing momentum",
    "into a stakeholder-legible narrative that supports confident decision-making",
    "into a more scalable framework for interpreting near-term organizational reality",
    "into an executive-ready signal with stronger strategic altitude",
  ];

  return `${pickOne(statusFrames, seed)} that ${lowercaseFirst(
    compactSource
  )} ${pickOne(outcomes, seed, 1)}.`;
}

function aiYfy(text: string) {
  const edited = editTextConservatively(text);
  if (!edited) return "";
  const sourceLine = edited.replace(/\n{2,}/g, " ");
  const seed = seedNumber(sourceLine);
  const boardApprovedSentence = makeBoardApprovedSentence(sourceLine, seed);
  const interpretation = pickOne(
    [
      "This preserves the original operational meaning while increasing its perceived maturity, altitude, and executive survivability.",
      "No additional facts have been introduced; the sentence has simply been equipped with a higher-confidence operating posture.",
      "The core claim remains materially unchanged, but the surrounding language now reduces reality visibility in a stakeholder-safe way.",
    ],
    seed,
    2
  );
  const recommendedUse = pickOne(
    [
      "Suitable for roadmap updates, investor notes, and meetings where precision may create unnecessary surface area.",
      "Suitable for steering committees, quarterly reflections, and any room where uncertainty needs a blazer.",
      "Suitable for decks, all-hands updates, and situations where the sentence must arrive with more authority than evidence.",
    ],
    seed,
    3
  );

  return [
    "AI-Y-FIER CONFIDENCE LAYER OUTPUT",
    "",
    "Original signal, prior to strategic altitude correction:",
    `"${sourceLine}"`,
    "",
    "Board-approved translation:",
    boardApprovedSentence,
    "",
    "Confidence layer analysis:",
    interpretation,
    "",
    "Recommended organizational use:",
    recommendedUse,
    "",
    "Meaning delta: approximately zero.",
  ].join("\n");
}

function scoreOutput(text: string, source: string) {
  if (!text.trim()) {
    return {
      bullshit: "Awaiting inflation",
      density: "Under-leveraged",
      synergy: "Not yet cross-functional",
      confidence: "Awaiting layer",
      bullshitStatus: "",
      densityStatus: "",
      lengthStatus: "",
      isEmpty: true,
    };
  }

  const words = text.match(/[A-Za-z-]+/g) || [];
  const sourceWords = source.match(/[A-Za-z-]+/g) || [];
  const seed = seedNumber(`${text}:${source}`);
  const buzzwordHits = bannedTerms.reduce((total, word) => {
    const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    return total + (text.match(pattern) || []).length;
  }, 0);
  const lengthMultiplier = Math.max(1, words.length / Math.max(sourceWords.length, 1));
  const bullshit = Math.min(99, Math.round(46 + buzzwordHits * 3.2 + lengthMultiplier * 4));
  const density = Math.min(88, Math.round((buzzwordHits / Math.max(words.length, 1)) * 1000));

  return {
    bullshit: String(bullshit),
    density: `${density}%`,
    synergy: `${Math.min(12.8, 1.4 + buzzwordHits * 0.32 + lengthMultiplier * 0.28).toFixed(1)}x`,
    confidence: `+${Math.min(98, Math.round(67 + lengthMultiplier * 4 + buzzwordHits * 1.7))}%`,
    bullshitStatus:
      bullshit >= 85
        ? pickOne(
            [
              "Investor-ready.",
              "Meaning successfully abstracted.",
              "Narrative now exceeds operational reality.",
            ],
            seed
          )
        : "",
    densityStatus:
      density >= 42
        ? pickOne(
            [
              "Category creation event detected.",
              "Strategic fog approaching.",
              "Signal successfully replaced by positioning.",
            ],
            seed,
            1
          )
        : "",
    lengthStatus:
      lengthMultiplier >= 5
        ? pickOne(
            [
              "Narrative leverage achieved.",
              "Confidence scaled faster than substance.",
              "Expansion surface identified.",
            ],
            seed,
            2
          )
        : "",
    isEmpty: false,
  };
}

const footerDisclaimers = [
  "No meaning was added in the making of this narrative.",
  "Past performance is not indicative of future thought leadership.",
  "This output contains confidence but may contain no new information.",
  "Category leadership not guaranteed.",
  "Generated using 100% recycled buzzwords.",
  "Investor enthusiasm simulated.",
];

export default function AiYFierClient() {
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [liveModelOutput] = useState(() => pickOne(liveModelOutputs, Math.floor(Math.random() * 1000)));
  const scores = useMemo(() => scoreOutput(output, source), [output, source]);
  const executiveSummary = plainSummary(source);
  const footerDisclaimer = footerDisclaimers[0];

  function transform() {
    setOutput(aiYfy(source));
    setCopyStatus("");
  }

  function clearAll() {
    setSource("");
    setOutput("");
    setCopyStatus("");
  }

  async function copyOutput() {
    if (!output.trim()) {
      setCopyStatus("Nothing to copy yet.");
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(output);
      } else {
        const fallbackTextarea = document.createElement("textarea");
        fallbackTextarea.value = output;
        fallbackTextarea.setAttribute("readonly", "");
        fallbackTextarea.style.position = "fixed";
        fallbackTextarea.style.opacity = "0";
        document.body.appendChild(fallbackTextarea);
        fallbackTextarea.select();
        document.execCommand("copy");
        document.body.removeChild(fallbackTextarea);
      }
      setCopyStatus("Copied.");
    } catch {
      setCopyStatus("Select the output text and copy it manually.");
    }
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
      <p className={styles.versionStamp}>final copy - 16 june 2026</p>

      <section className={styles.hero} id="product">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Narrative infrastructure for modern teams</p>
          <h1>Turn perfectly normal sentences into board-approved AI gravity.</h1>
          <p className={styles.lede}>
            Paste a perfectly normal sentence. Receive a longer, more confident version that
            sounds expensive, future-proof and strategically aligned while preserving
            approximately the same amount of meaning.
          </p>
          <div className={styles.trustRow}>
            <span>Backed by vibes</span>
            <span>Confidence layer enabled</span>
            <span>SOC 2 adjacent</span>
            <span>Randomly Gartner-shaped</span>
          </div>
        </div>

        <section className={styles.terminalPanel} aria-label="Live funding signal">
          <Image
            className={styles.heroVisual}
            src="/ai-y-fier-hero-inflation-engine.png?v=confidence-layer"
            alt="A sentence entering a dark machine and exiting as a much larger hollow language bubble"
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
          <p className={styles.terminalLine}>{liveModelOutput}</p>
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
              onChange={(event) => {
                setOutput(event.target.value);
                setCopyStatus("");
              }}
              spellCheck
              aria-label="Generated strategic narrative"
            />
          </article>
          {output.trim() && executiveSummary ? (
            <section className={styles.executiveSummary} aria-label="Executive Summary">
              <p>Executive Summary</p>
              <strong>“{executiveSummary}”</strong>
            </section>
          ) : null}
          <div className={styles.resultActions}>
            <button type="button" onClick={copyOutput}>
              {copyStatus === "Copied." ? "Copied" : "Copy"}
            </button>
            <button className={styles.stripAction} type="button" onClick={() => setOutput(source)}>
              Strip Confidence Layer
            </button>
            <button type="button" onClick={clearAll}>
              Clear all
            </button>
            <button
              type="button"
              onClick={() => {
                const demo = "We need to update the customer dashboard so people can find their invoices faster.";
                setSource(demo);
                setOutput(aiYfy(demo));
                setCopyStatus("");
              }}
            >
              Reset
            </button>
          </div>
          {copyStatus ? (
            <p className={styles.copyStatus} aria-live="polite">
              {copyStatus}
            </p>
          ) : null}
        </aside>
      </section>

      <section className={styles.aiTicker} aria-label="AI-y-fier live signals">
        <div className={styles.aiTickerTrack}>
          <TickerRun />
          <TickerRun ariaHidden />
        </div>
      </section>

      <section className={styles.metricsBand} id="metrics" aria-label="Generated metrics">
        <article>
          <span>Investor-grade certainty</span>
          <strong className={scores.isEmpty ? styles.emptyMetric : undefined}>{scores.bullshit}</strong>
          <span>Formerly Bullshit Score</span>
          {scores.bullshitStatus ? <em>{scores.bullshitStatus}</em> : null}
        </article>
        <article>
          <span>Jargon per useful noun</span>
          <strong className={scores.isEmpty ? styles.emptyMetric : undefined}>{scores.density}</strong>
          <span>Formerly Buzzword Density</span>
          {scores.densityStatus ? <em>{scores.densityStatus}</em> : null}
        </article>
        <article>
          <span>Cross-functional aura</span>
          <strong className={scores.isEmpty ? styles.emptyMetric : undefined}>{scores.synergy}</strong>
          <span>Formerly Synergy Index</span>
        </article>
        <article>
          <span>Confidence Layer</span>
          <strong className={scores.isEmpty ? styles.emptyMetric : undefined}>{scores.confidence}</strong>
          <span>Meaning unchanged</span>
        </article>
      </section>

      {scores.lengthStatus ? (
        <aside className={styles.escalationBand}>
          {scores.lengthStatus}
        </aside>
      ) : null}

      <section className={styles.confidenceLayer} aria-label="Confidence Layer">
        <div className={styles.confidenceCopy}>
          <p className={styles.eyebrow}>Language inflation module</p>
          <h2>Confidence Layer™</h2>
          <p>
            Most organizations don&apos;t suffer from a lack of intelligence.
            They suffer from a surplus of confidence.
          </p>
          <p>
            AI-y-fier identifies and amplifies the invisible layer that turns observations
            into narratives, assumptions into frameworks, and uncertainty into strategic certainty.
          </p>
        </div>
        <div className={styles.confidenceGrid}>
          {confidenceExamples.map((example) => (
            <article key={example.reality}>
              <span>Reality:</span>
              <p>{example.reality}</p>
              <span>AI-y-fied:</span>
              <strong>{example.aiYfied}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.investorProof} id="waitlist">
        <div>
          <p className={styles.eyebrow}>Enterprise-ready theater</p>
          <h2>The world&apos;s leading confidence layer management platform.</h2>
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

      <footer className={styles.disclaimer}>
        {footerDisclaimer}
      </footer>
    </main>
  );
}

function TickerRun({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className={styles.aiTickerRun} aria-hidden={ariaHidden}>
      {tickerMessages.map((message) => (
        <span key={message}>{message}</span>
      ))}
    </div>
  );
}
