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
  "thought leadership",
  "creator economy",
  "magic quadrant",
  "marketecture",
  "executive presence",
  "signal liquidity",
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
  linkedin: {
    opener: "Hot take: the highest-leverage operators will be the ones brave enough to",
    frame:
      "This is not about productivity. It is about showing up with compounding context, radical ownership, and a comment-section-ready point of view.",
    close:
      "Agree? Repost if your team is ready to stop confusing motion with momentum.",
  },
  category: {
    opener: "The market does not need another feature; it needs a new category that can",
    frame:
      "The move is to name the problem before buyers can describe it, then make every alternative look like legacy behavior.",
    close:
      "Once the language lands, the category stops being explained and starts being budgeted.",
  },
  gartner: {
    opener: "Organizations seeking durable advantage should evaluate a maturity-aligned capability to",
    frame:
      "Leaders should prioritize a phased adoption model that balances innovation appetite, governance posture, and measurable ambiguity reduction.",
    close:
      "By 2028, successful enterprises will have moved this from exploratory initiative to normalized executive ritual.",
  },
};

type Mode = keyof typeof stylesByMode;

const modeNames: Record<Mode, string> = {
  vc: "VC Memo",
  founder: "Founder Mode",
  consultant: "Consultant Fog",
  enterprise: "Enterprise AI",
  linkedin: "LinkedIn Operator",
  category: "Category Designer",
  gartner: "Gartner Fog",
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

function seedNumber(seedText: string) {
  return [...seedText].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickOne<T>(items: T[], seed: number, offset = 0) {
  return items[(seed + offset) % items.length];
}

function metricList(items: string[]) {
  return items.map((item) => item.toUpperCase()).join(" / ");
}

function plainSummary(text: string) {
  const summary = cleanInput(text);
  if (!summary) return "";
  return /[.!?]$/.test(summary) ? summary : `${summary}.`;
}

function aiYfy(text: string, mode: Mode, level: number) {
  const original = cleanInput(text);
  if (!original) return "";

  const config = stylesByMode[mode];
  const picked = pickBuzzwords(12 + level, `${mode}:${original}`);
  const seed = seedNumber(`${mode}:${original}:${level}`);
  const verbs = Array.from({ length: level + 3 }, (_, index) => {
    const seed = original.length + mode.length + index * 3;
    return actionVerbs[seed % actionVerbs.length];
  });
  const normalized = sentenceCase(original);
  const originalSentence = `${config.opener} ${normalized}.`;
  const reminder = pickOne(
    [
      `Beneath all of this, the job is still simple: ${normalized}.`,
      `Translated back into human language, we are still trying to ${normalized}.`,
      `No matter how premium the framing becomes, the practical outcome remains: ${normalized}.`,
      `Strip away the confidence layer and the work is still to ${normalized}.`,
      `The sentence underneath the platform narrative is still: ${normalized}.`,
    ],
    seed
  );

  if (mode === "linkedin") {
    const lessons = Array.from({ length: level }, (_, index) =>
      pickOne(
        [
          `Lesson ${index + 1}: ${picked[(index + 2) % picked.length]} is not a tactic. It is a posture.`,
          `${index + 1}. The best teams do not wait for clarity; they ${verbs[index]} it into existence and call the residue learning.`,
          `Operator note ${index + 1}: if this feels obvious, that is usually because the hard part has been renamed as ${picked[(index + 4) % picked.length]}.`,
          `Reminder ${index + 1}: your calendar is not busy, it is under-monetized attention pretending to be ${picked[(index + 6) % picked.length]}.`,
        ],
        seed,
        index
      )
    );

    return [
      originalSentence,
      `I have seen too many teams treat ${picked[0]} like a workflow when it is actually a mirror.`,
      `The uncomfortable truth: ${picked[1]} only compounds when someone is willing to make the obvious thing sound like a breakthrough.`,
      ...lessons,
      reminder,
      config.close,
    ].join(" ");
  }

  if (mode === "category") {
    const categoryMoves = Array.from({ length: level }, (_, index) =>
      pickOne(
        [
          `Category move ${index + 1}: rename ${picked[(index + 2) % picked.length]} as the enemy, then position ${picked[(index + 5) % picked.length]} as the only sane response.`,
          `Narrative law ${index + 1}: if buyers can compare it, the category is too small.`,
          `Design principle ${index + 1}: make the old behavior feel expensive, slow, and faintly embarrassing.`,
          `Market language ${index + 1}: ${verbs[index]} the familiar need until it becomes a board-level conversation with its own acronym.`,
        ],
        seed,
        index
      )
    );

    return [
      originalSentence,
      `First, stop describing the task. Name the absence. The absence is ${picked[0]}.`,
      `Second, make ${picked[1]} feel inevitable enough that competitors accidentally validate the frame while arguing with it.`,
      ...categoryMoves,
      reminder,
      config.close,
    ].join(" ");
  }

  if (mode === "gartner") {
    const findings = Array.from({ length: level }, (_, index) =>
      pickOne(
        [
          `Finding ${index + 1}: ${picked[(index + 3) % picked.length]} maturity remains uneven across functions, creating a near-term imperative for calibrated enablement.`,
          `Planning assumption ${index + 1}: by next quarter, leaders who fail to ${verbs[index]} ${picked[(index + 6) % picked.length]} will over-index on dashboards while under-investing in judgment.`,
          `Recommendation ${index + 1}: establish a lightweight center of excellence, then let it become heavyweight through meeting gravity.`,
          `Risk note ${index + 1}: insufficient ${picked[(index + 4) % picked.length]} governance may result in duplicated effort, executive enthusiasm, and no measurable change.`,
        ],
        seed,
        index
      )
    );

    return [
      `Strategic imperative: ${normalized}.`,
      `Market context indicates that ${picked[0]} is moving from emerging practice to executive expectation.`,
      config.frame,
      ...findings,
      `Recommended KPI cluster: ${metricList([picked[1], picked[5], picked[9]])}. Interpret cautiously until confidence becomes budget.`,
      reminder,
      config.close,
    ].join(" ");
  }

  if (mode === "vc") {
    const proofTemplates = [
      (index: number, first: string, second: string) =>
        `Proof point ${index + 1}: ${first} is the wedge; ${second} is the expansion surface investors can pretend was obvious all along.`,
      (index: number, first: string, second: string) =>
        `Expansion vector ${index + 1}: turn ${first} into a repeatable ${second} motion before the market notices it was originally just a useful thing to do.`,
      (index: number, first: string, second: string) =>
        `Signal ${index + 1}: the ${first} behavior compounds into ${second} once the category starts naming itself.`,
      (index: number, first: string, second: string) =>
        `Market proof ${index + 1}: package the ${first} pain as ${second} urgency and the roadmap begins to look inevitable.`,
    ];
    const layers = Array.from({ length: level }, (_, index) => {
      const first = picked[(index + 4) % picked.length];
      const second = picked[(index + 8) % picked.length];
      return pickOne(proofTemplates, seed, index)(index, first, second);
    });

    return [
      originalSentence,
      pickOne(
        [
          `Thesis: this is not a task; it is an entry point into ${picked[0]}, ${picked[1]}, and ${picked[2]} demand capture.`,
          `Investment lens: the mundane surface area hides a surprisingly investable blend of ${picked[0]}, ${picked[1]}, and ${picked[2]}.`,
          `Category read: what looks operational is actually ${picked[0]} demand looking for a cleaner story.`,
        ],
        seed,
        1
      ),
      pickOne(
        [
          `Market signal: teams already feel the pain; they simply lack the vocabulary to call it ${picked[3]}.`,
          `Customer truth: nobody asks for ${picked[3]}, but everyone rewards the team that makes it appear.`,
          `Timing: the pain is old, the language is new, and that is usually enough for a deck.`,
        ],
        seed,
        2
      ),
      ...layers,
      reminder,
      config.close,
    ].join(" ");
  }

  if (mode === "founder") {
    const mandateTemplates = [
      (verb: string, word: string) =>
        `We will ${verb} until the ${word} layer stops behaving like a meeting topic and starts behaving like momentum.`,
      (verb: string, word: string) =>
        `We will ${verb} the ${word} constraint, not because it is elegant, but because speed creates taste after the fact.`,
      (verb: string, word: string) =>
        `We will make ${word} feel obvious by pushing through the part of the work everyone has been politely avoiding.`,
      (verb: string, word: string) =>
        `We will ${verb} through the ${word} fog until the useful thing is no longer trapped inside consensus behavior.`,
    ];
    const mandates = Array.from({ length: level }, (_, index) => {
      return pickOne(mandateTemplates, seed, index)(verbs[index], picked[(index + 2) % picked.length]);
    });

    return [
      originalSentence,
      pickOne(
        [
          `No committee needs to discover this twice. Preserve the simple intent, remove the apologetic language, and force the organization to experience ${picked[0]} velocity.`,
          `The mistake would be treating this like a request. It is a chance to make ${picked[0]} feel like leadership instead of maintenance.`,
          `This does not need more alignment. It needs enough ${picked[0]} pressure that the obvious thing finally becomes shippable.`,
        ],
        seed,
        3
      ),
      ...mandates,
      pickOne(
        [
          `What matters is not whether this sounds reasonable. What matters is whether it makes the useful thing happen with more conviction and fewer ambient excuses.`,
          `The strategy is simple: make the boring work feel inevitable, then let the organization call it vision retroactively.`,
          `Reasonable language is how useful work goes to sleep. This needs sharper gravity.`,
        ],
        seed,
        4
      ),
      reminder,
      config.close,
    ].join(" ");
  }

  if (mode === "consultant") {
    const workstreamTemplates = [
      (index: number, verb: string, first: string, second: string) =>
        `Workstream ${index + 1} will ${verb} ${first} alignment, establish a ${second} governance cadence, and translate the need into accountable stakeholder motion.`,
      (index: number, verb: string, first: string, second: string) =>
        `Phase ${index + 1} focuses on moving ${first} readiness forward while creating a ${second} decision spine for the teams who will later ask why this required a phase.`,
      (index: number, verb: string, first: string, second: string) =>
        `Initiative ${index + 1} converts ${first} ambiguity into ${second} operating clarity through workshops, artifacts, and one diagram with too many arrows.`,
      (index: number, verb: string, first: string, second: string) =>
        `Enablement track ${index + 1} will ${verb} the ${first} gap and position ${second} as the basis for cross-functional buy-in.`,
    ];
    const workstreams = Array.from({ length: level }, (_, index) => {
      return pickOne(workstreamTemplates, seed, index)(
        index,
        verbs[index],
        picked[(index + 3) % picked.length],
        picked[(index + 6) % picked.length]
      );
    });

    return [
      `Executive summary: ${normalized}.`,
      pickOne(
        [
          `Recommended posture: treat this as a managed transformation from operational friction to ${picked[0]} value realization.`,
          `Strategic posture: move from isolated improvement to ${picked[0]} capability maturity.`,
          `Engagement hypothesis: the visible task is merely the doorway into ${picked[0]} value capture.`,
        ],
        seed,
        5
      ),
      config.frame,
      ...workstreams,
      pickOne(
        [
          `Success will be measured through ${metricList([picked[1], picked[4], picked[7]])}, with appropriate caveats around adoption, enablement, and narrative continuity.`,
          `The measurement model should combine ${metricList([picked[1], picked[4], picked[7]])}, then explain any unclear movement as change-management latency.`,
          `Impact tracking will center on ${metricList([picked[1], picked[4], picked[7]])}, supported by a dashboard nobody should confuse with causality.`,
        ],
        seed,
        6
      ),
      reminder,
      config.close,
    ].join(" ");
  }

  const enterpriseTemplates = [
    (index: number, verb: string, word: string) =>
      `Capability layer ${index + 1}: ${verb} policy-aware ${word} across the workflow, then expose it through a trust-calibrated interface that keeps the user outcome intact.`,
    (index: number, verb: string, word: string) =>
      `Service layer ${index + 1}: ${verb} ${word} into the existing estate without admitting how much of the estate is a spreadsheet with a login.`,
    (index: number, verb: string, word: string) =>
      `Control layer ${index + 1}: wrap ${word} in permissions, observability, and enough ${verb} language to make procurement relax.`,
    (index: number, verb: string, word: string) =>
      `Experience layer ${index + 1}: ${verb} the ${word} touchpoint so the front end feels intelligent while the back end remains diplomatically unnamed.`,
  ];
  const enterpriseLayers = Array.from({ length: level }, (_, index) => {
    return pickOne(enterpriseTemplates, seed, index)(index, verbs[index], picked[(index + 5) % picked.length]);
  });

  return [
    originalSentence,
    pickOne(
      [
        `Reference architecture: a ${picked[0]} control plane, a ${picked[1]} experience layer, and a ${picked[2]} feedback loop operating above the existing system of record.`,
        `Target state: ${picked[0]} orchestration on top, ${picked[1]} interpretation in the middle, and ${picked[2]} telemetry underneath so leadership can see movement.`,
        `Platform view: convert the task into a ${picked[0]} service boundary with ${picked[1]} escalation paths and ${picked[2]} reporting semantics.`,
      ],
      seed,
      7
    ),
    config.frame,
    ...enterpriseLayers,
    pickOne(
      [
        `Deployment posture: launch quietly, measure loudly, and call the whole thing ${picked[3]} enablement before anyone asks why the request used to fit in one sentence.`,
        `Rollout posture: make the first release feel like ${picked[3]} modernization, then let governance discover it after it already works.`,
        `Adoption posture: hide the complexity inside ${picked[3]} language and let users experience the useful part without reading the architecture.`,
      ],
      seed,
      8
    ),
    reminder,
    config.close,
  ].join(" ");
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
  const buzzwordHits = buzzwords.reduce((total, word) => {
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

export default function AiYFierClient() {
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("vc");
  const [intensity, setIntensity] = useState(4);
  const scores = useMemo(() => scoreOutput(output, source), [output, source]);
  const executiveSummary = plainSummary(source);
  const footerDisclaimer = pickOne(footerDisclaimers, seedNumber(`${source}:${output}`));

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
                  "linkedin",
                  "category",
                  "gartner",
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
