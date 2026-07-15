import Image from "next/image";
import Link from "next/link";

import { confirmedAmbassadors } from "./ambassadors-data";
import { getAmbassadorProfile } from "./ambassador-profiles-data";
import { HomeHero } from "./home-hero";
import { getPublicRadarSignals } from "@/lib/radar/notion";
import { allRoomPersonas } from "./room-personas-data";
import { SteelBallPresence } from "./steel-ball-presence";
import { ThemeToggle } from "./theme-toggle";

const roomEntries = [
  {
    label: "Emotional Truth",
    participant: "MAYA ELISE HARPER",
    role: "Human Need",
    sequenceClass: "sequence-perspective-one",
    title: "Maya asks what people are buying beneath the brief.",
    observation:
      "The expansion logic is sound. The human reason to return is still too vague.",
    interruption: "The customer chair becomes visible.",
    before: "82%",
    after: "71%",
    verdict: "Emotional truth admitted.",
  },
  {
    label: "Contrarian Pressure",
    participant: "SIMON CROSS",
    role: "Useful Disagreement",
    sequenceClass: "sequence-perspective-two",
    title: "Simon challenges the answer everyone likes.",
    observation:
      "The Room is not asking whether expansion is possible. It is asking whether expansion is being used to avoid fixing the model.",
    interruption: "Momentum loses its costume.",
    before: "71%",
    after: "59%",
    verdict: "Consensus interrupted.",
  },
  {
    label: "Commercial Realism",
    participant: "NICK DECKMAN",
    role: "Cost of Being Wrong",
    sequenceClass: "sequence-perspective-three",
    title: "Nick prices the mistake.",
    observation:
      "If Brazil exposes the same retention weakness at larger scale, the cost is not launch spend. It is organisational belief in a false proof.",
    interruption: "The budget stops behaving like evidence.",
    before: "59%",
    after: "48%",
    verdict: "Commercial pressure applied.",
  },
  {
    label: "Reality Stress",
    participant: "ADRIAN MBEKI",
    role: "Outside the Room",
    sequenceClass: "sequence-perspective-four",
    title: "Adrian brings the world into the room.",
    observation:
      "The strongest signal is not demand. It is the absence of renewed usage after the first month.",
    interruption: "The decision is no longer about launch.",
    before: "48%",
    after: "91%",
    verdict: "Question reframed.",
  },
];

const personas = allRoomPersonas;

const products = [
  {
    name: "Decision Stress-Test™",
    what: "A focused Room for one important decision before it becomes expensive.",
    when: "Before a board recommendation, market launch, investment choice or strategic commitment.",
    receive: "A Decision Record with the pressure applied, tensions surfaced and the reframed question.",
    outcome: "The team leaves with sharper direction, visible risk and a next action.",
    startingPoint: "From €4,500",
    object: "pressure dossier",
    href: "/pricing/decision-stress-test/",
  },
  {
    name: "On-Call Room™",
    what: "An available decision room for executives who need pressure before committing.",
    when: "When senior teams face recurring decisions and need a trusted outside room on call.",
    receive: "A continuing decision rhythm, rapid pressure sessions and documented recommendations.",
    outcome: "Fewer protected assumptions. Faster contact with the real question.",
    startingPoint: "Ongoing partnership",
    object: "open channel",
    href: "/pricing/on-call-room/",
  },
  {
    name: "Kill or Scale™",
    what: "A decisive Room for initiatives that should either receive force or be stopped.",
    when: "When a venture, campaign or internal bet has enough momentum to become costly.",
    receive: "A structured verdict on what to protect, what to redesign and what to stop.",
    outcome: "Energy moves toward the work that deserves it.",
    startingPoint: "Scoped to the decision",
    object: "verdict switch",
    href: "/pricing/kill-or-scale/",
  },
];

const engagementOptions = [
  {
    name: "Decision Stress-Test™",
    purpose: "Pressure-test one strategic decision.",
    terms: "From €4,500",
  },
  {
    name: "On-Call Room™",
    purpose: "Continuous decision support.",
    terms: "Monthly engagement",
  },
  {
    name: "Kill or Scale™",
    purpose: "Pressure-test ventures before serious investment.",
    terms: "Custom engagement",
  },
];

