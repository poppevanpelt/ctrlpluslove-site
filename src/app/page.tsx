import Image from "next/image";
import Link from "next/link";

import { EarthriseMoment } from "./earthrise-moment";
import { allRoomPersonas } from "./room-personas-data";
import styles from "./home-2026.module.css";

const recentInstruments = [
  {
    no: "024",
    name: "BRAND SURVIVAL",
    state: "READING 001",
    line: "How much can we take away before it stops being you?",
    href: "/brand-survival/",
    readout: ["REMOVE", "RECOGNISE", "SURVIVE"],
  },
  {
    no: "023",
    name: "CTRL+CHASE",
    state: "PROTOTYPE",
    line: "A question either produces evidence or earns its death.",
    href: "/chase/",
    readout: ["QUESTION", "EVIDENCE", "STOP"],
  },
  {
    no: "022",
    name: "MARIA EXCAVATION",
    state: "ONGOING",
    line: "Map how a decision travels, not only where it ends.",
    href: "/maria/",
    readout: ["TERRAIN", "TRAJECTORY", "MOVE"],
  },
  {
    no: "020",
    name: "PURGE",
    state: "PROTOTYPE",
    line: "Cut the fat. Keep the organ.",
    href: "/purge/",
    readout: ["CUT", "TEST", "KEEP"],
  },
  {
    no: "004",
    name: "DECISION MEMORY",
    state: "PROTOTYPE",
    line: "A forgotten decision must win its argument again.",
    href: "/decision-memory/",
    readout: ["ASSUMPTION", "OPPOSITION", "MEMORY"],
  },
  {
    no: "001",
    name: "DECISION COLLIDER",
    state: "WORKING",
    line: "Collide assumptions before people collide.",
    href: "/decision-collider/",
    readout: ["FRAME", "COLLIDE", "DECIDE"],
  },
] as const;

const homepagePersonaIds = [
  "nick-deckman",
  "johan-cruyff",
  "the-customer",
  "wade-ellison",
] as const;

const homepagePersonas = homepagePersonaIds
  .map((id) => allRoomPersonas.find((persona) => persona.id === id))
  .filter((persona): persona is NonNullable<typeof persona> => Boolean(persona));

const personaGenealogies: Record<
  string,
  { status: string; sources?: Array<{ name: string; share: number }> }
> = {
  "nick-deckman": {
    status: "DESCENDS FROM",
    sources: [
      { name: "SIMON NEEFJES", share: 60 },
      { name: "ERIK KELLERHUIS", share: 30 },
      { name: "MAXIME HARTMAN", share: 10 },
    ],
  },
  "johan-cruyff": { status: "ANCESTRY UNRESOLVED · LINE LEFT OPEN" },
  "the-customer": { status: "ANCESTRY UNRESOLVED · LINE LEFT OPEN" },
  "wade-ellison": { status: "ANCESTRY UNRESOLVED · LINE LEFT OPEN" },
};

const clientSystems = [
  {
    client: "COMFORA",
    category: "MOBILITY / INDEPENDENCE",
    title: "Nobody wanted a comfy chair. They wanted their lives back.",
    description:
      "A product brief reframed around freedom, dignity and the life beyond the furniture, then carried into creative and production experiments.",
    system: "CATEGORY REFRAME / CREATIVE TESTING",
    diagram: "comfora",
  },
  {
    client: "SUKI",
    category: "RITUAL / GROWTH",
    title: "Don’t franchise the store. Franchise what makes people return.",
    description:
      "A matcha brand became a live sensing system: store signals, creator intelligence, small ritual experiments and memory for the next Suki.",
    system: "RITUAL INTELLIGENCE / LIVING FRANCHISE OS",
    diagram: "suki",
  },
] as const;

