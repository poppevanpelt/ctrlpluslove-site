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

function aiYfy(text: string) {
  const edited = editTextConservatively(text);
  if (!edited) return "";
  const sourceLine = edited.replace(/\n{2,}/g, " ");

  return [
    "AI-Y-FIER FINAL COPY - 16 JUNE 2026",
    "",
    "Original signal, prior to strategic altitude correction:",
    `"${sourceLine}"`,
    "",
    "Board-approved translation:",
    "ctrl+love is no longer merely a baby. It has entered its institution-shaped toddler phase: larger, louder, more spatially opinionated, and now apparently capable of generating departments as a side effect of emotional and epistemic growth.",
    "",
    "The move into a new place should not be mistaken for a real-estate event. It is better understood as a material upgrade to the ctrl+love ambiguity stack: more walls to disagree near, more air for unfinished arguments to circulate through, and more square footage in which learning can pretend, briefly, to have a floor plan.",
    "",
    "The opening of two new departments indicates that the original operating organism has begun to subdivide itself into specialized zones of purposeful uncertainty. This is not scale in the conventional sense. It is more like a houseplant becoming a governance model: unexpected, slightly damp, difficult to summarize, and somehow still alive.",
    "",
    "The continued absence of parking spaces should be read as a disciplined refusal to over-serve the arrival layer. ctrl+love is not optimizing for vehicles. It is optimizing for threshold energy: the small existential pause before someone steps inside and realizes the building may have a position on their assumptions.",
    "",
    "The door being open is therefore not hospitality copy. It is an architectural thesis. It says the system is still under construction, still arguing with itself, still learning in public, and still willing to let reality wander in without first completing a brand platform.",
    "",
    "Current status: spatially upgraded, emotionally under-documented, epistemically noisy, allergic to premature polish, and open in the specific sense that a door can be open while the people behind it are still moving furniture and disagreeing about what the furniture means.",
  ].join("\n");
}

function scoreOutput(text: string, source: string) {
  if (!text.trim()) {
    return {
      bullshit: "Awaiting inflation",
      density: "Under-leveraged",
      synergy: "Not yet cross-functional",
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

const ctrlLoveSample = `Our ctrl+love baby has been growing.

We outgrew our office.
Opened two new departments.
So we moved into a new place.

ctrlpluslove.com

Still under construction.
Still arguing.
Still learning.

Still no parking spaces.

But the door is open.`;

export default function AiYFierClient() {
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const scores = useMemo(() => scoreOutput(output, source), [output, source]);
  const executiveSummary = plainSummary(source);
  const footerDisclaimer = pickOne(footerDisclaimers, seedNumber(`${source}:${output}`));

  function transform() {
    setOutput(aiYfy(source));
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
          <Link href="/meeting-filter">Meeting Filter</Link>
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
            Paste mundane text. Receive a maximally confident, abstract, lengthened artifact
            that preserves the original meaning while radiating funded inevitability.
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
          {output.trim() && executiveSummary ? (
            <section className={styles.executiveSummary} aria-label="Executive Summary">
              <p>Executive Summary</p>
              <strong>“{executiveSummary}”</strong>
            </section>
          ) : null}
          <div className={styles.resultActions}>
            <button type="button" onClick={() => navigator.clipboard.writeText(output)}>
              Copy for stakeholder alignment
            </button>
            <button type="button" onClick={() => setOutput(source)}>
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
          <strong className={scores.isEmpty ? styles.emptyMetric : undefined}>{scores.bullshit}</strong>
          <span>Investor-grade certainty</span>
          {scores.bullshitStatus ? <em>{scores.bullshitStatus}</em> : null}
        </article>
        <article>
          <span>Buzzword Density</span>
          <strong className={scores.isEmpty ? styles.emptyMetric : undefined}>{scores.density}</strong>
          <span>Jargon per useful noun</span>
          {scores.densityStatus ? <em>{scores.densityStatus}</em> : null}
        </article>
        <article>
          <span>Synergy Index</span>
          <strong className={scores.isEmpty ? styles.emptyMetric : undefined}>{scores.synergy}</strong>
          <span>Cross-functional aura</span>
        </article>
      </section>

      {scores.lengthStatus ? (
        <aside className={styles.escalationBand}>
          {scores.lengthStatus}
        </aside>
      ) : null}

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

      <footer className={styles.disclaimer}>
        {footerDisclaimer}
      </footer>
    </main>
  );
}
