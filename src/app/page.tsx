import Link from "next/link";

import { confirmedAmbassadors } from "./ambassadors-data";
import { HomeHero } from "./home-hero";
import { LivingTicker } from "./living-ticker";
import {
  homepageRoomPersonas,
  supportingRoomPersonas,
} from "./room-personas-data";
import { SteelBallPresence } from "./steel-ball-presence";
import { ThemeToggle } from "./theme-toggle";

const howItWorks = [
  {
    step: "Step 1",
    title: "Bring one real decision",
    copy: "A strategy, proposition, campaign, product move or growth question that is important enough to be wrong about.",
  },
  {
    step: "Step 2",
    title: "Define the stakes",
    copy: "We clarify who is affected, what success would mean and what would become expensive if the decision fails.",
  },
  {
    step: "Step 3",
    title: "Build the room",
    copy: "AI systems, expert judgment, market context and opposing perspectives are assembled around the question.",
  },
  {
    step: "Step 4",
    title: "Expose the pressure",
    copy: "The room tests the decision against customers, culture, execution, commercial reality and likely consequences.",
  },
  {
    step: "Step 5",
    title: "Leave with a move",
    copy: "You get what holds, what breaks, what needs to change and whether to move, adapt or stop.",
  },
];

const offers = [
  {
    title: "Decision Stress-Test™",
    purpose: "A concentrated pressure test for one decision that needs a sharper answer.",
    bestFor: "A launch, repositioning, growth bet, campaign or board-level choice.",
    participants: "CTRL+LOVE lead, relevant room lenses, AI synthesis and selected expert pressure.",
    outcome: "A clear recommendation: move, adapt or stop. €4,500.",
    cta: "Bring this decision",
    href: "/stress-test/",
  },
  {
    title: "On-Call Room™",
    purpose: "Ongoing decision support when the question keeps moving or returning.",
    bestFor: "Founders, leadership teams and brands making repeated high-stakes calls.",
    participants: "A standing room with fast access to the right human and machine perspectives.",
    outcome: "Sharper decisions over time, without turning every question into a workshop.",
    cta: "See when to use it",
    href: "/pricing/on-call-room/",
  },
  {
    title: "Kill or Scale™",
    purpose: "A hard answer for an idea, proposition, product or campaign at a fork in the road.",
    bestFor: "Concepts that may deserve more investment, or a dignified ending.",
    participants: "Creative, commercial, cultural and execution pressure around the same evidence.",
    outcome: "A directional verdict and the strongest path if the idea survives.",
    cta: "Enter this room",
    href: "/pricing/kill-or-scale/",
  },
];

const insideRoom = [
  {
    title: "The decision brief",
    copy: "What is being decided, who is affected, what is assumed and what would make the decision wrong.",
  },
  {
    title: "Perspective passes",
    copy: "Distinct lenses test the same decision: customer truth, culture, commerce, execution, reputation and consequence.",
  },
  {
    title: "The contradiction map",
    copy: "Where the room disagrees, where confidence is false and which assumptions deserve evidence before action.",
  },
  {
    title: "The next move",
    copy: "A concise recommendation with what to keep, what to change and what not to do yet.",
  },
];

const featuredProof = [
  {
    name: "Undisclosed Fintech Lender",
    question: "What is the strongest path to growth without flattening the brand?",
    outcome:
      "The Room separated product momentum from sustainable brand advantage, giving leadership a clear strategy for long-term growth.",
  },
];

const featuredProjects = [
  {
    name: "Undisclosed Healthcare Provider",
    question: "People wanted their life back.",
    outcome:
      "The Room reframed the challenge from delivering healthcare to enabling independence, reshaping the organisation's proposition and priorities.",
  },
  {
    name: "Undisclosed B2B SaaS Platform",
    question: "Which customers should we stop building for?",
    outcome:
      "The Room identified the customer segments with the greatest long-term value, bringing focus to product, sales and marketing.",
  },
  {
    name: "Undisclosed Consumer Brand",
    question: "Why were customers choosing us less often?",
    outcome:
      "The Room uncovered where the brand had lost relevance, leading to a sharper positioning and renewed customer value proposition.",
  },
  {
    name: "Undisclosed Industrial Manufacturer",
    question: "Are we selling products or solving problems?",
    outcome:
      "The Room shifted the commercial strategy from product-led to solution-led, creating a more differentiated market position.",
  },
  {
    name: "Undisclosed Scale-up",
    question: "Has the company reached a growth ceiling?",
    outcome:
      "The Room surfaced the structural, cultural and leadership constraints behind the visible symptoms, providing clarity on the next stage of growth.",
  },
];

const networkPerspectives: Record<string, string> = {
  "poppe-van-pelt":
    "Creative leadership, brand consequence and the discipline to keep the room honest.",
  "nadia-al-mardini":
    "European market instinct, strategic framing and the questions a local team would actually ask.",
  "shun-iwai":
    "Japanese cultural intelligence and the quiet signals that rarely survive a global deck.",
  "sung-wook-tayl-chung":
    "Korean market perspective, creative judgment and pressure on whether the idea travels.",
  "mats-utberg":
    "Nordic brand sense, commercial clarity and a useful allergy to overclaiming.",
  "jorge-virgos":
    "Southern European creative strategy and the ability to spot when momentum is not yet meaning.",
};

