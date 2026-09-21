import Image from "next/image";
import Link from "next/link";

import { EarthriseMoment } from "./earthrise-moment";
import { SoundtrackCue } from "./soundtrack-cue";
import { homepageRoomPersonas } from "./room-personas-data";
import styles from "./home-2026.module.css";

const recentInstruments = [
  { no: "001", name: "DECISION COLLIDER", state: "WORKING", line: "Collide assumptions before people collide.", href: "/decision-collider/" },
  { no: "002", name: "MEETING FILTER", state: "WORKING", line: "Decide whether the meeting should exist.", href: "/meeting-filter/" },
  { no: "003", name: "LIVING TICKER", state: "PROTOTYPE", line: "Minutes record words. The ticker records movement.", href: "/instruments/" },
  { no: "005", name: "CTRL+SWAT", state: "FIELD TEST", line: "Detect. Judge. Build. Dispatch before the moment disappears.", href: "/swat/" },
  { no: "007", name: "SIGNAL FIRE", state: "PROTOTYPE", line: "Weak signals before they become obvious opportunities.", href: "/instruments/" },
  { no: "008", name: "POLICY PRISM", state: "PROTOTYPE", line: "What happens after the policy meets behaviour?", href: "/instruments/" },
  { no: "013", name: "DO-NOTHING CONTROL", state: "WORKING", line: "Change has to beat reality left alone.", href: "/instruments/" },
  { no: "014", name: "OPPOSITION SEAT", state: "WORKING", line: "Pay someone to disagree.", href: "/instruments/" },
  { no: "016", name: "EVIDENCE TAGGER", state: "PROTOTYPE", line: "Observed is not the same as assumed.", href: "/instruments/" },
  { no: "020", name: "PURGE", state: "PROTOTYPE", line: "Cut the fat. Keep the organ.", href: "/purge/" },
  { no: "022", name: "MARIA EXCAVATION", state: "IN DEVELOPMENT", line: "Map how a decision travels, not only where it ends.", href: "/maria/" },
  { no: "024", name: "BRAND SURVIVAL", state: "PROTOTYPE", line: "How much can we take away before it stops being you?", href: "/brand-survival/" },
] as const;

const products = [
  {
    verb: "DECIDE.",
    name: "DECISION STRESS-TEST",
    label: "ONE IMPORTANT DECISION",
    line: "Put one important decision under pressure before reality does.",
    commercial: "FROM €4,500 · ONE DECISION",
    bring: "A decision, campaign route, product idea, positioning, launch or strategic dilemma.",
    leave: "A clearer decision, exposed assumptions and a concrete next move.",
    href: "/stress-test/",
    action: "STRESS-TEST A DECISION ↗",
  },
  {
    verb: "TEST.",
    name: "SYNTHETIC AUDIENCE TEST",
    label: "3–7 USEFUL MINDS",
    line: "Find out what an idea runs into before you spend real money finding out.",
    commercial: "SCOPED TO THE TEST",
    bring: "An idea, proposition, campaign, product or piece of communication.",
    leave: "Distinct reactions, useful opposition, weak spots and a stronger version.",
    href: "/room/",
    action: "ENTER THE ROOM ↗",
  },
  {
    verb: "BUILD.",
    name: "CTRL+2GO",
    label: "APPLIED AI / TAKEAWAY SIZE",
    line: "A few days of us. A useful little machine that stays.",
    commercial: "A FEW DAYS · THE SYSTEM STAYS",
    bring: "One stubborn problem, repeated task or decision that should work better.",
    leave: "A small specialised Applied AI system built around the job.",
    href: "/2go/",
    action: "BUILD ONE ↗",
  },
  {
    verb: "WATCH.",
    name: "OBSERVATORY",
    label: "ONE SIGNAL THAT MATTERS",
    line: "Some problems do not need another meeting. They need watching.",
    commercial: "ONGOING WATCH",
    bring: "One behaviour, market, competitor, audience or signal worth following.",
    leave: "A live watch system that surfaces meaningful change when it happens.",
    href: "mailto:poppevanpelt@gmail.com?subject=Build%20an%20Observatory",
    action: "START WATCHING ↗",
  },
] as const;

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


