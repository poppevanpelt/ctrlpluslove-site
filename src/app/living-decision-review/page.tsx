"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import styles from "./living-decision-review.module.css";

type Position = "favor" | "lean" | "neutral" | "concern" | "against" | "silent";

type Participant = {
  id: string;
  name: string;
  lens: string;
  position: Position;
  confidence: number;
  status: string;
  note: string;
  history: string[];
  active: boolean;
  evidence: number;
  vacant?: boolean;
};

type EventStep = {
  at: number;
  speaker: string;
  fragment: string;
  status: string;
  position?: Position;
  confidence?: number;
  evidence?: number;
  synthesis: string;
  tag: string;
  changes?: Array<{
    id: string;
    status?: string;
    position?: Position;
    confidence?: number;
    note?: string;
    evidence?: number;
  }>;
};

const initialPeople: Participant[] = [
  {
    id: "maya",
    name: "Maya Elise Harper",
    lens: "customer truth",
    position: "favor",
    confidence: 78,
    status: "ready",
    note: "Strongly in favor",
    history: ["Strongly in favor"],
    active: false,
    evidence: 1,
  },
  {
    id: "simon",
    name: "Simon Cross",
    lens: "commercial pressure",
    position: "against",
    confidence: 66,
    status: "watching",
    note: "Against",
    history: ["Against"],
    active: false,
    evidence: 0,
  },
  {
    id: "lexi",
    name: "Lexi Arden",
    lens: "behavioral risk",
    position: "concern",
    confidence: 72,
    status: "quiet",
    note: "Concern: subscription fatigue",
    history: ["Concern: subscription fatigue"],
    active: false,
    evidence: 0,
  },
  {
    id: "adrian",
    name: "Adrian Mbeki",
    lens: "operations",
    position: "silent",
    confidence: 42,
    status: "silent",
    note: "Waiting for constraints",
    history: ["Silent"],
    active: false,
    evidence: 0,
  },
  {
    id: "akiko",
    name: "Akiko Hayashi",
    lens: "brand meaning",
    position: "lean",
    confidence: 58,
    status: "thinking...",
    note: "Potentially yes",
    history: ["Potentially yes"],
    active: false,
    evidence: 0,
  },
  {
    id: "nick",
    name: "Nick Deckman",
    lens: "finance",
    position: "neutral",
    confidence: 45,
    status: "measuring",
    note: "No position yet",
    history: ["No position yet"],
    active: false,
    evidence: 0,
  },
  {
    id: "empty",
    name: "Empty chair",
    lens: "missing view",
    position: "silent",
    confidence: 0,
    status: "unoccupied",
    note: "What has not been said yet",
    history: ["Unoccupied"],
    active: false,
    evidence: 0,
    vacant: true,
  },
];

