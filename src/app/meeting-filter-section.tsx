"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const outcomes = [
  {
    id: "green",
    name: "Green room",
    action: "Invite ctrl+love.",
    copy: "The question is alive. The tension is useful. Someone is willing to be wrong.",
  },
  {
    id: "amber",
    name: "Amber room",
    action: "Run a small stress-test first.",
    copy: "There may be potential, but the room needs proof before poetry.",
  },
  {
    id: "red",
    name: "Red room",
    action: "Politely decline.",
    copy: "The answer is already politically chosen. We stay home.",
  },
];

const questions = [
  {
    id: "alive",
    label: "Is the question still alive?",
  },
  {
    id: "disagreement",
    label: "Is there useful disagreement?",
  },
  {
    id: "wrong",
    label: "Is someone willing to be wrong?",
  },
];

type Answer = "yes" | "no";
type OutcomeId = "green" | "amber" | "red";
type Answers = Record<(typeof questions)[number]["id"], Answer | null>;

const initialAnswers = questions.reduce((accumulator, question) => {
  accumulator[question.id] = null;
  return accumulator;
}, {} as Answers);

type MeetingFilterSectionProps = {
  isStandalone?: boolean;
};

export function MeetingFilterSection({ isStandalone = false }: MeetingFilterSectionProps) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  const result = useMemo(() => {
    const values = Object.values(answers);
    const answered = values.filter(Boolean).length;
    const yesCount = values.filter((value) => value === "yes").length;
    const noCount = values.filter((value) => value === "no").length;

    let outcome: OutcomeId | null = null;

    if (answered === questions.length) {
      if (yesCount === questions.length) {
        outcome = "green";
      } else if (noCount >= 2) {
        outcome = "red";
      } else {
        outcome = "amber";
      }
    }

    return { answered, outcome, yesCount };
  }, [answers]);

  const activeOutcome = outcomes.find((outcome) => outcome.id === result.outcome);

  function setAnswer(questionId: keyof Answers, answer: Answer) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: answer,
    }));
  }

  function resetAnswers() {
    setAnswers(initialAnswers);
  }

  return (
    <section
      className={`content-section ruled meeting-filter-section${isStandalone ? " is-open" : ""}`}
      id="meeting-filter"
      aria-labelledby="meeting-filter-title"
      aria-hidden={isStandalone ? undefined : "true"}
      hidden={!isStandalone}
    >
      {isStandalone ? (
        <Link className="meeting-filter-return" href="/">
          Back to ctrl+love
        </Link>
      ) : (
        <button className="meeting-filter-return" data-meeting-filter-close type="button">
          Close Meeting Filter
        </button>
      )}
      <div className="content-block meeting-filter-block">
        <div className="meeting-filter-heading">
          <p className="section-kicker">The Meeting Filter&trade;</p>
          <h2 id="meeting-filter-title">Should we be in this meeting?</h2>
          <p>
            Before you invite ctrl+love into a room, answer three questions.
          </p>
        </div>

        <ol className="meeting-filter-questions">
          {questions.map((question) => (
            <li key={question.id}>
              <span>{question.label}</span>
              <div className="meeting-filter-choice" aria-label={question.label}>
                <button
                  aria-pressed={answers[question.id] === "yes"}
                  data-selected={answers[question.id] === "yes"}
                  type="button"
                  onClick={() => setAnswer(question.id, "yes")}
                >
                  Yes
                </button>
                <button
                  aria-pressed={answers[question.id] === "no"}
                  data-selected={answers[question.id] === "no"}
                  type="button"
                  onClick={() => setAnswer(question.id, "no")}
                >
                  No
                </button>
              </div>
            </li>
          ))}
        </ol>

        <div className="meeting-filter-result" aria-live="polite">
          <p className="meeting-filter-support">
            A small diagnostic for detecting whether an organization is ready for
            judgment, or only looking for confirmation.
          </p>
          <div className="meeting-filter-status">
            <span>
              {result.answered < questions.length
                ? "Answer the three questions to test the room."
                : `${result.yesCount} of 3 signals are present. ${activeOutcome?.action}`}
            </span>
            <button type="button" onClick={resetAnswers}>
              Reset filter
            </button>
          </div>
        </div>

        <div className="meeting-filter-outcomes" aria-label="Meeting filter outcomes">
          {outcomes.map((outcome) => (
            <article
              className="meeting-filter-card"
              data-room={outcome.id}
              data-active={outcome.id === result.outcome}
              key={outcome.name}
            >
              <p>{outcome.name}</p>
              <h3>{outcome.action}</h3>
              <span>{outcome.copy}</span>
            </article>
          ))}
        </div>

        <div className="meeting-filter-close">
          <p>
            Not every room deserves better thinking.
            <br />
            Some rooms need a polite no.
          </p>
          <a href="mailto:hello@ctrlpluslove.com" className="text-link">
            Use it before the invite.
          </a>
        </div>
      </div>
    </section>
  );
}