const caseStudies = [
  {
    sector: "Consumer wellbeing platform",
    question: "Should we spend our way out of declining engagement?",
    blindSpot:
      "People wanted their lives back. The Room discovered that declining engagement was not a marketing problem; it was accumulated exhaustion.",
    outcome:
      "The team stopped chasing frequency and redesigned the product around permission, recovery, and return.",
    sentence: "The growth problem was a fatigue signal wearing a dashboard costume.",
  },
  {
    sector: "Global consumer brand",
    question: "Should we reposition for a younger audience?",
    blindSpot: "The company was not becoming old. It had become predictable.",
    outcome:
      "The Room preserved the brand memory, removed inherited habits, and rebuilt the launch around useful surprise.",
    sentence: "Youth was not the target. Aliveness was.",
  },
  {
    sector: "Public healthcare network",
    question: "Should we centralise the process every region keeps adapting?",
    blindSpot:
      "The inefficiency was partly a safety ritual. One local workaround was protecting patients from a central blind spot.",
    outcome:
      "The rollout became a hybrid protocol. Speed improved without erasing the human safeguard.",
    sentence: "What looked messy was carrying memory.",
  },
  {
    sector: "Climate infrastructure venture",
    question: "Should we accept a fast strategic partnership?",
    blindSpot:
      "The partner brought distribution, but also a dependency that would narrow future choices before anyone noticed.",
    outcome:
      "The deal was renegotiated with exit rights, technical independence, and a slower first commitment.",
    sentence: "The Room protected the future from a very attractive shortcut.",
  },
];

const artifactFields = [
  ["Original decision", "Expand into Brazil next quarter."],
  [
    "Participants",
    "Emotional Truth, Contrarian Pressure, Commercial Realism and Reality Stress.",
  ],
  [
    "Tensions surfaced",
    "The team was treating Brazil as one market and expansion as proof of model strength.",
  ],
  [
    "Reframed question",
    "What must become true before expansion is responsible?",
  ],
  [
    "Recommendation",
    "Delay launch. Run six weeks of retention and regional-entry validation. Re-enter the Room.",
  ],
  ["Confidence", "91% after reframing, not before."],
  [
    "Unresolved questions",
    "Which regions behave differently, and what retention signal is strong enough to proceed?",
  ],
  ["Next action", "Run the validation sprint and return with evidence."],
];

const founder = {
  name: "Poppe van Pelt",
  role: "Founder",
  image: "/ambassadors/portraits/001-poppe-van-pelt-portrait-live-20260712.jpeg",
  note:
    "Thirty years helping organisations make decisions taught me that most expensive mistakes were not caused by a lack of intelligence. They happened because nobody challenged certainty early enough. ctrl+love exists to change that.",
};

const networkSpecialisations = [
  "market-entry reality",
  "cultural translation",
  "leadership pressure",
  "product consequence",
  "institutional memory",
  "irreversible decisions",
];

const decisionJourney = [
  {
    label: "Decision enters",
    value: "Expand into Brazil next quarter.",
  },
  {
    label: "82% confidence",
    value: "Proceed.",
  },
  {
    label: "Commercial pressure",
    value: "What is the cost of being wrong at scale?",
  },
  {
    label: "Human reality",
    value: "Demand is visible. Return behaviour is not.",
  },
  {
    label: "Regional insight",
    value: "One market story hides several local truths.",
  },
  {
    label: "Execution consequence",
    value: "Launch spend would turn a weak signal into false proof.",
  },
  {
    label: "Blind spot exposed",
    value: "Expansion was protecting confidence in the existing model.",
  },
  {
    label: "Question reframed",
    value: "What must become true before expansion is responsible?",
  },
  {
    label: "91% confidence",
    value: "Delay launch. Validate retention. Re-enter the Room.",
  },
  {
    label: "Decision leaves",
    value: "Reality contact recovered.",
  },
];

type HomepageRadarSignal = {
  location: string;
  type: string;
  signal: string;
  confidence?: string;
  source?: string;
};

