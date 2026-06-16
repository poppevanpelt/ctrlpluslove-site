const outcomes = [
  {
    name: "Green room",
    action: "Invite ctrl+love.",
    copy: "The question is alive. The tension is useful. Someone is willing to be wrong.",
  },
  {
    name: "Amber room",
    action: "Run a small stress-test first.",
    copy: "There may be potential, but the room needs proof before poetry.",
  },
  {
    name: "Red room",
    action: "Politely decline.",
    copy: "The answer is already politically chosen. Poppe stays home.",
  },
];

const questions = [
  "Is the question still alive?",
  "Is there useful disagreement?",
  "Is someone willing to be wrong?",
];

export function MeetingFilterSection() {
  return (
    <section
      className="content-section ruled meeting-filter-section"
      id="meeting-filter"
      aria-labelledby="meeting-filter-title"
    >
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
            <li key={question}>{question}</li>
          ))}
        </ol>

        <p className="meeting-filter-support">
          A small diagnostic for detecting whether an organization is ready for
          judgment, or only looking for confirmation.
        </p>

        <div className="meeting-filter-outcomes" aria-label="Meeting filter outcomes">
          {outcomes.map((outcome) => (
            <article
              className="meeting-filter-card"
              data-room={outcome.name.split(" ")[0].toLowerCase()}
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