const fieldNotes = [
  {
    stamp: "FIELD NOTE 017",
    title: "THE TABLE WAS ALREADY NOT LEVEL.",
    copy: "The steel ball did not need a presentation. Reality moved it first.",
  },
  {
    stamp: "FIELD NOTE 014",
    title: "A QUESTION THAT REFUSED TO BECOME A SCORE.",
    copy: "Brand Survival became a curve because subtraction told us more than ranking did.",
  },
  {
    stamp: "FIELD NOTE 011",
    title: "THE ROOM CHANGED BEFORE THE MINUTES DID.",
    copy: "Challenge, ownership and rupture move long before a meeting summary notices.",
  },
] as const;

const pressNotes = [
  {
    outlet: "FRANK.NEWS",
    date: "08 SEP 2026",
    title: "Poppe van Pelt: ‘Smaak wordt alleen maar belangrijker’",
    href: "https://www.frank.news/poppe-van-pelt-smaak-wordt-alleen-maar-belangrijker/",
  },
  {
    outlet: "FONK",
    date: "25 AUG 2026",
    title: "Poppe van Pelt lanceert ‘per ongeluk’ nieuw bedrijf Ctrl+Live",
    href: "https://fonkmagazine.com/artikelen/tech/poppe-van-pelt-lanceert-per-ongeluk-nieuw-bedrijf-ctrl-live-77582.html",
  },
  {
    outlet: "BRIGHT",
    date: "24 AUG 2026",
    title: "Strenge AI als ultiem hulpmiddel voor betere (en leukere?) reclame",
    href: "https://www.bright.nl/nieuws/2126819/deze-ai-zegt-als-je-reclame-idee-gewoon-slecht-is.html",
  },
] as const;