const humanMaterialBooks = [
  { author: "DANIEL KAHNEMAN", title: "Thinking, Fast and Slow", subject: "JUDGMENT / BIAS", href: "https://books.google.com/books?q=Thinking+Fast+and+Slow+Daniel+Kahneman" },
  { author: "GARY KLEIN", title: "Sources of Power", subject: "EXPERT JUDGMENT", href: "https://books.google.com/books?q=Sources+of+Power+Gary+Klein" },
  { author: "CHARLAN NEMETH", title: "In Defense of Troublemakers", subject: "DISSENT", href: "https://books.google.com/books?q=In+Defense+of+Troublemakers+Charlan+Nemeth" },
  { author: "AMY EDMONDSON", title: "The Fearless Organization", subject: "PSYCHOLOGICAL SAFETY", href: "https://books.google.com/books?q=The+Fearless+Organization+Amy+Edmondson" },
  { author: "PHILIP TETLOCK + DAN GARDNER", title: "Superforecasting", subject: "UNCERTAINTY", href: "https://books.google.com/books?q=Superforecasting+Philip+Tetlock+Dan+Gardner" },
  { author: "VICTOR TURNER", title: "The Ritual Process", subject: "RITUAL / GROUPS", href: "https://books.google.com/books?q=The+Ritual+Process+Victor+Turner" },
  { author: "DIMITRIS XYGALATAS", title: "Ritual", subject: "BEHAVIOUR / BELONGING", href: "https://books.google.com/books?q=Ritual+Dimitris+Xygalatas" },
  { author: "ERVING GOFFMAN", title: "The Presentation of Self in Everyday Life", subject: "SOCIAL BEHAVIOUR", href: "https://books.google.com/books?q=The+Presentation+of+Self+in+Everyday+Life+Erving+Goffman" },
  { author: "DONELLA MEADOWS", title: "Thinking in Systems", subject: "SYSTEMS", href: "https://books.google.com/books?q=Thinking+in+Systems+Donella+Meadows" },
] as const;

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

