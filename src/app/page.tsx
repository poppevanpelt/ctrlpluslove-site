import { AmbassadorGrid } from "./ambassador-grid";
import { confirmedAmbassadors } from "./ambassadors-data";
import { HomeHero } from "./home-hero";
import { LivingTicker } from "./living-ticker";
import {
  homepageRoomPersonas,
  supportingRoomPersonas,
} from "./room-personas-data";
import { ThemeToggle } from "./theme-toggle";

const howItWorks = [
  {
    step: "Step 1",
    title: "Bring the decision",
    copy: "A strategic, creative or commercial decision that matters enough to test before it becomes expensive.",
  },
  {
    step: "Step 2",
    title: "Build the right room",
    copy: "AI systems, expert judgment, market signals and opposing perspectives are assembled around the question.",
  },
  {
    step: "Step 3",
    title: "Leave with a sharper move",
    copy: "The room shows what holds, what breaks and what should happen next: move, adapt or stop.",
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

const practiceLinks = [
  {
    title: "See a decision change",
    copy: "Follow the discussion from first assumption to sharper next move.",
    href: "#projects",
  },
  {
    title: "Read a real project",
    copy: "Explore how the Room challenged strategy, creative work and growth decisions.",
    href: "#projects",
  },
  {
    title: "Meet the wider Room",
    copy: "See the experts, markets and cultural perspectives behind the Engine.",
    href: "#room",
  },
];

const featuredProjects = [
  {
    name: "Undisclosed Brand 01",
    question: "How can the brand grow across the Netherlands, Germany and Belgium?",
    outcome:
      "The Room identified where the proposition travels, where it breaks and what must be adapted locally.",
    href: "#project-confidential-01",
  },
  {
    name: "Undisclosed Brand 02",
    question: "What is the strongest path to growth without flattening the brand?",
    outcome:
      "The Room separated product momentum from sustainable brand advantage.",
    href: "#project-confidential-02",
  },
  {
    name: "Undisclosed Brand 03",
    question: "Has the company reached a growth ceiling?",
    outcome:
      "The Room surfaced structural, cultural and leadership constraints behind the visible symptoms.",
    href: "#project-confidential-03",
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
        className="content-section ruled homepage-section practice-section"
        aria-labelledby="practice-title"
      >
        <div className="content-block wide homepage-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">The Room in practice</p>
              <h2 id="practice-title">
                You should not have to imagine what happens.
              </h2>
            </div>
            <p>
              Every ctrl+love project exposes the question, the disagreement,
              the blind spots, the shift in thinking and the final
              recommendation.
            </p>
          </div>

          <div className="practice-link-grid">
            {practiceLinks.map((item) => (
              <a className="practice-link" href={item.href} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

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
              A living room for decisions: fast machine intelligence, human
              judgment and a clear process for useful disagreement.
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
        className="content-section ruled homepage-section proof-section"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="content-block wide surfaced-section">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">Projects</p>
              <h2 id="projects-title">
                Decisions already brought into the Room.
              </h2>
            </div>
          </div>

          {/* TODO: Replace temporary anchors with public project routes when the Decision Library ships. */}
          <div className="homepage-proof-grid">
            {featuredProjects.map((project) => (
              <article
                className="homepage-proof project-proof"
                id={project.href.slice(1)}
                key={project.name}
              >
                <p>Project</p>
                <h3>{project.name}</h3>
                <dl>
                  <div>
                    <dt>Decision question</dt>
                    <dd>{project.question}</dd>
                  </div>
                  <div>
                    <dt>Room outcome</dt>
                    <dd>{project.outcome}</dd>
                  </div>
                </dl>
                <a className="text-link" href={project.href}>
                  Open project →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-section ruled homepage-section"
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
              The perspectives invited before a decision hardens.
            </p>
            <p className="bridge-line">
              The Room is not one voice pretending to be certainty.
            </p>
            <p className="homepage-support">
              It is a set of distinct lenses that pressure the decision from
              different angles.
            </p>
          </div>
          <div className="room-preview" aria-label="Room preview">
            {homepageRoomPersonas.map((voice) => (
              <div className="persona-card" key={voice.name}>
                <span>{voice.name}</span>
                <p>{voice.role}</p>
                <em>{voice.line}</em>
                {voice.contribution ? <small>{voice.contribution}</small> : null}
              </div>
            ))}
          </div>
          <div
            className="supporting-room-preview"
            aria-label="Supporting perspectives"
          >
            <p>Supporting perspectives enter only when relevant.</p>
            <ul>
              {supportingRoomPersonas.map((voice) => (
                <li key={voice.id}>
                  <span>{voice.name}</span>
                  <em>{voice.role}</em>
                  <strong>{voice.line}</strong>
                  {voice.contribution ? <small>{voice.contribution}</small> : null}
                </li>
              ))}
            </ul>
          </div>
          <a className="text-link" href="/room/">
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
              <h2 id="people-title">Local intelligence, without building a global office.</h2>
            </div>
            <p>
              ctrl+love connects trusted creative and strategic experts across
              markets, cultures and industries. The right local voice can enter
              the room when the decision needs it.
            </p>
          </div>

          <AmbassadorGrid ambassadors={confirmedAmbassadors} compact />

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
            Most systems try to produce one smooth answer. ctrl+love exposes
            disagreement, contradictions and blind spots before reality does.
          </p>
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

      <section className="content-section ruled final-cta-section final-growth-section">
        <div className="content-block statement-block centered final-growth-cta">
          <h2>Bring the decision before reality does.</h2>
          <div className="home-hero-actions" aria-label="Final actions">
            <a href="mailto:hello@ctrlpluslove.com" className="home-hero-cta">
              Stress-test a decision
            </a>
            <a href="#projects" className="home-hero-secondary">
              Explore real projects
            </a>
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
            <a href="https://www.linkedin.com/in/poppevanpelt/" target="_blank" rel="noopener noreferrer">
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