const editorialRadarSignals: HomepageRadarSignal[] = [
  {
    location: "Amsterdam",
    type: "Observation",
    signal:
      "Parents are increasingly using cargo bikes as temporary waiting rooms between school, work and errands.",
    confidence: "Medium",
    source: "Editorial example",
  },
  {
    location: "São Paulo",
    type: "Cultural Note",
    signal:
      "Clients are asking how quickly AI helped, rather than whether AI was used.",
    confidence: "Medium",
    source: "Editorial example",
  },
  {
    location: "Cape Town",
    type: "Contradiction",
    signal:
      "Local workarounds often protect context, safety or trust that central processes cannot see.",
    confidence: "High",
    source: "Editorial example",
  },
];

async function getHomepageRadarSignals(): Promise<{
  signals: HomepageRadarSignal[];
  source: "live" | "editorial";
}> {
  try {
    const publicSignals = await getPublicRadarSignals();
    const signals = publicSignals.slice(0, 3).map((signal) => ({
      location: signal.location || signal.market || "Radar",
      type: signal.type || "Signal",
      signal: signal.signal,
      confidence: signal.confidence || undefined,
      source: signal.market || undefined,
    }));

    if (signals.length === 3) {
      return { signals, source: "live" };
    }
  } catch {
    // The homepage must stay available even when Radar's private source is unavailable.
  }

  return { signals: editorialRadarSignals, source: "editorial" };
}