// NETLIFY PRODUCTION NUDGE 2026-09-21 PERSONA POLISH
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

      <section className={styles.products} aria-labelledby="products-title">
        <div className={styles.sectionLabel}>
          <span>WHAT YOU CAN ACTUALLY BUY</span>
          <span>DECIDE / TEST / BUILD / WATCH</span>
        </div>

        <div className={styles.productsIntro}>
          <h2 id="products-title">FOUR THINGS<br />YOU CAN<br /><em>BUY.</em></h2>
          <div className={styles.productsIntroCopy}>
            <p>
              The instruments are how we work. These are the things you can hire us for.
            </p>
            <strong>BRING A REAL PROBLEM. LEAVE WITH SOMETHING USEFUL.</strong>
          </div>
        </div>

        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <a
              className={styles.productCard}
              key={product.name}
              href={product.href}
              aria-label={`${product.name}: ${product.action}`}
            >
              <div className={styles.productTopline}>
                <span>PRODUCT {String(index + 1).padStart(2, "0")}</span>
                <span>{product.label}</span>
              </div>

              <div className={styles.productOffer}>
                <strong className={styles.productVerb}>{product.verb}</strong>
                <span className={styles.productCommercial}>{product.commercial}</span>
              </div>

              <div className={styles.productBody}>
                <h3>{product.name}</h3>
                <p>{product.line}</p>
              </div>

              <dl className={styles.productExchange}>
                <div>
                  <dt>You bring</dt>
                  <dd>{product.bring}</dd>
                </div>
                <div>
                  <dt>You leave with</dt>
                  <dd>{product.leave}</dd>
                </div>
              </dl>

              <span className={styles.productAction}>{product.action}</span>
            </a>
          ))}
        </div>

        <div className={styles.productsBigger}>
          <span>NEED SOMETHING BIGGER?</span>
          <strong>Sometimes the problem is not the decision. It is the machinery around it.</strong>
          <a href="mailto:poppevanpelt@gmail.com?subject=Redesign%20the%20system">REDESIGN THE SYSTEM ↗</a>
        </div>
      </section>


      <section className={styles.pricingShelf} aria-labelledby="pricing-title">
        <div className={styles.sectionLabel}>
          <span>PRICING / ROOMS</span>
          <Link href="/pricing/">FULL PRICING ↗</Link>
        </div>
        <div className={styles.pricingIntro}>
          <h2 id="pricing-title">WHAT DOES<br />THE PRESSURE<br /><em>COST?</em></h2>
          <p>Readable here. Full documents one click away.</p>
        </div>
        <div className={styles.pricingGrid}>
          <Link className={styles.pricingCard} href="/pricing/decision-stress-test/">
            <span>ONE IMPORTANT DECISION</span>
            <h3>Decision Stress-Test™</h3>
            <strong>€4,500</strong>
            <small>EX VAT · ONE DECISION</small>
            <b>OPEN PRICING ↗</b>
          </Link>
          <Link className={styles.pricingCard} href="/pricing/on-call-room/">
            <span>ON-CALL ROOM™ / ESSENTIAL</span>
            <h3>Your decision team. On call.</h3>
            <strong>€7,500</strong>
            <small>PER MONTH · BILLED MONTHLY</small>
            <b>OPEN PRICING ↗</b>
          </Link>
          <Link className={styles.pricingCard} href="/pricing/on-call-room/">
            <span>ON-CALL ROOM™ / FOUNDER</span>
            <h3>More leverage. Same Room.</h3>
            <strong>€12,500</strong>
            <small>PER MONTH · BILLED MONTHLY</small>
            <b>OPEN PRICING ↗</b>
          </Link>
        </div>
      </section>

      <section className={styles.llmContrast} aria-labelledby="llm-contrast-title">
        <div className={styles.sectionLabel}>
          <span>GENERIC LLM / CTRL+LOVE</span>
          <span>SAME INTELLIGENCE / DIFFERENT MACHINE</span>
        </div>

        <div className={styles.llmContrastIntro}>
          <div>
            <p className={styles.kicker}>NOT ANOTHER LLM</p>
            <h2 id="llm-contrast-title">SAME<br />INTELLIGENCE.<br /><em>DIFFERENT MACHINE.</em></h2>
          </div>
          <p>
            A generic LLM is designed to give you a useful answer.
            ctrl+love is designed to make that answer survive.
          </p>
        </div>

        <div className={styles.llmCompare}>
          <article className={styles.llmGeneric}>
            <span className={styles.llmColumnLabel}>GENERIC LLM</span>
            <ol>
              <li><span>01</span><strong>Helpful completion</strong></li>
              <li><span>02</span><strong>One accommodating voice</strong></li>
              <li><span>03</span><strong>Answers the question you asked</strong></li>
              <li><span>04</span><strong>Reduces friction</strong></li>
              <li><span>05</span><strong>Optimises the answer</strong></li>
            </ol>
          </article>

          <article className={styles.llmCtrl}>
            <span className={styles.llmColumnLabel}>CTRL+LOVE</span>
            <ol>
              <li><span>01</span><strong>Productive resistance</strong></li>
              <li><span>02</span><strong>65+ opposing perspectives</strong></li>
              <li><span>03</span><strong>Questions the question itself</strong></li>
              <li><span>04</span><strong>Introduces friction deliberately</strong></li>
              <li><span>05</span><strong>Pressure-tests the decision</strong></li>
            </ol>
          </article>
        </div>

        <div className={styles.llmPressure}>
          <p>
            Assumptions are exposed. Alternatives are forced into the room.
            Weak ideas are allowed to die. Sometimes stopping is the best output.
          </p>
          <div className={styles.llmSurvived}>
            <div className={styles.llmBall}>
              <Image
                src="/museum/steel-ball-packshot-cutout.png"
                alt="Polished steel calibration ball"
                width={104}
                height={104}
              />
            </div>
            <span>IT SURVIVED.</span>
          </div>
        </div>

        <p className={styles.llmFinal}>
          <span>AN LLM GIVES YOU AN ANSWER.</span>
          <strong>CTRL+LOVE GIVES THE ANSWER SOMETHING TO SURVIVE.</strong>
        </p>
      </section>

      

      

      


      <section className={styles.reading} aria-labelledby="reading-title">
        <div className={styles.sectionLabel}>
          <span>THE LIBRARY</span>
          <span>HUMAN MATERIAL / CURRENT READING</span>
        </div>

        <div className={styles.libraryIntro}>
          <div>
            <p className={styles.kicker}>A VERY THIN LIBRARY</p>
            <h2 id="reading-title">READ<br /><em>PEOPLE.</em></h2>
          </div>
          <p>
            Judgment, dissent, groups, bias, risk, ritual, systems and human behaviour.
            The books behind the instruments.
          </p>
        </div>

        <div className={styles.libraryShelf}>
          <div className={styles.libraryShelfHead}>
            <span>SHELF 01</span>
            <strong>HUMAN MATERIAL</strong>
            <span>09 BOOKS / PERMANENTLY UNFINISHED</span>
          </div>
          <div className={styles.bookGrid}>
            {humanMaterialBooks.map((book, index) => (
              <a className={styles.bookCard} key={book.title} href={book.href} target="_blank" rel="noreferrer">
                <span>{String(index + 1).padStart(2, "0")} · {book.subject}</span>
                <h3>{book.title} ↗</h3>
                <p>{book.author}</p>
              </a>
            ))}
          </div>
        </div>

        <div className={`${styles.libraryShelf} ${styles.thinPressShelf}`}>
          <div className={styles.libraryShelfHead}>
            <span>SHELF 02</span>
            <strong>CURRENT READING</strong>
            <span>ONE LIVE EXPERIMENT</span>
          </div>
          <div className={styles.thinBookGrid}>
            <Link className={styles.currentReadingCard} href="/brand-survival/">
              <span>CURRENT EXPERIMENT / 001</span>
              <h3>Brand / Wallpaper</h3>
              <p>What survives when familiar brand cues are removed?</p>
              <strong>OPEN READING ↗</strong>
            </Link>
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

      


      

      

      

      <section className={styles.factory} aria-labelledby="factory-title">
        <div className={styles.sectionLabel}>
          <span>THE FACTORY / WORKING DOORS</span>
          <Link href="/instruments/">ALL 024 INSTRUMENTS ↗</Link>
        </div>
        <div className={styles.factoryIntro}>
          <h2 id="factory-title">RECENTLY<br />BUILT.</h2>
          <p>Twelve current instruments. Open the public doors, inspect the rest in the Room.</p>
        </div>

        <div className={styles.recentList}>
          {recentInstruments.map((instrument) => (
            <Link href={instrument.href} className={styles.recentItem} key={instrument.no}>
              <div>
                <h3>{instrument.name}</h3>
                <p>{instrument.line}</p>
              </div>
              <span>{instrument.state}</span>
              <strong>OPEN ↗</strong>
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
              65+ handwritten perspectives, built one by one from real people Poppe has met, watched,
              argued with and worked beside across more than 30 years of meetings.
              Each is a compound of observed behaviour, habits, contradictions, judgment and oddities actually encountered.
            </p>
            <strong>HANDWRITTEN FROM REAL ENCOUNTERS. NOT BOUGHT BY THE KILO FROM META.</strong>
            <span className={styles.metaFootnote}>@meta</span>
            <p className={styles.provenanceNote}>
              No demographic templates. No batch-generated avatars. Observed first, written second.
            </p>
          </div>
        </div>
        <div className={styles.personaGrid}>
          {homepageRoomPersonas.map((persona, index) => {
            const genealogy = personaGenealogies[persona.id] ?? {
              status: "ANCESTRY UNRESOLVED · LINE LEFT OPEN",
            };

            return (
              <article className={styles.personaCard} key={persona.id}>
                <div className={styles.personaSpecimenTopline}>
                  <span>SPECIMEN {String(index + 1).padStart(2, "0")}</span>
                  <span>SYNTHETIC / ACTIVE</span>
                </div>
                <div className={styles.personaPortrait}>
                  {persona.portrait ? (
                    <Image
                      src={persona.portrait}
                      alt={`${persona.name}, ctrl+love synthetic persona`}
                      unoptimized
                      fill
                      sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 25vw"
                      style={{ objectPosition: persona.portraitPosition ?? "50% 40%" }}
                    />
                  ) : null}
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
                          <i aria-hidden="true"><b style={{ width: `${source.share}%` }} /></i>
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

      

      <SoundtrackCue
        index="01"
        title="MOVING TO THE SUN"
        artist="HUGEL"
        href="https://www.youtube.com/results?search_query=HUGEL+Moving+to+the+Sun"
        note="Placed exactly where the horizon earns it."
      />

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