const steps: EventStep[] = [
  {
    at: 900,
    speaker: "maya",
    fragment: "Hmm... if people already ritualize it, subscription could remove friction.",
    status: "opening",
    position: "favor",
    confidence: 82,
    synthesis: "There may be real recurring behavior here.",
    tag: "position formed",
  },
  {
    at: 2600,
    speaker: "simon",
    fragment: "I don't buy that yet. Recurring use is not the same as wanting a contract.",
    status: "contesting",
    confidence: 72,
    synthesis: "Need to separate habit from commitment.",
    tag: "contested",
    changes: [
      {
        id: "maya",
        status: "challenged",
        confidence: 70,
        note: "Less certain",
      },
    ],
  },
  {
    at: 4300,
    speaker: "lexi",
    fragment: "Wait... subscription fatigue is the thing. The product has to feel replenishing, not trapping.",
    status: "risk named",
    position: "concern",
    confidence: 80,
    synthesis: "The emotional texture matters as much as retention.",
    tag: "risk raised",
    changes: [
      {
        id: "simon",
        status: "evidence received",
        confidence: 68,
        note: "Against, but sharper",
      },
    ],
  },
  {
    at: 6200,
    speaker: "akiko",
    fragment: "Unless the subscription is framed as a seasonal table, not a refill plan.",
    status: "reframing",
    position: "favor",
    confidence: 68,
    evidence: 1,
    synthesis: "A subscription may work if it feels curated and seasonal.",
    tag: "reframe",
    changes: [
      {
        id: "lexi",
        status: "reconsidering...",
        confidence: 66,
        note: "Concern reduced",
        evidence: 1,
      },
    ],
  },
  {
    at: 7900,
    speaker: "adrian",
    fragment: "Actually... supply rhythm decides this. Can Suki deliver freshness without heroic operations?",
    status: "constraint surfaced",
    position: "neutral",
    confidence: 74,
    evidence: 1,
    synthesis: "Operational freshness is the gating condition.",
    tag: "constraint",
    changes: [
      {
        id: "maya",
        status: "confidence ↓",
        confidence: 61,
        note: "I hadn't considered churn.",
      },
      {
        id: "akiko",
        status: "contested",
        confidence: 60,
        note: "Reframe needs proof",
      },
    ],
  },
  {
    at: 9800,
    speaker: "nick",
    fragment: "Small interruption: launch math improves if it starts as an invite-only cohort.",
    status: "model updated",
    position: "lean",
    confidence: 64,
    evidence: 2,
    synthesis: "Start narrow: cohort first, subscription second.",
    tag: "evidence received",
    changes: [
      {
        id: "simon",
        status: "position updated",
        position: "neutral",
        confidence: 52,
        note: "That changes things.",
        evidence: 1,
      },
      {
        id: "adrian",
        status: "risk reduced",
        confidence: 62,
        note: "Feasible if capped",
      },
    ],
  },
  {
    at: 11800,
    speaker: "simon",
    fragment: "I'm changing my mind. Not a broad launch. A test with hard cancellation data.",
    status: "position updated",
    position: "lean",
    confidence: 59,
    evidence: 2,
    synthesis: "The room is moving toward a measured launch, not a full rollout.",
    tag: "mind changed",
    changes: [
      {
        id: "maya",
        status: "confidence ↑",
        confidence: 69,
        note: "In favor, with guardrails",
        evidence: 2,
      },
    ],
  },
  {
    at: 13900,
    speaker: "lexi",
    fragment: "Good point. The risk is not subscription. The risk is making replenishment feel automatic and soulless.",
    status: "risk reframed",
    position: "neutral",
    confidence: 55,
    evidence: 2,
    synthesis: "Subscription fatigue can be reduced through choice, cadence, and story.",
    tag: "risk reduced",
  },
  {
    at: 16000,
    speaker: "adrian",
    fragment: "Then the decision is conditional. Launch only where freshness, packaging, and churn learning are measurable.",
    status: "resolved",
    position: "favor",
    confidence: 71,
    evidence: 2,
    synthesis: "Recommendation: launch a capped pilot, designed to learn whether ritual survives repetition.",
    tag: "synthesis forming",
    changes: [
      {
        id: "nick",
        status: "aligned",
        confidence: 72,
        note: "Pilot clears the math",
      },
      {
        id: "akiko",
        status: "resolved",
        confidence: 75,
        note: "Seasonal cohort, not commodity refill",
      },
    ],
  },
];

const positionLabels: Record<Position, string> = {
  favor: "in favor",
  lean: "leaning yes",
  neutral: "neutral",
  concern: "concerned",
  against: "against",
  silent: "silent",
};

function buildPeopleAfterStep(people: Participant[], step: EventStep) {
  return people.map((person) => {
    const direct = person.id === step.speaker;
    const indirect = step.changes?.find((change) => change.id === person.id);
    const update = direct
      ? {
          status: step.status,
          position: step.position,
          confidence: step.confidence,
          evidence: step.evidence,
        }
      : indirect;
    const nextNote = indirect?.note ?? (direct ? step.fragment : undefined);
    const nextHistory =
      nextNote && person.history[person.history.length - 1] !== nextNote
        ? [...person.history.slice(-2), nextNote]
        : person.history;

    return {
      ...person,
      active: direct,
      status: update?.status ?? (direct ? step.status : person.status),
      position: update?.position ?? person.position,
      confidence: update?.confidence ?? person.confidence,
      evidence: update?.evidence ?? person.evidence,
      note: nextNote ?? person.note,
      history: nextHistory,
    };
  });
}

