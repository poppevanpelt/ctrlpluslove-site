import { AmbassadorGrid } from "./ambassador-grid";
import { featuredAmbassadors } from "./ambassadors-data";
import { HomeHero } from "./home-hero";
import { LivingTicker } from "./living-ticker";
import { ThemeToggle } from "./theme-toggle";

const howItWorks = [
  {
    step: "Step 1",
    title: "Bring the decision",
    copy: "A strategic, creative or commercial decision that matters enough to challenge before you commit.",
  },
  {
    step: "Step 2",
    title: "Build the right room",
    copy: "Relevant AI systems, trusted experts, market signals and opposing perspectives are brought together around the question.",
  },
  {
    step: "Step 3",
    title: "Leave with a sharper move",
    copy: "The room identifies what holds, what breaks and what should happen next: move, adapt or stop.",
  },
];

const offers = [
  {
    title: "Decision Stress-Test™",
    description:
      "One important decision, subjected to concentrated strategic and creative pressure.",
    details: ["90 minutes", "One decision", "Clear recommendation", "Move, adapt or stop", "€4,500"],
    cta: "Bring a decision",
    href: "mailto:hello@ctrlpluslove.com",
  },
  {
    title: "On-Call Room™",
    description:
      "Ongoing access for decisions that keep moving, changing or returning.",
    details: ["Embedded decision support", "Direct access", "Fast turnaround", "From €5,000 per month"],
    cta: "Discuss access",
    href: "mailto:hello@ctrlpluslove.com",
  },
  {
    title: "Kill or Scale",
    description:
      "A focused review for an idea, proposition, product or campaign that needs a hard answer.",
    details: ["Commercial and creative pressure test", "Weaknesses exposed early", "Directional verdict", "Price on request"],
    cta: "Test an idea",
    href: "mailto:hello@ctrlpluslove.com",
  },
];

const roomVoices = [
  {
    name: "Simon Cross",
    role: "The Critic",
    line: "Challenges the answer everyone already agreed on.",
  },
  {
    name: "Nick Deckman",
    role: "The Commercial Realist",
    line: "Sees the cost of being wrong.",
  },
  {
    name: "Lexi Arden",
    role: "The Cultural Lens",
    line: "Spots what others miss.",
  },
  {
    name: "Akiko Hayashi",
    role: "The Consequence Keeper",
    line: "Looks beyond the next decision.",
  },
  {
    name: "Adrian Mbeki",
    role: "The Reality Check",
    line: "Tests what survives outside the room.",
  },
  {
    name: "The Customer",
    role: "The Missing Chair",
    line: "Would anyone outside this room actually care?",
  },
];

const proofExamples = [
  {
    label: "Case / Signal 01",
    assumption: "The approval experience was the problem.",
    surfaced: "The rejection experience mattered more.",
    shift:
      "Attention moved from improving approval to understanding the moment people were turned away.",
  },
  {
    label: "Case / Signal 02",
    assumption: "People wanted a better chair.",
    surfaced: "They wanted their life back.",
    shift:
      "The question moved from product features to the emotional job the product had to do.",
  },
  {
    label: "Case / Signal 03",
    assumption: "People were buying apparel.",
    surfaced: "They were buying freedom.",
    shift:
      "The team stopped treating the campaign as category messaging and started looking at what the choice unlocked.",
  },
];