const featuredNetwork = confirmedAmbassadors.slice(0, 6);

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
    <main className="site-shell" id="main-content">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
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
              <p className="section-kicker">How a Decision Room works</p>
              <h2 id="how-it-works-title">
                One decision, tested from more than one reality.
              </h2>
            </div>
            <p>
              A Decision Room is a structured pressure test. It invites the
              people, systems and perspectives the decision will meet later,
              while there is still time to change course.
            </p>
          </div>

          <div
            className="decision-process-grid"
            id="decision-room-works"
            aria-label="Five steps in a Decision Room"
          >
            {howItWorks.map((step) => (
              <article className="decision-process-step" key={step.title}>
                <p>{step.step}</p>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>

          <Link className="text-link" href="#offer">
            Explore the rooms →
          </Link>
        </div>
      </section>

      <section
        className="content-section ruled homepage-section inside-room-section"
        aria-labelledby="inside-room-title"
      >
        <div className="content-block wide homepage-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">Inside a Decision Room</p>
              <h2 id="inside-room-title">
                Less theatre. More useful friction.
              </h2>
            </div>
            <p>
              The room is not a brainstorm and not a dashboard. It is a working
              system for turning disagreement into a better decision.
            </p>
          </div>

          <div className="inside-room-layout">
            <div className="inside-room-visual" aria-hidden="true">
              {/* TODO: Replace this neutral schematic with a production capture of a real Decision Room output once client-safe material is available. */}
              <span className="inside-room-node is-decision">Decision</span>
              <span className="inside-room-node">Customer</span>
              <span className="inside-room-node">Culture</span>
              <span className="inside-room-node">Commerce</span>
              <span className="inside-room-node">Execution</span>
              <span className="inside-room-node is-outcome">Next move</span>
            </div>
            <div className="inside-room-list">
              {insideRoom.map((item) => (
                <article className="inside-room-item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="content-section ruled homepage-section proof-section"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="content-block wide homepage-block proof-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">What changes when the room changes</p>
              <h2 id="projects-title">
                Better decisions usually start as better disagreement.
              </h2>
            </div>
          </div>

          {featuredProof.map((project) => (
            <article className="homepage-proof proof-panel" key={project.name}>
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

          <div className="homepage-proof-grid project-proof-grid">
            {featuredProjects.map((project, index) => (
              <article
                className="homepage-proof project-proof"
                id={`project-undisclosed-${String(index + 2).padStart(2, "0")}`}
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
        className="content-section ruled homepage-section steel-ball-signature-section"
        aria-labelledby="steel-ball-title"
      >
        <div className="content-block wide homepage-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">Signature artifact</p>
              <h2 id="steel-ball-title">Confidence should feel heavy.</h2>
            </div>
            <p>
              The Steel Ball is the small physical version of the same idea:
              pressure first, certainty later.
            </p>
          </div>

          <SteelBallPresence />
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
                <dl className="offer-definition-list">
                  <div>
                    <dt>Purpose</dt>
                    <dd>{offer.purpose}</dd>
                  </div>
                  <div>
                    <dt>Best for</dt>
                    <dd>{offer.bestFor}</dd>
                  </div>
                  <div>
                    <dt>Participants</dt>
                    <dd>{offer.participants}</dd>
                  </div>
                  <div>
                    <dt>Outcome</dt>
                    <dd>{offer.outcome}</dd>
                  </div>
                </dl>
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

          <div className="network-perspective-grid" aria-label="Featured human perspectives">
            {featuredNetwork.map((person) => (
              <article className="network-perspective-card" key={person.id}>
                <p>{person.number}</p>
                <h3>
                  {person.preferredName ?? person.name}
                  <span>{person.flag}</span>
                </h3>
                <span>{person.city} / {person.country}</span>
                <p>{networkPerspectives[person.id] ?? "A trusted perspective that enters when the decision needs it."}</p>
                <Link href={`/ambassadors/#ambassador-${person.id}`}>
                  View perspective →
                </Link>
              </article>
            ))}
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

          <Link className="text-link" href="/ambassadors/">
            Meet the wider network →
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
          <p className="section-kicker">Before reality does</p>
          <h2>Bring the decision into the room.</h2>
          <p>
            Most organisations test products before releasing them. Important
            decisions deserve the same pressure.
          </p>
          <div className="home-hero-actions" aria-label="Final actions">
            <Link href="/stress-test/" className="home-hero-cta">
              Bring a decision into the room
            </Link>
            <Link href="mailto:hello@ctrlpluslove.com?subject=Talk%20to%20CTRL%2BLOVE" className="home-hero-secondary">
              Talk to CTRL+LOVE
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
