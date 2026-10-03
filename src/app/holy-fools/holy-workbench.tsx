"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { HolyTool } from "./tools";
import styles from "./holy-fools.module.css";

type Props = {
  tool: HolyTool;
};

const directorNeeds = [
  "Performance",
  "Comedy",
  "World-building",
  "Choreography",
  "Restraint",
  "Documentary nerve",
  "Youth culture",
  "Non-advertising eye",
];

const productionChecks = [
  "The product has to be visibly explained.",
  "A stakeholder is protecting a mandatory moment.",
  "The number of scenes is growing faster than the idea.",
  "The director is being asked to solve strategy.",
  "The budget and the ambition currently disagree.",
  "The desired style is arriving as an extra requirement.",
];

const upstreamChecks = [
  "Production intelligence is in before the treatment.",
  "The director is allowed to change the idea, not only execute it.",
  "The budget is shaping choices while choices are still cheap.",
  "The client knows which product moments are genuinely non-negotiable.",
  "There is still something unresolved on purpose.",
];

function ResultCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.resultCard}>
      <span>{eyebrow}</span>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}

export function HolyWorkbench({ tool }: Props) {
  const [text, setText] = useState("");
  const [secondary, setSecondary] = useState("");
  const [choice, setChoice] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [doorVerdict, setDoorVerdict] = useState("");

  const checkedCount = useMemo(
    () => Object.values(checks).filter(Boolean).length,
    [checks],
  );

  const toggleSelected = (item: string) => {
    setSelected((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  };

  const toggleCheck = (item: string) => {
    setChecks((current) => ({ ...current, [item]: !current[item] }));
  };

  if (tool.kind === "stress") {
    return (
      <div className={styles.workbench}>
        <div className={styles.workbenchIntro}>
          <span>FULL INSTRUMENT ALREADY LIVE</span>
          <h2>Put the decision in the room.</h2>
          <p>
            The Decision Stress-Test already exists as a complete ctrl+love
            instrument. Holy Fools gets a clean door into it rather than a
            weaker duplicate.
          </p>
        </div>
        <Link className={styles.primaryAction} href="/stress-test/">
          Open the full Stress-Test →
        </Link>
      </div>
    );
  }

  if (tool.kind === "signal") {
    const responses: Record<string, string> = {
      contradiction:
        "Do not explain it away. What would Holy Fools make if the contradiction were the brief?",
      friction:
        "Do not smooth it yet. Who is irritated, and what useful behaviour is hiding inside that irritation?",
      delight:
        "Do not brand it yet. What exactly made this feel unexpectedly alive?",
      stupidity:
        "Excellent. Keep the stupid bit. Remove everything around it that makes it ordinary.",
    };

    return (
      <div className={styles.workbench}>
        <label className={styles.field}>
          <span>WHAT JUST HAPPENED?</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="A tiny bit of reality you almost ignored…"
          />
        </label>
        <label className={styles.field}>
          <span>WHAT KIND OF USEFUL TROUBLE IS IT?</span>
          <select value={choice} onChange={(event) => setChoice(event.target.value)}>
            <option value="">Choose one</option>
            <option value="contradiction">Contradiction</option>
            <option value="friction">Friction</option>
            <option value="delight">Unexpected delight</option>
            <option value="stupidity">Useful stupidity</option>
          </select>
        </label>
        <button
          className={styles.primaryAction}
          type="button"
          disabled={!text.trim() || !choice}
          onClick={() => setRevealed(true)}
        >
          Interrupt reality
        </button>
        {revealed && choice ? (
          <ResultCard eyebrow="HOLY SHIT / RESPONSE" title="Do not solve it yet.">
            <p>{responses[choice]}</p>
            <small>{text}</small>
          </ResultCard>
        ) : null}
      </div>
    );
  }

  if (tool.kind === "director") {
    return (
      <div className={styles.workbench}>
        <label className={styles.field}>
          <span>WHAT MUST THE DIRECTOR ACTUALLY DO?</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Not a name. Not a vibe. The actual creative problem."
          />
        </label>
        <div className={styles.field}>
          <span>SEARCH OUTSIDE THE USUAL ROSTER FOR</span>
          <div className={styles.chips}>
            {directorNeeds.map((item) => (
              <button
                type="button"
                key={item}
                className={selected.includes(item) ? styles.chipActive : styles.chip}
                onClick={() => toggleSelected(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <button
          className={styles.primaryAction}
          type="button"
          disabled={!text.trim() || selected.length === 0}
          onClick={() => setRevealed(true)}
        >
          Build the search brief
        </button>
        {revealed ? (
          <ResultCard eyebrow="DIRECTOR SEARCH BRIEF" title={text || "The creative problem"}>
            <p>
              Search for evidence of: {selected.join(" · ")}.
            </p>
            <p>
              First rule: no familiar name enters the room until three unfamiliar
              names have earned their way in.
            </p>
          </ResultCard>
        ) : null}
      </div>
    );
  }

  if (tool.kind === "compare") {
    return (
      <div className={styles.workbench}>
        <div className={styles.twoColumn}>
          <label className={styles.field}>
            <span>TRAIT</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Who they are. What they signal. What the room notices first."
            />
          </label>
          <label className={styles.field}>
            <span>METHOD</span>
            <textarea
              value={secondary}
              onChange={(event) => setSecondary(event.target.value)}
              placeholder="How they work. What they repeatedly do. What the evidence shows."
            />
          </label>
        </div>
        <button
          className={styles.primaryAction}
          type="button"
          disabled={!text.trim() || !secondary.trim()}
          onClick={() => setRevealed(true)}
        >
          Separate signal from proof
        </button>
        {revealed ? (
          <ResultCard eyebrow="TRAIT ≠ METHOD" title="Now judge the method.">
            <p>
              A trait can open the search. It cannot finish the argument. Look
              for observable behaviour, repeated choices and actual work.
            </p>
          </ResultCard>
        ) : null}
      </div>
    );
  }

  if (tool.kind === "hold") {
    return (
      <div className={styles.workbench}>
        <label className={styles.field}>
          <span>PUT THIS IN THE WAITING ROOM</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="The idea everyone is currently improving to death…"
          />
        </label>
        <label className={styles.field}>
          <span>NO NEW OPINIONS FOR</span>
          <select value={choice} onChange={(event) => setChoice(event.target.value)}>
            <option value="">Choose a hold</option>
            <option value="one night">One night</option>
            <option value="48 hours">48 hours</option>
            <option value="one meeting">One meeting</option>
            <option value="until the director sees it">Until the director sees it</option>
          </select>
        </label>
        <button
          className={styles.primaryAction}
          type="button"
          disabled={!text.trim() || !choice}
          onClick={() => setRevealed(true)}
        >
          Admit to waiting room
        </button>
        {revealed ? (
          <ResultCard eyebrow="WAITING ROOM TICKET" title={"Leave it alone for " + choice + "."}>
            <p>When it comes back, ask what stayed true without anybody defending it.</p>
            <small>{text}</small>
          </ResultCard>
        ) : null}
      </div>
    );
  }

  if (tool.kind === "triage") {
    const triageCopy: Record<string, string> = {
      OWN: "Put your name on the outcome. No half-ownership and no invisible rescue team.",
      PARTNER:
        "Name the missing intelligence before naming the supplier. Partner for a capability, not for comfort.",
      IGNORE:
        "Stop improving it. Write down why it does not deserve Holy Fools attention and recover the hours.",
    };

    return (
      <div className={styles.workbench}>
        <label className={styles.field}>
          <span>WHAT IS ASKING FOR YOUR ATTENTION?</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Project, request, problem, opportunity…"
          />
        </label>
        <div className={styles.triad}>
          {["OWN", "PARTNER", "IGNORE"].map((item) => (
            <button
              type="button"
              key={item}
              className={choice === item ? styles.triadActive : styles.triadButton}
              disabled={!text.trim()}
              onClick={() => {
                setChoice(item);
                setRevealed(true);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        {revealed && choice ? (
          <ResultCard eyebrow="ATTENTION DECISION" title={choice}>
            <p>{triageCopy[choice]}</p>
            <small>{text}</small>
          </ResultCard>
        ) : null}
      </div>
    );
  }

  if (tool.kind === "door") {
    return (
      <div className={styles.workbench}>
        <label className={styles.field}>
          <span>THE IDEA, WITHOUT THE DECK</span>
          <textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setDoorVerdict("");
            }}
            placeholder="One sentence. No setup. No strategy preamble."
          />
        </label>
        <button
          className={styles.primaryAction}
          type="button"
          disabled={!text.trim()}
          onClick={() => setRevealed(true)}
        >
          Strip the presentation
        </button>
        {revealed ? (
          <ResultCard eyebrow="THE DOOR TEST" title="Would you put this on the door tomorrow?">
            <blockquote>{text}</blockquote>
            <div className={styles.binary}>
              <button type="button" onClick={() => setDoorVerdict("YES")}>Yes</button>
              <button type="button" onClick={() => setDoorVerdict("NOT YET")}>Not yet</button>
            </div>
            {doorVerdict ? (
              <p>
                {doorVerdict === "YES"
                  ? "Good. The idea can survive without a presenter."
                  : "Good. The deck did not pass the test. Work on the idea, not the slides."}
              </p>
            ) : null}
          </ResultCard>
        ) : null}
      </div>
    );
  }

  if (tool.kind === "production") {
    let verdict = "The idea still has room to be shaped.";
    if (checkedCount >= 4) verdict = "Production is already being asked to rescue the idea.";
    else if (checkedCount >= 2) verdict = "Bring production intelligence upstream now.";

    return (
      <div className={styles.workbench}>
        <div className={styles.checkList}>
          {productionChecks.map((item) => (
            <label key={item} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={Boolean(checks[item])}
                onChange={() => toggleCheck(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <button
          className={styles.primaryAction}
          type="button"
          onClick={() => setRevealed(true)}
        >
          Run reality check
        </button>
        {revealed ? (
          <ResultCard
            eyebrow={"PRODUCTION PRESSURE / " + checkedCount + " SIGNALS"}
            title={verdict}
          >
            <p>
              Ask the director, producer and client which pressure is allowed to
              change the idea — and which one is merely arriving late.
            </p>
          </ResultCard>
        ) : null}
      </div>
    );
  }

  if (tool.kind === "month") {
    const weeks = [
      "WEEK 01 / Observe one real job. No grand redesign.",
      "WEEK 02 / Put one instrument into live work.",
      "WEEK 03 / Let somebody outside the core team use it.",
      "WEEK 04 / Keep only what changed an actual decision.",
    ];
    return (
      <div className={styles.workbench}>
        <div className={styles.checkList}>
          {weeks.map((item) => (
            <label key={item} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={Boolean(checks[item])}
                onChange={() => toggleCheck(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <ResultCard
          eyebrow="30-DAY FIELD TEST"
          title={checkedCount === 4 ? "Now decide whether to get married." : checkedCount + " / 4 weeks evidenced"}
        >
          <p>
            No chemistry score. No transformation theatre. At day 30, judge the
            work that actually happened.
          </p>
        </ResultCard>
      </div>
    );
  }

  const upstreamCount = checkedCount;
  let upstreamVerdict = "The film is being shaped upstream.";
  if (upstreamCount <= 2) upstreamVerdict = "Too much intelligence is arriving downstream.";
  else if (upstreamCount <= 4) upstreamVerdict = "One important conversation is still arriving late.";

  return (
    <div className={styles.workbench}>
      <div className={styles.checkList}>
        {upstreamChecks.map((item) => (
          <label key={item} className={styles.checkRow}>
            <input
              type="checkbox"
              checked={Boolean(checks[item])}
              onChange={() => toggleCheck(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
      <button
        className={styles.primaryAction}
        type="button"
        onClick={() => setRevealed(true)}
      >
        Test how upstream you are
      </button>
      {revealed ? (
        <ResultCard eyebrow={"UPSTREAM / " + upstreamCount + " OF 5"} title={upstreamVerdict}>
          <p>
            The aim is not to add production earlier. It is to let production
            change the decision while changing it is still cheap.
          </p>
        </ResultCard>
      ) : null}
    </div>
  );
}
