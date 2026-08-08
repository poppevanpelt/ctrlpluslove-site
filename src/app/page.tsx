import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { confirmedAmbassadors } from "./ambassadors-data";
import { embassies } from "@/content/embassies";
import { CtrlLayerNote } from "./ctrl-layer-note";
import { DecisionColliderInstrument } from "./decision-collider/decision-collider-instrument";
import { GlobalMood } from "./global-mood";
import { getAmbassadorProfile } from "./ambassador-profiles-data";
import { HomeHero } from "./home-hero";
import { allRoomPersonas } from "./room-personas-data";
import { SteelBallPresence } from "./steel-ball-presence";
import { ThemeToggle } from "./theme-toggle";

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
    when: "When senior teams face recurring decisions and need a trusted outside Room on call.",
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
    client: "COMFORA",
    status: "disclosed",
    category: "Homecare",
    headline: ["Nobody wanted a comfy chair.", "They wanted their lives back."],
    supporting:
      "The brief entered as a product question. It left as a question about independence.",
    cta: "See what the Room surfaced",
    disclosed: true,
  },
  {
    client: "UNDISCLOSED",
    status: "confidential",
    category: "Global consumer brand",
    headline: [
      "They came in asking how to reach younger people.",
      "Age wasn’t the problem. Predictability was.",
    ],
    cta: "Client confidential",
    disclosed: false,
  },
  {
    client: "UNDISCLOSED",
    status: "confidential",
    category: "Organisation / transformation",
    headline: ["The inefficiency was there for a reason."],
    supporting:
      "What looked like resistance to change turned out to be people quietly protecting something the new system had forgotten.",
    cta: "Client confidential",
    disclosed: false,
  },
];

const founder = {
  name: "Poppe van Pelt",
  role: "Founder",
  image: "/ambassadors/portraits/001-poppe-van-pelt-portrait-live-20260715.png",
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

export default async function Home() {
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
      <a className="skip-link" href="#personas">
        Skip to main content
      </a>
      <ThemeToggle />

      <HomeHero />
      <GlobalMood />

      <section
        className="content-section homepage-positioning-section"
        aria-labelledby="homepage-positioning-title"
      >
        <div className="homepage-positioning-copy">
          <h2 id="homepage-positioning-title">
            A global network for better decisions.
          </h2>
          <p className="homepage-positioning-principle">Powered by reality.</p>
          <p className="homepage-positioning-explanation">
            AI reveals patterns. People decide what matters.
          </p>
          <a className="homepage-positioning-cta" href="#decision-collider">
            Try the Decision Collider
          </a>
        </div>
      </section>

      <section
        className="content-section decision-collider-home-section"
        id="decision-collider"
        aria-label="Decision Collider"
      >
        <DecisionColliderInstrument embedded />
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
                data-persona-id={persona.id}
                href={`/room/${persona.id}/`}
                key={persona.name}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div
                  className={`persona-portrait${
                    persona.portrait ? "" : " persona-portrait-silhouette"
                  }`}
                  aria-hidden="true"
                  style={{
                    "--portrait-position": persona.portraitPosition,
                  } as CSSProperties}
                >
                  {persona.portrait ? (
                    <Image
                      className="persona-portrait-frame"
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
                {index === 1 ? (
                  <CtrlLayerNote className="ctrl-layer-note-card">
                    MACHINE-ASSISTED, HUMAN-LED
                  </CtrlLayerNote>
                ) : null}
              </Link>
            ))}
          </div>
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
              Ambassadors form the wider room. Embassies are the permanent
              local signal: trusted creative leaders who help ideas arrive with
              cultural nuance, relationships and human judgment.
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
              <div>
                <strong>{embassies.length}</strong>
                <span>embassies</span>
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
                    <strong>{ambassador.name}</strong>
                    <small>
                      Creative Ambassador / {ambassador.city}, {ambassador.country}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link className="embassy-home-link" href="/embassies/">
            <span>Embassy Network</span>
            <strong>Ideas don’t scale. Trusted people do.</strong>
          </Link>

          <div className="specialisation-ribbon ctrl-layer-anchor" aria-label="Network specialisations">
            {networkSpecialisations.map((specialisation) => (
              <span key={specialisation}>{specialisation}</span>
            ))}
            <CtrlLayerNote className="ctrl-layer-note-left">
              EMOTIONAL INFRASTRUCTURE
            </CtrlLayerNote>
          </div>
        </div>
      </section>

      <section
        className="content-section decision-collider-closing-section"
        aria-labelledby="decision-collider-closing-title"
      >
        <h2 id="decision-collider-closing-title">
          Every important decision deserves the right room.
        </h2>
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
              Three entry points, each built around a decision that needs
              pressure before commitment.
            </p>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <Link className="product-card ctrl-layer-anchor" href={product.href} key={product.name}>
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
                {product.name === "Decision Stress-Test™" ? (
                  <CtrlLayerNote className="ctrl-layer-note-card">
                    BUILT WITH CURIOSITY
                  </CtrlLayerNote>
                ) : null}
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
              Every engagement creates pressure before commitment: selected
              perspectives, a written record and a sharper decision.
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
            <h2 id="cases-title">
              A few things that changed inside the Room.
            </h2>
          </div>
          <div className="case-ledger">
            {caseStudies.map((study) => (
              <article
                className={`case-story${study.disclosed ? " case-story-featured" : ""}`}
                key={`${study.client}-${study.category}`}
              >
                <div className="case-story-meta">
                  <strong>{study.client}</strong>
                  <span>{study.status}</span>
                  <span>{study.category}</span>
                </div>
                <div className="case-story-copy">
                  <h3>
                    {study.headline.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  {study.supporting ? <p>{study.supporting}</p> : null}
                  <small>{study.cta}</small>
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
            <h2 id="steel-ball-title" className="ctrl-layer-anchor">
              Confidence should feel heavy.
              <CtrlLayerNote className="ctrl-layer-note-right">
                VERSION 0.∞
              </CtrlLayerNote>
            </h2>
          </div>
          <SteelBallPresence />
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
            <h2 id="founders-title" className="ctrl-layer-anchor">
              Built for the moment before certainty becomes expensive.
              <CtrlLayerNote className="ctrl-layer-note-right">
                GOOD IDEAS KEEP STRANGE HOURS
              </CtrlLayerNote>
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
          <div
            className="living-institution"
            id="shared-office"
            aria-label="Shared office status"
          >
            <p>SHARED OFFICE STATUS</p>
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
              <div>
                <dt>01</dt>
                <dd>shared steel ball</dd>
              </div>
            </dl>
            <span>Decision 015 entering. The office still has the steel ball in view.</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-copy">
          <p>ctrl+love</p>
          <p>
            <Link href="/room/">The Room</Link>
          </p>
          <p>          </p>
          <p>
            <Link href="/museum/">Museum Store</Link>
          </p>
          <p>
            <Link href="/steel-ball/">The Steel Ball</Link>
          </p>
          <p>
            <Link href="/artifacts/">Artifacts</Link>
          </p>
          <p>          </p>
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
