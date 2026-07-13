import Link from "next/link";

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
    href: "/stress-test/",
  },
  {
    title: "On-Call Room™",
    description:
      "Ongoing access for decisions that keep moving, changing or returning.",
    details: ["Embedded decision support", "Direct access", "Fast turnaround", "From €5,000 per month"],
    cta: "Discuss access",
    href: "/pricing/on-call-room/",
  },
  {
    title: "Kill or Scale™",
    description:
      "A focused review for an idea, proposition, product or campaign that needs a hard answer.",
    details: ["Commercial and creative pressure test", "Weaknesses exposed early", "Directional verdict", "Price on request"],
    cta: "Test an idea",
    href: "/pricing/kill-or-scale/",
  },
];

const practiceLinks = [
  {
    title: "See a decision change",
    copy: "Follow the discussion from first assumption to sharper next move.",
    href: "#projects",
  },
  {
    title: "Read an anonymised project",
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
  },
  {
    name: "Undisclosed Brand 02",
    question: "What is the strongest path to growth without flattening the brand?",
    outcome:
      "The Room separated product momentum from sustainable brand advantage.",
  },
  {
    name: "Undisclosed Brand 03",
    question: "Has the company reached a growth ceiling?",
    outcome:
      "The Room surfaced structural, cultural and leadership constraints behind the visible symptoms.",
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

const founderHighlights = [
  "ADCN Hall of Fame",
  "TBWA",
  "Co-founder of Selmore",
  "Lead Creative Director for Apple NL/BE",
  "Founder of CTRL+LOVE",
];

const founderBio = [
  "Poppe van Pelt is an ADCN Hall of Fame creative director and the founder of CTRL+LOVE.",
  "He began his career at TBWA before co-founding Selmore, which he helped build into one of the Netherlands’ leading independent creative agencies. Over the course of his career, Poppe has worked with ambitious international brands and served as Lead Creative Director for Apple in the Netherlands and Belgium.",
  "At CTRL+LOVE, he brings together an international network of experienced creative and strategic leaders. Combining local intelligence, human judgment and AI, they help organisations challenge assumptions, expose blind spots and make sharper decisions before reality makes them expensive.",
  "After more than 30 years in advertising, Poppe remains driven by the same belief: technology changes, markets change and organisations change—but a powerful idea still begins with understanding people.",
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
              Every ctrl+love example below is anonymised or illustrative where
              it needs to be. The useful bit is the pressure: the question, the
              disagreement, the blind spots and the sharper next move.
            </p>
          </div>

          <div className="practice-link-grid">
            {practiceLinks.map((item) => (
              <Link className="practice-link" href={item.href} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </Link>
            ))}
          </div>

          <Link className="steel-ball-home-card" href="/steel-ball/">
            <span className="steel-ball-home-copy">
              <span className="section-kicker">Artifact 001</span>
              <strong>The Steel Ball</strong>
              <span>
                The original replica. A physical reminder to test confidence
                before reality does.
              </span>
              <em>€29.95 · View product →</em>
            </span>
            <span
              className="steel-ball-home-image"
              role="img"
              aria-label="A polished steel ball"
            >
              <span className="steel-ball-object" aria-hidden="true" />
            </span>
          </Link>
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

          <div className="homepage-proof-grid">
            {featuredProjects.map((project, index) => (
              <article
                className="homepage-proof project-proof"
                id={`project-undisclosed-${String(index + 1).padStart(2, "0")}`}
                key={project.name}
              >
                <p>Anonymised project</p>
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
                <Link className="text-link" href={offer.href}>
                  {offer.cta} →
                </Link>
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
          <Link className="text-link" href="/room/">
            Meet the full room →
          </Link>
          <p className="room-disclaimer">
            These are decision lenses, not human ambassadors. The people are in
            the network below.
          </p>
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

          <article className="founder-bio-card" aria-labelledby="founder-bio-title">
            <div className="founder-bio-intro">
              <p className="section-kicker">Founder</p>
              <h3 id="founder-bio-title">Poppe van Pelt</h3>
              <p>
                Founder-editor of ctrl+love: part creative director, part
                reality-preservation mechanism, still allergic to easy
                certainty.
              </p>
            </div>
            <ul className="founder-bio-highlights" aria-label="Founder credentials">
              {founderHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <details className="founder-bio-details">
              <summary>Read the founder bio</summary>
              <div>
                {founderBio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          </article>

          <AmbassadorGrid ambassadors={confirmedAmbassadors} compact />

          <Link className="text-link" href="/ambassadors/">
            Meet the network →
          </Link>
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
            <Link href="/stress-test/" className="home-hero-cta">
              Stress-test a decision
            </Link>
            <Link href="#projects" className="home-hero-secondary">
              Explore real projects
            </Link>
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
            <a
              href="https://www.linkedin.com/in/poppevanpelt/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Poppe van Pelt's LinkedIn profile in a new tab"
            >
              View LinkedIn profile ↗
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