// NETLIFY PRODUCTION NUDGE 2026-09-18 POST-CREDITS
export default function Home() {
  return (
    <main className={styles.page} id="main-content">
      <section className={styles.hero} aria-labelledby="home-title">
        <Image
          className={styles.heroImage}
          src="/home/sunnyvale-campus.webp"
          alt="A sunlit California research campus with palms and a steel calibration sphere"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroVeil} aria-hidden="true" />
        <div className={styles.heroTopline}>
          <Link href="/" className={styles.brand}>ctrl+love</Link>
          <span>INSTITUTE FOR DECISION RESEARCH</span>
          <span>HAARLEM · NL</span>
        </div>

        <div className={styles.heroBody}>
          <p className={styles.kicker}>SUNNYVALE ANNEX / PROPOSITIONAL FACILITY</p>
          <h1 id="home-title">WE BUILD<br />INSTRUMENTS<br />FOR HUMAN<br />JUDGMENT.</h1>
          <p className={styles.heroLead}>
            AI can generate more answers than we will ever need.<br />
            The interesting problem is knowing what deserves to be believed.
            <span className={styles.heroPlain}>
              We use AI, human opposition and working instruments to pressure-test important decisions before they become expensive.
            </span>
          </p>
        </div>

        <div className={styles.heroStatus}>
          <span>FACTORY STATUS</span>
          <strong>024 instruments</strong>
          <span>ALL SYSTEMS CURIOUS</span>
          <Link href="/instruments/">ENTER INSTRUMENT ROOM ↗</Link>
        </div>

        <div className={styles.calibration} aria-hidden="true">
          <Image
            src="/museum/steel-ball-packshot-cutout.png"
            alt=""
            width={156}
            height={156}
            priority
          />
          <span>CALIBRATION MASS · 40.00 MM</span>
        </div>
      </section>

      <section className={styles.missionStrip} aria-label="Mission status">
        <span>MISSION 2026.260</span>
        <strong>REALITY HAS CLEARED THE TOWER.</strong>
        <span>HUMAN OVERRIDE · ARMED</span>
        <span>CALIFORNIA / HAARLEM</span>
      </section>

      <section className={styles.nodes} aria-labelledby="nodes-title">
        <div className={styles.sectionLabel}>
          <span>CTRL+LOVE HUMAN NODES</span>
          <span>REAL PEOPLE / SPECULATIVE BUILDINGS</span>
        </div>
        <div className={styles.nodesIntro}>
          <h2 id="nodes-title">THE NETWORK<br />HAS AN ADDRESS.<br /><em>SORT OF.</em></h2>
          <div className={styles.provenanceCopy}>
            <p>
              A global network of highly skilled creatives, originally selected by Apple.
              Poppe spent eight years working with them, roughly three months a year in the same rooms.
            </p>
            <strong>ORGANIC RELATIONSHIPS. NOT BOUGHT BY THE KILO FROM META.</strong>
            <span className={styles.metaFootnote}>@meta</span>
            <p className={styles.provenanceNote}>
              Tokyo and Bloemendaal are real positions in the ctrl+love network.
              The people are real. The buildings are architectural propositions.
            </p>
          </div>
        </div>

        <div className={styles.nodeGrid}>
          <article className={styles.node}>
            <Image
              className={styles.nodeImage}
              src="https://images.unsplash.com/photo-1532236395709-7d70320fec2d?auto=format&fit=crop&w=1800&q=84"
              alt="Central Tokyo at night"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <div className={styles.nodeVeil} aria-hidden="true" />
            <div className={styles.nodeTopline}>
              <span>ACTIVE HUMAN SIGNAL</span>
              <span>ARCHITECTURE / SPECULATIVE</span>
            </div>
            <div className={styles.nodeOperator}>
              <Image
                src="/ambassadors/portraits/003-shun-iwai-portrait-live-20260712.jpeg"
                alt="Shun Iwai"
                width={88}
                height={88}
              />
              <span>SHUN IWAI<br />AMBASSADOR / CULTURAL TRANSLATION</span>
            </div>
            <div className={styles.nodeCopy}>
              <p>TOKYO · JP / LISTENING POST</p>
              <h3>CTRL+LOVE<br />TOKYO</h3>
              <Link href="/embassies/tokyo/">ENTER THE REAL HUMAN NODE ↗</Link>
            </div>
          </article>

          <article className={`${styles.node} ${styles.founderNode}`}>
            <Image
              className={styles.nodeImage}
              src="https://images.unsplash.com/photo-1769886250520-ce0f9abbcc9d?auto=format&fit=crop&fm=jpg&q=84&w=2200"
              alt="A modern house nested into Dutch coastal dunes, used as an architectural proposition for the Bloemendaal node"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <div className={styles.nodeVeil} aria-hidden="true" />
            <div className={styles.nodeTopline}>
              <span>FOUNDER / LIVE</span>
              <span>DUNE LAB / PROPOSITION</span>
            </div>
            <div className={`${styles.nodeOperator} ${styles.founderOperator}`}>
              <Image
                src="/ambassadors/portraits/001-poppe-van-pelt-portrait-live-20260715.png"
                alt="Poppe van Pelt"
                width={112}
                height={112}
              />
              <span>POPPE VAN PELT<br />FOUNDER / APPLIED AI DECISION SYSTEMS</span>
            </div>
            <div className={styles.nodeCopy}>
              <p>BLOEMENDAAL · NL / DUNE POSITION</p>
              <h3>CTRL+LOVE<br /><span className={styles.nodePlaceName}>BLOEMENDAAL</span></h3>
              <span>OPERATING FROM THE DUNES. RENOVATION SUBSIDY APPLICATION PENDING.</span>
            </div>
          </article>
        </div>
        <p className={styles.nodeFootnote}>
          HUMAN NODES ARE OPERATIONAL. BUILDINGS SHOWN ARE VISUAL PROPOSITIONS, NOT PROPERTY CLAIMS.
        </p>
      </section>

      <section className={styles.reading} aria-labelledby="reading-title">
        <div className={styles.sectionLabel}>
          <span>CURRENT READING</span>
          <span>INSTRUMENT 024</span>
        </div>

        <div className={styles.readingGrid}>
          <div className={styles.readingCopy}>
            <p className={styles.kicker}>READING 001</p>
            <h2 id="reading-title">BRAND<br />/ WALLPAPER</h2>
            <p>
              What survives when you remove the logo, language and familiar tricks?
            </p>
            <Link href="/brand-survival/">VIEW THE READING ↗</Link>
          </div>

          <div className={styles.curve} aria-label="Illustrative Brand Survival reading, not observed data">
            <div className={styles.curveContext}>
              <strong>HOW MUCH CAN YOU REMOVE BEFORE PEOPLE STOP RECOGNISING THE BRAND?</strong>
              <span>BRAND survives subtraction. WALLPAPER disappears with it.</span>
            </div>
            <div className={styles.curveAxisY}>RECOGNITION</div>
            <div className={styles.curvePlot}>
              <span className={styles.curveBrand} />
              <span className={styles.curveWallpaper} />
              <span className={styles.curveMarkOne}>BRAND</span>
              <span className={styles.curveMarkTwo}>WALLPAPER</span>
            </div>
            <div className={styles.curveAxisX}>MORE REMOVED →</div>
            <p className={styles.curveNote}>Illustrative reading. No reference curve.</p>
          </div>
        </div>
      </section>

      <section className={styles.clientWork} aria-labelledby="client-work-title">
        <div className={styles.sectionLabel}>
          <span>FIELD APPLICATIONS</span>
          <span>REAL CLIENT SYSTEMS / 002</span>
        </div>
        <div className={styles.clientWorkIntro}>
          <h2 id="client-work-title">THE INSTRUMENTS<br />HAVE LEFT<br />THE LAB.</h2>
          <p>Two live examples of the same habit: find the thing underneath the brief, then build something that can keep learning.</p>
        </div>
        <div className={styles.clientGrid}>
          {clientSystems.map((client) => (
            <article className={styles.clientCase} key={client.client}>
              <div className={styles.clientMeta}>
                <strong>{client.client}</strong>
                <span>{client.category}</span>
              </div>
              <div className={`${styles.clientDiagram} ${styles[client.diagram]}`} aria-hidden="true">
                {client.diagram === "comfora" ? (
                  <>
                    <span>CHAIR</span><i>→</i><span>COMFORT</span><i>→</i><strong>LIFE</strong>
                  </>
                ) : (
                  <>
                    <span>STORE SIGNALS</span><span>CREATOR SENSING</span><span>EXPERIMENT</span><strong>MEMORY</strong>
                  </>
                )}
              </div>
              <div className={styles.clientBody}>
                <p className={styles.clientSystem}>{client.system}</p>
                <h3>{client.title}</h3>
                <p>{client.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.institute} aria-labelledby="institute-title">
        <Image
          className={styles.controlRoomImage}
          src="/home/judgment-control-room.webp"
          alt="An optimistic analog control room where people examine a polished steel sphere"
          fill
          sizes="100vw"
        />
        <div className={styles.controlRoomVeil} aria-hidden="true" />
        <div className={styles.instituteStatement}>
          <p className={styles.kicker}>THE LARGER QUESTION</p>
          <h2 id="institute-title">INTELLIGENCE<br />IS GETTING<br />CHEAPER.<br /><em>JUDGMENT ISN&apos;T.</em></h2>
        </div>

        <div className={styles.instituteCopy}>
          <p>
            ctrl+love studies what still happens between information and action:
            belief, hesitation, conflict, culture, memory, power, instinct and opposition.
          </p>
          <p>
            The work sits somewhere between a lab, a creative practice and a small
            institution that keeps building things to test what it thinks it knows.
          </p>
          <p className={styles.transmission}>TRANSMISSION: THE FUTURE REMAINS A HUMAN DECISION.</p>
          <div className={styles.instituteLinks}>
            <Link href="/constitution/">INSTITUTE FOR DECISION RESEARCH ↗</Link>
            <Link href="/maria/">MARIA EXCAVATION ↗</Link>
            <Link href="/organic-ai/">ORGANIC AI ↗</Link>
          </div>
        </div>
      </section>

      <section className={styles.science} aria-labelledby="science-title">
        <div className={styles.sectionLabel}>
          <span>SCIENTIFIC PROVENANCE</span>
          <span>EVIDENCE BELOW / MYTH BESIDE IT</span>
        </div>

        <div className={styles.scienceIntro}>
          <div>
            <p className={styles.kicker}>THE SERIOUS LAYER</p>
            <h2 id="science-title">WE DIDN&apos;T<br />MAKE ALL OF<br />THIS UP.</h2>
          </div>
          <p>
            The instruments borrow from established work on judgment under uncertainty,
            dissent, psychological safety and naturalistic decision-making. Sources stay
            visible so a useful idea never has to pretend it arrived by magic.
          </p>
        </div>

        <div className={styles.scienceGrid}>
          <a
            className={styles.scienceSource}
            href="https://doi.org/10.1126/science.185.4157.1124"
            target="_blank"
            rel="noreferrer"
          >
            <span>01 / JUDGMENT UNDER UNCERTAINTY</span>
            <strong>TVERSKY + KAHNEMAN · 1974</strong>
            <p>Heuristics, uncertainty, anchoring and the predictable ways judgment can drift.</p>
            <small>SCIENCE · PRIMARY SOURCE ↗</small>
          </a>

          <a
            className={styles.scienceSource}
            href="https://doi.org/10.1111/j.1559-1816.1987.tb00339.x"
            target="_blank"
            rel="noreferrer"
          >
            <span>02 / DISSENT</span>
            <strong>CHARLAN NEMETH · 1987</strong>
            <p>Minority disagreement can widen the search space instead of merely slowing agreement.</p>
            <small>JOURNAL OF APPLIED SOCIAL PSYCHOLOGY ↗</small>
          </a>

          <a
            className={styles.scienceSource}
            href="https://doi.org/10.2307/2666999"
            target="_blank"
            rel="noreferrer"
          >
            <span>03 / PSYCHOLOGICAL SAFETY</span>
            <strong>AMY EDMONDSON · 1999</strong>
            <p>Teams learn differently when interpersonal risk can be taken without social punishment.</p>
            <small>ADMINISTRATIVE SCIENCE QUARTERLY ↗</small>
          </a>

          <a
            className={styles.scienceSource}
            href="https://mitpress.mit.edu/9780262260862/sources-of-power/"
            target="_blank"
            rel="noreferrer"
          >
            <span>04 / NATURALISTIC DECISION-MAKING</span>
            <strong>GARY KLEIN · 1998</strong>
            <p>Experienced judgment is shaped in real conditions: time pressure, stakes, pattern recognition and action.</p>
            <small>MIT PRESS · SOURCES OF POWER ↗</small>
          </a>

          <aside className={styles.originSpecimen}>
            <span>ORIGIN SPECIMEN 000 / APOCRYPHAL / NOT EVIDENCE</span>
            <strong>PROF. DR. H. VON SCHMAALHAUZEN</strong>
            <p>
              Allegedly had the original eureka moment while passing Harvard on a bicycle,
              after noticing that a room can agree perfectly and still be wrong.
            </p>
            <small>PROVENANCE: UNVERIFIED · RETAINED FOR SCIENTIFIC MORALE</small>
          </aside>
        </div>
      </section>

      <section className={styles.field} aria-labelledby="field-title">
        <Image
          className={styles.fieldImage}
          src="/home/sunnyvale-campus.webp"
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.fieldVeil} aria-hidden="true" />
        <div className={styles.sectionLabel}>
          <span>FIELD NOTES</span>
          <span>REALITY, BEFORE THE FRAMEWORK</span>
        </div>
        <div className={styles.fieldIntro}>
          <h2 id="field-title">THE SMALL<br />THINGS ARE<br />USUALLY THE<br />EVIDENCE.</h2>
        </div>
        <div className={styles.notes}>
          {fieldNotes.map((note) => (
            <article className={styles.note} key={note.stamp}>
              <span>{note.stamp}</span>
              <h3>{note.title}</h3>
              <p>{note.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.factory} aria-labelledby="factory-title">
        <div className={styles.sectionLabel}>
          <span>THE FACTORY / WORKING DOORS</span>
          <Link href="/instruments/">ALL 024 INSTRUMENTS ↗</Link>
        </div>
        <div className={styles.factoryIntro}>
          <h2 id="factory-title">RECENTLY<br />BUILT.</h2>
          <p>Not case-study wallpaper. Six instruments you can open, inspect and run.</p>
        </div>

        <div className={styles.instrumentGrid}>
          {recentInstruments.map((instrument) => (
            <Link href={instrument.href} className={styles.instrument} key={instrument.no}>
              <div className={styles.instrumentMeta}>
                <span>{instrument.no}</span>
                <span>{instrument.state}</span>
              </div>
              <div className={styles.instrumentReadout} aria-hidden="true">
                {instrument.readout.map((step, index) => (
                  <span key={step}><i>{String(index + 1).padStart(2, "0")}</i>{step}</span>
                ))}
              </div>
              <h3>{instrument.name}</h3>
              <p>{instrument.line}</p>
              <span className={styles.instrumentOpen}>RUN INSTRUMENT ↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.shoppe} aria-labelledby="shoppe-title">
        <div className={styles.sectionLabel}>
          <span>POPPE’S PROMPT SHOPPE</span>
          <span>WORKING BENCH / PHYSICAL OBJECTS</span>
        </div>
        <div className={styles.shoppeGrid}>
          <div className={styles.shoppeCopy}>
            <p className={styles.kicker}>SAN GREGORIO / CALIFORNIA</p>
            <h2 id="shoppe-title">BRING IN<br />YOUR OLD<br />PROMPTS.</h2>
            <p>Put one under load. Extract what it smuggles in. Find the decision it is actually trying to make.</p>
            <Link href="/prompt-shoppe/">OPEN THE SHOPPE ↗</Link>
          </div>
          <div className={styles.shoppeVisuals}>
            <Link className={styles.shoppeFacade} href="/prompt-shoppe/">
              <Image src="/shoppe/poppes-prompt-shoppe.webp" alt="Poppe’s Prompt Shoppe in a wooded California setting" fill sizes="(max-width: 900px) 100vw, 58vw" />
              <span>THE SHOPPE / OPEN ↗</span>
            </Link>
            <article className={styles.shoppeObject}>
              <Image src="/instruments/objects/ten-decisions-usb.webp" alt="The ctrl+love Decision Stick in its sleeve" fill sizes="(max-width: 900px) 50vw, 29vw" />
              <span>DECISION STICK · 001/100</span>
            </article>
            <article className={styles.shoppeObject}>
              <Image src="/instruments/objects/decision-in-a-box.webp" alt="Decision in a Box with five metal forms and decision cards" fill sizes="(max-width: 900px) 50vw, 29vw" />
              <span>DECISION IN A BOX · 5 CARDS / 1 DECISION</span>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.personas} aria-labelledby="personas-title">
        <div className={styles.sectionLabel}>
          <span>SYNTHETIC PERSONAS</span>
          <Link href="/room/">ENTER THE ROOM ↗</Link>
        </div>
        <div className={styles.personaIntro}>
          <h2 id="personas-title">THE ROOM<br />IS NOT EMPTY.</h2>
          <div className={styles.provenanceCopy}>
            <p>
              65+ perspectives, compounded from 30 years of personal attendance and observation.
              Built from people, rooms, patterns, arguments and oddities actually encountered.
            </p>
            <strong>NOT INVENTED FROM DEMOGRAPHIC TEMPLATES.</strong>
            <p className={styles.provenanceNote}>
              Built perspectives with jobs to do, not decorative avatars.
            </p>
          </div>
        </div>
        <div className={styles.personaGrid}>
          {homepagePersonas.map((persona, index) => {
            const genealogy = personaGenealogies[persona.id] ?? {
              status: "ANCESTRY UNRESOLVED · LINE LEFT OPEN",
            };

            return (
              <article className={styles.personaCard} key={persona.id}>
                <div className={styles.personaSpecimenTopline}>
                  <span>SPECIMEN {String(index + 1).padStart(2, "0")}</span>
                  <span>SYNTHETIC / ACTIVE</span>
                </div>
                <div className={`${styles.personaPortrait} ${styles.personaPortraitFallback}`}>
                  <span className={styles.personaFallbackIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{persona.name}</strong>
                  <span className={styles.personaSpecimenId}>ID · {persona.id.toUpperCase()}</span>
                </div>
                <div className={styles.personaIdentity}>
                  <h3>{persona.name}</h3>
                  <strong>{persona.role}</strong>
                  <p>{persona.line}</p>
                </div>
                <div className={styles.personaGenealogy}>
                  <span className={styles.genealogyLabel}>GENEALOGY / {genealogy.status}</span>
                  {genealogy.sources ? (
                    <div className={styles.genealogySources}>
                      {genealogy.sources.map((source) => (
                        <div className={styles.genealogySource} key={source.name}>
                          <div>
                            <span>{source.name}</span>
                            <strong>{source.share}%</strong>
                          </div>
                          <i aria-hidden="true">
                            <b style={{ width: `${source.share}%` }} />
                          </i>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.genealogyOpen}>NO CLAIM ENTERED. KEEP THE LINE OPEN.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.humans} aria-labelledby="humans-title">
        <Image
          className={styles.humansImage}
          src="/home/judgment-control-room.webp"
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.humansVeil} aria-hidden="true" />
        <div className={styles.sectionLabel}>
          <span>WHO IS OPERATING THE MACHINERY</span>
          <span>HUMAN-LED</span>
        </div>
        <div className={styles.humansGrid}>
          <div>
            <h2 id="humans-title">THREE DECADES<br />OF ADVERTISING.<br />8 YEARS APPLE.<br /><em>THEN THIS.</em></h2>
          </div>
          <div className={styles.humanCopy}>
            <p>
              Poppe van Pelt founded ctrl+love after decades spent making things clearer,
              sharper and more persuasive. The current obsession is different: building
              instruments for the moments when clarity itself needs to be tested.
            </p>
            <p>
              Around him: the guys, a distributed human network, synthetic minds,
              field collaborators, and one lorikeet with an implausibly senior title.
            </p>
            <div className={styles.humanLinks}>
              <Link href="/ambassadors/">AROUND THE TABLE ↗</Link>
              <Link href="/room/">THE ROOM ↗</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.press} aria-labelledby="press-title">
        <div className={styles.sectionLabel}>
          <span>OUTSIDE OBSERVATION</span>
          <span>PRESS / AUG—SEP 2026</span>
        </div>
        <div className={styles.pressIntro}>
          <h2 id="press-title">OTHER PEOPLE<br />LOOKED AT IT.<br /><em>THEY WROTE.</em></h2>
          <p>
            Three independent readings of the experiment: the thinking behind it,
            the machinery inside it, and the strange new rooms growing out of it.
          </p>
        </div>
        <div className={styles.pressGrid}>
          {pressNotes.map((item, index) => (
            <a
              className={styles.pressItem}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              key={item.outlet}
            >
              <span className={styles.pressNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.pressMeta}>
                <strong>{item.outlet}</strong>
                <span>{item.date}</span>
              </div>
              <h3>{item.title}</h3>
              <span className={styles.pressOpen}>READ ORIGINAL ↗</span>
            </a>
          ))}
        </div>
      </section>

      <EarthriseMoment />

      <section className={styles.exit} aria-labelledby="exit-title">
        <p className={styles.kicker}>OPEN DOOR</p>
        <h2 id="exit-title">BRING US SOMETHING<br />THAT REFUSES TO<br />BECOME CLEAR.</h2>
        <p>A decision. A belief. A brand. A room. A problem everyone thinks they understand.</p>
        <a href="mailto:poppevanpelt@gmail.com?subject=A%20decision%20that%20refuses%20to%20become%20clear">BRING US THE DECISION ↗</a>
        <div className={styles.exitFooter}>
          <span>ctrl+love · Haarlem · 2026</span>
          <span>Observe. Understand. Judge. Remain human.</span>
        </div>
      </section>
    </main>
  );
}