export default function LivingDecisionReview() {
  const [question, setQuestion] = useState("Should Suki launch a Matcha Subscription?");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [people, setPeople] = useState(initialPeople);
  const [currentStep, setCurrentStep] = useState<EventStep | null>(null);
  const [timeline, setTimeline] = useState<EventStep[]>([]);
  const [signalCount, setSignalCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [synthesis, setSynthesis] = useState("The room is quiet.");

  const activeIndex = useMemo(
    () => people.findIndex((person) => person.active),
    [people],
  );
  const activePerson = activeIndex >= 0 ? people[activeIndex] : null;

  function startReview(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const cleanQuestion = question.trim() || "Should Suki launch a Matcha Subscription?";
    setAskedQuestion(cleanQuestion);
    setPeople(initialPeople.map((person) => ({ ...person, history: [...person.history] })));
    setCurrentStep(null);
    setTimeline([]);
    setSignalCount(0);
    setSynthesis("The room is listening.");
    setRunning(true);
  }

  useEffect(() => {
    if (!running) {
      return;
    }

    const timers = steps.map((step, index) =>
      window.setTimeout(() => {
        setCurrentStep(step);
        setSignalCount(index + 1);
        setTimeline((items) => [...items, step].slice(-5));
        setSynthesis(step.synthesis);
        setPeople((current) => buildPeopleAfterStep(current, step));

        if (index === steps.length - 1) {
          window.setTimeout(() => {
            setPeople((current) =>
              current.map((person) => ({ ...person, active: false })),
            );
            setRunning(false);
          }, 1700);
        }
      }, step.at),
    );

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [running]);

  return (
    <main className={styles.page}>
      <section className={styles.workspace} aria-label="Living decision review">
        <header className={styles.header}>
          <Link className={styles.brand} href="/" aria-label="ctrl+love home">
            ctrl+love
          </Link>
          <div className={styles.headerMeta}>
            <span>Living Decision Review</span>
            <span>{running ? "live" : timeline.length ? "settled" : "standby"}</span>
          </div>
        </header>

        <form className={styles.questionBar} onSubmit={startReview}>
          <label className="sr-only" htmlFor="decision-question">
            Decision question
          </label>
          <input
            id="decision-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            spellCheck="true"
          />
          <button type="submit">{running ? "Restart room" : "Ask the room"}</button>
        </form>

        <div className={styles.stage}>
          <section className={styles.tableWrap} aria-label="Decision room">
            <div className={styles.table}>
              <div className={styles.tableRings} aria-hidden="true" />
              <div className={styles.synthesis} data-active={timeline.length > 0}>
                <p className={styles.asked}>{askedQuestion || "One question enters."}</p>
                <h1>{synthesis}</h1>
                <div className={styles.synthesisMeta}>
                  <span>{currentStep?.tag ?? "waiting"}</span>
                  <span>{signalCount}/9 signals</span>
                </div>
              </div>

              {people.map((person, index) => {
                const angle = (index / people.length) * 360 - 90;
                return (
                  <article
                    className={styles.participant}
                    data-active={person.active}
                    data-position={person.position}
                    data-vacant={person.vacant ? "true" : undefined}
                    key={person.id}
                    style={{ "--angle": `${angle}deg` } as React.CSSProperties}
                  >
                    <div className={styles.personName}>{person.name}</div>
                    <div className={styles.personLens}>{person.lens}</div>
                    <div className={styles.status}>{person.status}</div>
                    {person.vacant ? (
                      <div className={styles.emptySeat} aria-hidden="true" />
                    ) : (
                      <div className={styles.meter} aria-label={`${person.confidence}% confidence`}>
                        <span style={{ width: `${person.confidence}%` }} />
                      </div>
                    )}
                    <div className={styles.position}>{positionLabels[person.position]}</div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className={styles.observationPanel} aria-label="Live thought changes">
            <div className={styles.panelHeader}>
              <span>state changes</span>
              <span>{activePerson?.name ?? "room"}</span>
            </div>

            <div className={styles.fragmentNow}>
              <span>{activePerson?.name ?? "room"}</span>
              <p>{currentStep?.fragment ?? "thinking..."}</p>
            </div>

            <div className={styles.peopleStates}>
              {people.filter((person) => !person.vacant).map((person) => (
                <div className={styles.stateRow} key={person.id}>
                  <div>
                    <strong>{person.name}</strong>
                    <span>{person.note}</span>
                  </div>
                  <em>{person.confidence}%</em>
                </div>
              ))}
            </div>

            <div className={styles.timeline}>
              {timeline.length === 0 ? (
                <p>waiting for first signal</p>
              ) : (
                timeline.map((item, index) => (
                  <p key={`${item.at}-${index}`}>
                    <span>{item.tag}</span>
                    {item.fragment}
                  </p>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
