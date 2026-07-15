import Link from "next/link";

import { HomeHero } from "./home-hero";
import { SteelBallPresence } from "./steel-ball-presence";
import { ThemeToggle } from "./theme-toggle";

const roomEntries = [
  {
    label: "Perspective 01",
    title: "Commercial pressure enters.",
    observation:
      "Expansion demand is visible, but acquisition quality is carried by one partner channel and has not survived a full retention cycle.",
    before: "82%",
    after: "68%",
    verdict: "Proceed becomes conditional.",
  },
  {
    label: "Perspective 02",
    title: "Customer reality enters.",
    observation:
      "The Brazilian segment wants the outcome, not the current product shape. Translation would hide a proposition problem.",
    before: "68%",
    after: "51%",
    verdict: "The question changes.",
  },
  {
    label: "Perspective 03",
    title: "Execution consequence enters.",
    observation:
      "A next-quarter launch would move senior attention away from retention work that already explains the strongest revenue risk.",
    before: "51%",
    after: "91%",
    verdict: "The Room has changed its mind.",
  },
];

const artifactFields = [
  ["Original decision", "Expand into Brazil next quarter."],
  ["Pressure applied", "Commercial quality, customer reality, execution consequence."],
  ["Blind spot", "The team was treating early demand as durable market permission."],
  ["Decision", "Delay launch. Run six weeks of retention validation. Re-enter the Room."],
  ["Confidence", "91%"],
  ["Reality contact", "Recovered."],
];

export default function Home() {
  return (
    <main className="site-shell chapter-one" id="main-content">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <ThemeToggle />

      <HomeHero />

      <section
        className="content-section ruled chapter-room-section"
        id="the-room"
        aria-labelledby="first-room-title"
      >
        <div className="content-block chapter-room-block">
          <div className="room-status" aria-label="Room status">
            <span>ROOM STATUS</span>
            <strong>Decision entering...</strong>
          </div>

          <article className="chapter-decision-card">
            <div className="decision-card-header">
              <p>Decision 014</p>
              <span>Awaiting approval</span>
            </div>
            <h2 id="first-room-title">
              Should we expand into Brazil next quarter?
            </h2>
            <dl className="decision-card-facts">
              <div>
                <dt>Current recommendation</dt>
                <dd>Proceed.</dd>
              </div>
              <div>
                <dt>Confidence</dt>
                <dd>82%</dd>
              </div>
              <div>
                <dt>Visible pressure</dt>
                <dd>Board momentum. Competitor entry. Partner enthusiasm.</dd>
              </div>
            </dl>
          </article>

          <div className="room-entry-list" aria-label="How the Room changes the decision">
            {roomEntries.map((entry) => (
              <article className="room-entry" key={entry.label}>
                <div>
                  <p>{entry.label}</p>
                  <h3>{entry.title}</h3>
                  <span>{entry.verdict}</span>
                </div>
                <p>{entry.observation}</p>
                <dl>
                  <div>
                    <dt>Before</dt>
                    <dd>{entry.before}</dd>
                  </div>
                  <div>
                    <dt>After</dt>
                    <dd>{entry.after}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="room-changed-mind" role="status">
            <p>THE ROOM HAS CHANGED ITS MIND.</p>
          </div>
        </div>
      </section>

      <section
        className="content-section ruled final-verdict-section"
        aria-labelledby="verdict-title"
      >
        <div className="content-block verdict-block">
          <p className="section-kicker">Final verdict</p>
          <h2 id="verdict-title">
            Delay launch.
            <br />
            Run six weeks of retention validation.
            <br />
            Re-enter the Room.
          </h2>
          <dl className="verdict-metrics" aria-label="Final verdict metrics">
            <div>
              <dt>Confidence</dt>
              <dd>91%</dd>
            </div>
            <div>
              <dt>Reality contact</dt>
              <dd>Recovered.</dd>
            </div>
          </dl>
          <p className="verdict-rule">Reality always gets the final vote.</p>
        </div>
      </section>

      <section
        className="content-section ruled decision-artifact-section"
        aria-labelledby="artifact-title"
      >
        <div className="content-block artifact-block">
          <div className="artifact-heading">
            <p className="section-kicker">Decision Artifact</p>
            <h2 id="artifact-title">Decision 014 / Reality Contact Record</h2>
          </div>

          <article className="decision-artifact" aria-label="Decision Artifact 014">
            <div className="artifact-topline">
              <span>CTRL+LOVE</span>
              <span>ROOM OUTPUT / 001</span>
            </div>
            <dl>
              {artifactFields.map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </section>

      <section
        className="content-section ruled homepage-section steel-ball-signature-section chapter-steel-section"
        aria-labelledby="steel-ball-title"
      >
        <div className="content-block wide homepage-block">
          <div className="chapter-object-heading">
            <p className="section-kicker">Artifact 001</p>
            <h2 id="steel-ball-title">Confidence should feel heavy.</h2>
          </div>
          <SteelBallPresence />
        </div>
      </section>

      <section
        className="content-section ruled constitution-article-section"
        aria-labelledby="article-one-title"
      >
        <div className="content-block article-block">
          <p className="section-kicker">The Constitution</p>
          <h2 id="article-one-title">ARTICLE I</h2>
          <p className="article-law">Reality always gets the final vote.</p>
          <p className="article-note">
            The Room exists because internal confidence is not evidence. It is
            only a decision waiting to meet the world.
          </p>
          <Link className="text-link" href="/constitution/">
            Read the visible articles →
          </Link>
        </div>
      </section>

      <section
        className="content-section ruled admission-section"
        aria-labelledby="admission-title"
      >
        <div className="content-block admission-block">
          <p className="section-kicker">Admission</p>
          <h2 id="admission-title">What decision keeps you awake?</h2>
          <Link
            className="home-hero-cta"
            href="mailto:hello@ctrlpluslove.com?subject=Bring%20this%20decision%20into%20the%20Room"
          >
            Bring it into the Room
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-copy">
          <p>ctrl+love</p>
          <p>
            <a href="/room/">The Room</a>
          </p>
          <p>
            <a href="/museum/">The Museum</a>
          </p>
          <p>
            <a href="/artifacts/">Artifacts</a>
          </p>
          <p>
            <a href="/constitution/">The Constitution</a>
          </p>
          <p>
            <a href="mailto:hello@ctrlpluslove.com">Admission</a>
          </p>
          <p className="copyright">ctrl+love/2026</p>
        </div>
      </footer>
    </main>
  );
}