const practicalQuestions = [
  {
    question: "Is the work confidential?",
    answer:
      "Yes. Sensitive strategy, market information and new product development can be handled under NDA.",
  },
  {
    question: "Is this a workshop?",
    answer:
      "No. It is a structured decision process designed to produce a recommendation, not another room full of notes.",
  },
  {
    question: "Who joins the room?",
    answer:
      "The room is assembled around the decision. Relevant AI systems, expert perspectives and human specialists are activated only when useful.",
  },
  {
    question: "What do we receive?",
    answer:
      "A clear view of what holds, what breaks, the important contradictions and the recommended next move.",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <ThemeToggle />

      <HomeHero />

      <LivingTicker />

      <section
        className="content-section ruled homepage-section"
        id="how-it-works"
        aria-labelledby="how-it-works-title"
      >
        <div className="content-block wide homepage-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">How it works</p>
              <h2 id="how-it-works-title">
                One decision. More than one way of seeing it.
              </h2>
            </div>
            <p>
              ctrl+love is a distributed creative intelligence network built
              around AI systems, trusted experts and structured workflows.
            </p>
          </div>

          <div className="homepage-step-grid">
            {howItWorks.map((step) => (
              <article className="homepage-step" key={step.title}>
                <p>{step.step}</p>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-section ruled homepage-section offer-section"
        id="offer"
        aria-labelledby="offer-title"
      >
        <div className="content-block wide homepage-block">
          <div className="ways-heading">
            <p className="section-kicker">The offer</p>
            <h2 id="offer-title">Choose the room the decision needs.</h2>
          </div>

          <div className="homepage-offer-grid">
            {offers.map((offer) => (
              <article className="homepage-offer" key={offer.title}>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <ul>
                  {offer.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <a className="text-link" href={offer.href}>
                  {offer.cta} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-section ruled homepage-section"
        id="room"
        aria-labelledby="room-title"
      >
        <div className="content-block statement-block">
          <div className="opening-flow">
            <p className="opening-line" id="room-title">
              Meet the room.
            </p>
            <p className="bridge-line">
              Built to disagree before the world does.
            </p>
            <p className="homepage-support">
              Each decision activates only the perspectives it needs.
            </p>
          </div>
          <div className="room-preview" aria-label="Room preview">
            {roomVoices.map((voice) => (
              <div className="persona-card" key={voice.name}>
                <span>{voice.name}</span>
                <p>{voice.role}</p>
                <em>{voice.line}</em>
              </div>
            ))}
          </div>
          <a className="text-link" href="/living-decision-simulator-episode-002/">
            Meet the full room →
          </a>
        </div>
      </section>

      <section
        className="content-section ruled ambassador-section"
        aria-labelledby="people-title"
      >
        <div className="content-block ambassador-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">The human network</p>
              <h2 id="people-title">The People Behind ctrl+love.</h2>
            </div>
            <p>
              ctrl+love connects trusted creative and strategic experts across
              markets, cultures and industries. The right local voice can enter
              the room when the decision needs it.
            </p>
          </div>

          <AmbassadorGrid ambassadors={featuredAmbassadors} compact />

          <a className="text-link" href="/ambassadors/">
            Meet the network →
          </a>
        </div>
      </section>

      <section className="content-section ruled final-cta-section conflict-section">
        <div className="content-block statement-block centered final-cta">
          <h2 className="statement-title cta-title">
            DESIGNED FOR <span className="conflict-word">CONFLICT.</span>
            <br />
            <span>NOT COMFORT.</span>
          </h2>
          <p className="conflict-copy">
            Most systems try to produce one smooth answer. ctrl+love is
            structured to expose disagreement, contradictions and blind spots
            before a decision reaches the market.
          </p>
        </div>
      </section>

      <section
        className="content-section ruled homepage-section proof-section"
        id="cases"
        aria-labelledby="proof-title"
      >
        <div className="content-block wide surfaced-section">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">From the room</p>
              <h2 id="proof-title">
                What changed after the question entered the room.
              </h2>
            </div>
          </div>

          <div className="homepage-proof-grid">
            {proofExamples.map((example) => (
              <article className="homepage-proof" key={example.label}>
                <p>{example.label}</p>
                <dl>
                  <div>
                    <dt>Assumption</dt>
                    <dd>{example.assumption}</dd>
                  </div>
                  <div>
                    <dt>What surfaced</dt>
                    <dd>{example.surfaced}</dd>
                  </div>
                  <div>
                    <dt>Decision shift</dt>
                    <dd>{example.shift}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <a className="text-link" href="/living-decision-simulator-episode-002/">
            See more cases and episodes →
          </a>
        </div>
      </section>

      <section
        className="content-section ruled homepage-section practical-section"
        aria-labelledby="practical-title"
      >
        <div className="content-block wide homepage-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">Practical</p>
              <h2 id="practical-title">
                Built for decisions that may not be public yet.
              </h2>
            </div>
          </div>

          <div className="practical-grid">
            {practicalQuestions.map((item) => (
              <article className="practical-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section ruled final-contact-section">
        <div className="content-block statement-block centered final-contact">
          <p className="section-kicker">Contact</p>
          <h2>Bring the decision into the room.</h2>
          <p>
            Tell us what you are deciding, what is at stake and when the
            decision needs to be made.
          </p>
          <a href="mailto:hello@ctrlpluslove.com" className="text-link">
            hello@ctrlpluslove.com
          </a>
          <p className="final-contact-note">Confidential conversations welcome.</p>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-copy">
          <p>ctrl+love</p>
          <p>
            <a href="mailto:hello@ctrlpluslove.com">
              hello@ctrlpluslove.com
            </a>
          </p>
          <p>
            <a href="https://nl.linkedin.com/in/poppevanpelt">
              Poppe van Pelt · LinkedIn
            </a>
          </p>
          <p>
            <a href="/inside-ctrl-love/">Inside ctrl+love</a>
          </p>
          <p className="copyright">ctrl+love/2026</p>
        </div>
      </footer>
    </main>
  );
}
