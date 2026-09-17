import Image from "next/image";
import Link from "next/link";

import styles from "./home-2026.module.css";

const recentInstruments = [
  {
    no: "024",
    name: "BRAND SURVIVAL",
    state: "READING 001",
    line: "How much can we take away before it stops being you?",
    href: "/brand-survival/",
  },
  {
    no: "023",
    name: "CTRL+CHASE",
    state: "PROTOTYPE",
    line: "A question either produces evidence or earns its death.",
    href: "/chase/",
  },
  {
    no: "022",
    name: "MARIA EXCAVATION",
    state: "ONGOING",
    line: "Map how a decision travels, not only where it ends.",
    href: "/maria/",
  },
  {
    no: "020",
    name: "PURGE",
    state: "PROTOTYPE",
    line: "Cut the fat. Keep the organ.",
    href: "/purge/",
  },
  {
    no: "004",
    name: "DECISION MEMORY",
    state: "PROTOTYPE",
    line: "A forgotten decision must win its argument again.",
    href: "/decision-memory/",
  },
  {
    no: "001",
    name: "DECISION COLLIDER",
    state: "WORKING",
    line: "Collide assumptions before people collide.",
    href: "/decision-collider/",
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
          <p className={styles.kicker}>SUNNYVALE ANNEX / APPLIED INTELLIGENCE</p>
          <h1 id="home-title">WE BUILD<br />INSTRUMENTS<br />FOR HUMAN<br />JUDGMENT.</h1>
          <p className={styles.heroLead}>
            AI can generate more answers than we will ever need.<br />
            The interesting problem is knowing what deserves to be believed.
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

      <section className={styles.offices} aria-labelledby="offices-title">
        <div className={styles.officeIntro}>
          <div className={styles.sectionLabel}>
            <span>CTRL+LOVE FIELD STATIONS</span>
            <span>03 OFFICES / 03 CONDITIONS</span>
          </div>
          <div className={styles.officeIntroGrid}>
            <h2 id="offices-title">SAME INSTITUTE.<br /><em>DIFFERENT WEATHER.</em></h2>
            <p>
              We keep different places for different kinds of thought: one open to the sun,
              one buried in signal, and one deliberately hard to find.
            </p>
          </div>
        </div>

        <div className={styles.officeGrid}>
          <article className={`${styles.office} ${styles.officeSunnyvale}`}>
            <Image
              className={styles.officeImage}
              src="/home/sunnyvale-campus.webp"
              alt="The sunlit ctrl+love Sunnyvale Annex in California"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
            />
            <div className={styles.officeVeil} aria-hidden="true" />
            <div className={styles.officeTopline}>
              <span>STATION 01</span>
              <span>CALIFORNIA · US</span>
            </div>
            <div className={styles.officeCopy}>
              <p className={styles.officeStatus}>DAYLIGHT / CALIBRATION / OPTIMISM</p>
              <h3>SUNNYVALE</h3>
              <p>Palms, test rigs, blue sky. Where impossible things get treated as Tuesday.</p>
            </div>
          </article>

          <article className={`${styles.office} ${styles.officeTokyo}`}>
            <Image
              className={styles.officeImage}
              src="https://images.unsplash.com/photo-1532236395709-7d70320fec2d?auto=format&fit=crop&w=1800&q=84"
              alt="Busy central Tokyo at night, the visual setting for ctrl+love Tokyo"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
            />
            <div className={styles.officeVeil} aria-hidden="true" />
            <div className={styles.officeTopline}>
              <span>STATION 02</span>
              <span>TOKYO · JP</span>
            </div>
            <div className={styles.officeCopy}>
              <p className={styles.officeStatus}>NIGHT SHIFT / CENTRAL TOKYO / WINDOWS STILL ON</p>
              <h3>TOKYO</h3>
              <p>
                Dead centre. The city is still moving and somebody has apparently decided
                23:47 is a perfectly sensible time to run one more test.
              </p>
              <Link href="/embassies/tokyo/" className={styles.officeLink}>
                TOKYO EMBASSY / HUMAN NETWORK ↗
              </Link>
            </div>
          </article>

          <article className={`${styles.office} ${styles.officeBloemendaal}`}>
            <Image
              className={styles.officeImage}
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Batterie_Heerenduin%2C_Regelbau_M_272_%28Stand_3%29_1.JPG"
              alt="A concrete bunker tucked into North Holland dunes, architectural context for ctrl+love Bloemendaal"
              fill
              sizes="(max-width: 900px) 100vw, 34vw"
            />
            <div className={styles.officeVeil} aria-hidden="true" />
            <div className={styles.bloemendaalArchitecture} aria-hidden="true">
              <span className={styles.observationWindow}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.weatherMast}>
                <i className={styles.mastStem} />
                <i className={styles.mastVane} />
                <i className={styles.mastCup} />
              </span>
              <span className={styles.weatherReadout}>WIND 284° / 7.2 M/S · PRESS 1011.4 HPA</span>
            </div>
            <div className={styles.officeTopline}>
              <span>STATION 03</span>
              <span>BLOEMENDAAL · NL</span>
            </div>
            <div className={styles.officeCopy}>
              <p className={styles.officeStatus}>DUNE STATION / QUIET / WESTERLY 7.2 M/S</p>
              <h3>BLOEMENDAAL</h3>
              <p>
                Almost buried. One absurdly wide window across the dunes, and a weather mast
                measuring conditions nobody has proved are relevant to decisions yet.
              </p>
            </div>
          </article>
        </div>

        <p className={styles.officeFootnote}>
          BLOEMENDAAL IMAGE: NORTH HOLLAND DUNE-BUNKER FIELD REFERENCE · PUBLIC DOMAIN
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

          <div className={styles.curve} aria-label="Illustrative Brand Survival reading">
            <div className={styles.curveAxisY}>RECOGNITION</div>
            <div className={styles.curvePlot}>
              <span className={styles.curveBrand} />
              <span className={styles.curveWallpaper} />
              <span className={styles.curveMarkOne}>BRAND</span>
              <span className={styles.curveMarkTwo}>WALLPAPER</span>
            </div>
            <div className={styles.curveAxisX}>MORE REMOVED →</div>
            <p className={styles.curveNote}>Observed data only. No reference curve.</p>
          </div>
        </div>
      </section>

      <section className={styles.factory} aria-labelledby="factory-title">
        <div className={styles.sectionLabel}>
          <span>THE FACTORY</span>
          <Link href="/instruments/">ALL 024 INSTRUMENTS ↗</Link>
        </div>
        <div className={styles.factoryIntro}>
          <h2 id="factory-title">RECENTLY<br />BUILT.</h2>
          <p>Working instruments, prototypes, field tests and useful failures.</p>
        </div>

        <div className={styles.instrumentGrid}>
          {recentInstruments.map((instrument) => (
            <Link href={instrument.href} className={styles.instrument} key={instrument.no}>
              <div className={styles.instrumentMeta}>
                <span>{instrument.no}</span>
                <span>{instrument.state}</span>
              </div>
              <h3>{instrument.name}</h3>
              <p>{instrument.line}</p>
              <span className={styles.instrumentOpen}>OPEN ↗</span>
            </Link>
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

      <section className={styles.field} aria-labelledby="field-title">
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

      <section className={styles.humans} aria-labelledby="humans-title">
        <div className={styles.sectionLabel}>
          <span>WHO IS OPERATING THE MACHINERY</span>
          <span>HUMAN-LED</span>
        </div>
        <div className={styles.humansGrid}>
          <div>
            <h2 id="humans-title">25 YEARS<br />ADVERTISING.<br />8 YEARS APPLE.<br /><em>THEN THIS.</em></h2>
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

      <section className={styles.exit} aria-labelledby="exit-title">
        <p className={styles.kicker}>OPEN DOOR</p>
        <h2 id="exit-title">BRING US SOMETHING<br />THAT REFUSES TO<br />BECOME CLEAR.</h2>
        <p>A decision. A belief. A brand. A room. A problem everyone thinks they understand.</p>
        <Link href="/factory/">ENTER THE FACTORY ↗</Link>
        <div className={styles.exitFooter}>
          <span>ctrl+love · Haarlem · 2026</span>
          <span>Observe. Understand. Judge. Remain human.</span>
        </div>
      </section>
    </main>
  );
}