export default async function Home() {
  const radarPreview = await getHomepageRadarSignals();
  const humanAmbassadors = confirmedAmbassadors.filter(
    (ambassador) => ambassador.status === "ambassador",
  );
  const flip = humanAmbassadors.find((ambassador) => ambassador.id === "flip");
  const networkPreview = [
    ...humanAmbassadors
      .filter((ambassador) => ambassador.id !== "flip")
      .slice(0, 8),
    ...(flip ? [flip] : []),
  ];
  const founderProfile = getAmbassadorProfile("poppe-van-pelt");
  const countries = Array.from(
    new Set(humanAmbassadors.map((ambassador) => ambassador.country)),
  );
  const cities = Array.from(
    new Set(humanAmbassadors.map((ambassador) => ambassador.city)),
  );
  const availablePerspectives = allRoomPersonas.length + humanAmbassadors.length;

  return (
    <main className="site-shell chapter-one" id="main-content">
      <a className="skip-link" href="#room-changed-question">
        Skip to main content
      </a>
      <ThemeToggle />

      <HomeHero />

      <section
        className="content-section ruled homepage-radar-section"
        id="radar"
        aria-labelledby="homepage-radar-title"
      >
        <div className="content-block wide homepage-radar-block">
          <div className="homepage-radar-intro">
            <div>
              <p className="section-kicker">CTRL+LOVE RADAR</p>
              <h2 id="homepage-radar-title">Before the Room, there is Radar.</h2>
            </div>
            <div className="homepage-radar-copy">
              <p>
                Not every important question begins as a brief.
              </p>
              <p>
                Sometimes it begins as a small observation from Amsterdam, São
                Paulo, Cape Town or Tokyo. A contradiction. A local habit.
                Something that changed before the dashboard noticed.
              </p>
              <p>
                Radar makes those signals visible before they become obvious.
              </p>
              <div className="homepage-radar-actions">
                <Link className="home-hero-cta" href="/radar/">
                  Explore Radar {"->"}
                </Link>
                <Link className="home-hero-secondary" href="/radar/#submit-signal">
                  Send a signal
                </Link>
              </div>
            </div>
          </div>

          <div className="homepage-radar-preview" aria-labelledby="homepage-live-radar-title">
            <div className="homepage-radar-preview-heading">
              <p className="section-kicker">
                {radarPreview.source === "live" ? "LIVE RADAR" : "RADAR PREVIEW"}
              </p>
              <h3 id="homepage-live-radar-title">
                What the network is learning to notice.
              </h3>
            </div>

            <div
              className="homepage-radar-grid"
              data-source={radarPreview.source}
              aria-label={
                radarPreview.source === "live"
                  ? "Public Radar signals"
                  : "Editorial Radar examples"
              }
            >
              {radarPreview.signals.map((signal) => (
                <article className="homepage-radar-card" key={`${signal.location}-${signal.signal}`}>
                  <div className="homepage-radar-card-meta">
                    <span>{signal.location}</span>
                    <span>{signal.type}</span>
                  </div>
                  <p>{signal.signal}</p>
                  <div className="homepage-radar-card-footer">
                    {signal.confidence ? <span>{signal.confidence} confidence</span> : null}
                    {signal.source ? <span>{signal.source}</span> : null}
                  </div>
                </article>
              ))}
            </div>

            <Link className="text-link homepage-radar-link" href="/radar/">
              View all signals {"->"}
            </Link>
          </div>

          <div className="homepage-radar-bridge" aria-label="From signal to decision">
            <p className="section-kicker">FROM SIGNAL TO DECISION</p>
            <p>
              When a signal is strong enough, it becomes a question worth
              putting in a Room.
            </p>
          </div>
        </div>
      </section>

      <section
        className="content-section ruled chapter-room-section"
        id="the-room"
        tabIndex={-1}
        aria-labelledby="first-room-title"
      >
        <div className="content-block chapter-room-block">
          <div
            className="room-status sequence-reveal sequence-room-status"
            aria-label="Room status"
          >
            <span>ROOM STATUS</span>
            <strong>Decision entering. Humans summoned.</strong>
          </div>

          <article className="chapter-decision-card sequence-reveal sequence-decision-card">
            <div className="decision-card-header">
              <p>Decision 014</p>
              <span>Initial confidence 82%</span>
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
                <dt>Visible pressure</dt>
                <dd>Board momentum. Competitor entry. Partner enthusiasm.</dd>
              </div>
              <div>
                <dt>Uninvited reality</dt>
                <dd>Retention, regional difference, reversibility.</dd>
              </div>
            </dl>
          </article>

          <div className="room-theatre" aria-label="Live Room sequence">
            <div className="decision-journey" aria-label="Decision journey">
              {decisionJourney.map((step, index) => (
                <div className="decision-journey-step" key={step.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p>{step.label}</p>
                    <strong>{step.value}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="room-entry-list">
              {roomEntries.map((entry) => (
                <article
                  className={`room-entry sequence-reveal ${entry.sequenceClass}`}
                  key={entry.participant}
                >
                  <div>
                    <p>{entry.label}</p>
                    <h3>{entry.participant}</h3>
                    <span>{entry.role}</span>
                  </div>
                  <div className="room-entry-contribution">
                    <strong>{entry.title}</strong>
                    <p>{entry.observation}</p>
                    <span>{entry.interruption}</span>
                  </div>
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
                  <em>{entry.verdict}</em>
                </article>
              ))}
            </div>
          </div>

          <div
            className="room-changed-mind sequence-reveal sequence-changed-mind"
            id="room-changed-question"
            role="status"
            tabIndex={-1}
          >
            <p>The Room has changed the question.</p>
          </div>

          <div className="reframed-question sequence-reveal sequence-reframed-question">
            <dl>
              <div>
                <dt>Original question</dt>
                <dd>Should we expand into Brazil next quarter?</dd>
              </div>
              <div>
                <dt>Reframed question</dt>
                <dd>What must become true before expansion is responsible?</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section
        className="content-section ruled room-afterword-section"
        aria-labelledby="after-room-title"
      >
        <div className="content-block afterword-block">
          <p className="section-kicker">What happened</p>
          <h2 id="after-room-title">Reality entered. Confidence moved.</h2>
          <p>
            The Room turned a yes/no launch question into a testable
            responsibility.
          </p>
        </div>
      </section>

      <section
        className="content-section ruled personas-section"
        id="personas"
        aria-labelledby="personas-title"
      >
        <div className="content-block wide personas-block">
          <div className="personas-heading">
            <p className="section-kicker">Synthetic personas</p>
            <h2 id="personas-title">
              The synthetic minds inside the Room.
            </h2>
            <p>
              Always inside the Room. Never asleep. Each one represents a
              specialised way of thinking, not a human member of the network.
            </p>
          </div>
          <div className="persona-grid">
            {personas.map((persona, index) => (
              <Link
                className="persona-card"
                href={`/room/${persona.id}/`}
                key={persona.name}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div
                  className={`persona-portrait${
                    persona.portrait ? "" : " persona-portrait-silhouette"
                  }`}
                  aria-hidden="true"
                >
                  {persona.portrait ? (
                    <Image
                      src={persona.portrait}
                      alt=""
                      fill
                      sizes="(max-width: 680px) 58vw, (max-width: 1100px) 24vw, 13vw"
                    />
                  ) : (
                    <span className="persona-silhouette" />
                  )}
                </div>
                <h3>{persona.name}</h3>
                <p>{persona.role}</p>
                <blockquote>{persona.line}</blockquote>
                <dl>
                  <div>
                    <dt>Function</dt>
                    <dd>{persona.contribution ?? persona.line}</dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-section ruled products-section"
        id="products"
        aria-labelledby="products-title"
      >
        <div className="content-block wide products-block">
          <div className="products-heading">
            <p className="section-kicker">Products</p>
            <h2 id="products-title">Three ways to engage the Room.</h2>
            <p>
              The product architecture is deliberately narrow: one urgent
              decision, an ongoing executive room, or a verdict on whether to
              kill or scale.
            </p>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <Link className="product-card" href={product.href} key={product.name}>
                <span>{product.object}</span>
                <h3>{product.name}</h3>
                <dl>
                  <div>
                    <dt>What it is</dt>
                    <dd>{product.what}</dd>
                  </div>
                  <div>
                    <dt>When you need it</dt>
                    <dd>{product.when}</dd>
                  </div>
                  <div>
                    <dt>What you receive</dt>
                    <dd>{product.receive}</dd>
                  </div>
                  <div>
                    <dt>What changes</dt>
                    <dd>{product.outcome}</dd>
                  </div>
                  <div>
                    <dt>Starting point</dt>
                    <dd>{product.startingPoint}</dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-section ruled engagement-section"
        aria-labelledby="engagement-title"
      >
        <div className="content-block wide engagement-block">
          <div className="engagement-heading">
            <p className="section-kicker">Engagements</p>
            <h2 id="engagement-title">Commercial clarity, institutional form.</h2>
            <p>
              Clients pay for pressure before commitment: a serious room,
              selected perspectives, a written record and a sharper decision.
            </p>
          </div>

          <div className="engagement-list">
            {engagementOptions.map((option) => (
              <article className="engagement-item" key={option.name}>
                <h3>{option.name}</h3>
                <p>{option.purpose}</p>
                <strong>{option.terms}</strong>
              </article>
            ))}
          </div>

          <p className="engagement-note">
            No dashboards. No generic workshop theatre. Every engagement ends
            with a documented Decision Record.
          </p>
        </div>
      </section>

      <section
        className="content-section ruled cases-section"
        id="cases"
        aria-labelledby="cases-title"
      >
        <div className="content-block wide cases-block">
          <div className="cases-heading">
            <p className="section-kicker">Selected Decisions</p>
            <h2 id="cases-title">
              Real decisions improved. Names withheld. Lessons intact.
            </h2>
            <aside className="human-proof-note">
              The visible issue was performance. The deeper issue was that
              people wanted their lives back.
            </aside>
          </div>
          <div className="case-ledger">
            {caseStudies.map((study, index) => (
              <article className="case-row" key={study.question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>Anonymised project</p>
                  <small>{study.sector}</small>
                </div>
                <div>
                  <strong>Decision question</strong>
                  <h3>{study.question}</h3>
                </div>
                <div>
                  <strong>Hidden tension</strong>
                  <p>{study.blindSpot}</p>
                </div>
                <div>
                  <strong>Room outcome</strong>
                  <p>{study.outcome}</p>
                  <em>{study.sentence}</em>
                </div>
              </article>
            ))}
          </div>
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
        className="content-section ruled ambassador-network-section"
        id="network"
        aria-labelledby="network-title"
      >
        <div className="content-block wide network-block">
          <div className="network-heading">
            <p className="section-kicker">Human Network</p>
            <h2 id="network-title">
              A growing intelligence network for decisions that cross reality.
            </h2>
            <p>
              Ambassadors are a trusted international council: cultural,
              creative and strategic specialists who bring lived market context
              into decisions that cannot be solved from one room alone.
            </p>
          </div>

          <div className="network-map">
            <div className="network-metrics" aria-label="Network metrics">
              <div>
                <strong>{humanAmbassadors.length}</strong>
                <span>people</span>
              </div>
              <div>
                <strong>{countries.length}</strong>
                <span>countries</span>
              </div>
              <div>
                <strong>{cities.length}</strong>
                <span>cities</span>
              </div>
            </div>

            <div className="ambassador-face-grid" aria-label="Ambassador network preview">
              {networkPreview.map((ambassador) => (
                <Link
                  className="ambassador-face"
                  href="/ambassadors/"
                  key={ambassador.id}
                >
                  {ambassador.image ? (
                    <Image
                      src={ambassador.image}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 28vw"
                    />
                  ) : (
                    <span>{ambassador.name.slice(0, 1)}</span>
                  )}
                  <div>
                    <strong>{ambassador.preferredName ?? ambassador.name}</strong>
                    <small>
                      Creative Ambassador / {ambassador.city}, {ambassador.country}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="specialisation-ribbon" aria-label="Network specialisations">
            {networkSpecialisations.map((specialisation) => (
              <span key={specialisation}>{specialisation}</span>
            ))}
          </div>
        </div>
      </section>

      <section
        className="content-section ruled founders-section"
        id="founder"
        aria-labelledby="founders-title"
      >
        <div className="content-block wide founders-block">
          <div className="founders-manifesto">
            <p className="section-kicker">Founder</p>
            <h2 id="founders-title">
              Built for the moment before certainty becomes expensive.
            </h2>
            <p>
              ctrl+love is most useful before consensus hardens, before the
              wrong question becomes expensive and before leadership mistakes
              more information for clarity.
            </p>
          </div>
          <div className="founder-grid">
            <article className="founder-card">
              <Image
                src={founder.image}
                alt=""
                width={520}
                height={650}
                sizes="(max-width: 680px) 100vw, 13rem"
              />
              <div>
                <p>{founder.role}</p>
                <h3>{founder.name}</h3>
                <span>{founder.note}</span>
                {founderProfile ? (
                  <section
                    className="founder-biography"
                    aria-label="Founder biography"
                  >
                    {founderProfile.biography.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ) : null}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="content-section ruled decision-artifact-section"
        aria-labelledby="artifact-title"
      >
        <div className="content-block artifact-block">
          <div className="artifact-heading">
            <p className="section-kicker">Decision Record</p>
            <h2 id="artifact-title">Decision 014 / Reality Contact Record</h2>
          </div>

          <article className="decision-artifact" aria-label="Decision Record 014">
            <div className="artifact-topline">
              <span>ctrl+love</span>
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
            Read Article I {"->"}
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
            Bring us a decision
          </Link>
          <div className="living-institution" aria-label="Currently inside the Room">
            <p>CURRENTLY INSIDE THE ROOM</p>
            <dl>
              <div>
                <dt>17</dt>
                <dd>active decisions</dd>
              </div>
              <div>
                <dt>{countries.length}</dt>
                <dd>countries represented</dd>
              </div>
              <div>
                <dt>{availablePerspectives}</dt>
                <dd>perspectives available</dd>
              </div>
            </dl>
            <span>Decision 015 entering. Reality still pending.</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-copy">
          <p>ctrl+love</p>
          <p>
            <Link href="/room/">The Room</Link>
          </p>
          <p>
            <Link href="/radar/">Radar</Link>
          </p>
          <p>
            <Link href="/museum/">The Museum</Link>
          </p>
          <p>
            <Link href="/artifacts/">Artifacts</Link>
          </p>
          <p>
            <Link href="/room-runner/">Room Runner</Link>
          </p>
          <p>
            <Link href="/ambassadors/">Ambassadors</Link>
          </p>
          <p>
            <Link href="/constitution/">The Constitution</Link>
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
