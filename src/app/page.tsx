import Image from "next/image";
import Link from "next/link";

import styles from "./home-2026.module.css";
import { EarthriseMoment } from "./earthrise-moment";
import { coreRoomPersonas } from "./room-personas-data";
import { confirmedAmbassadors } from "./ambassadors-data";

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

const homepagePersonas = coreRoomPersonas.slice(0, 4);
const homepageAmbassadors = confirmedAmbassadors.slice(0, 6);

const personaGenealogies: Record<
  string,
  { status: string; sources?: Array<{ name: string; share: number }> }
> = {
  "maya-elise-harper": {
    status: "ANCESTRY UNRESOLVED · LINE LEFT OPEN",
  },
  "simon-cross": {
    status: "ANCESTRY UNRESOLVED · LINE LEFT OPEN",
  },
  "nick-deckman": {
    status: "DESCENDS FROM",
    sources: [
      { name: "SIMON NEEFJES", share: 60 },
      { name: "ERIK KELLERHUIS", share: 30 },
      { name: "MAXIME HARTMAN", share: 10 },
    ],
  },
  "lexi-arden": {
    status: "ANCESTRY UNRESOLVED · LINE LEFT OPEN",
  },
};

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

      <section className={styles.personas} aria-labelledby="personas-title">
        <div className={styles.sectionLabel}>
          <span>SYNTHETIC PERSONAS</span>
          <Link href="/room/">ENTER THE ROOM ↗</Link>
        </div>
        <div className={styles.personaIntro}>
          <h2 id="personas-title">THE ROOM<br />IS NOT EMPTY.</h2>
          <p>Built perspectives with jobs to do, not decorative avatars.</p>
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

                <div className={styles.personaPortrait}>
                  {persona.portrait ? (
                    <Image
                      src={persona.portrait}
                      alt={persona.name}
                      fill
                      sizes="(max-width: 620px) 46vw, 24vw"
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

      <section className={styles.ambassadors} aria-labelledby="ambassadors-title">
        <div className={styles.sectionLabel}>
          <span>AMBASSADOR NETWORK</span>
          <Link href="/ambassadors/">MEET EVERYONE ↗</Link>
        </div>
        <div className={styles.ambassadorIntro}>
          <h2 id="ambassadors-title">NOT A<br />SOLO LAB.</h2>
          <p>Human operators around the world, each carrying a different piece of reality into the room.</p>
        </div>
        <div className={styles.ambassadorGrid}>
          {homepageAmbassadors.map((ambassador) => (
            <Link className={styles.ambassadorCard} href={`/ambassadors/${ambassador.id}/`} key={ambassador.id}>
              <div className={styles.ambassadorPortrait}>
                {ambassador.image ? (
                  <Image src={ambassador.image} alt={ambassador.name} fill sizes="(max-width: 620px) 48vw, 16vw" />
                ) : null}
              </div>
              <span>{ambassador.number} · {ambassador.flag}</span>
              <h3>{ambassador.preferredName ?? ambassador.name}</h3>
              <p>{ambassador.city}</p>
            </Link>
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
            <h2 id="humans-title">3 DECADES<br />ADVERTISING.<br />8 YEARS APPLE.<br /><em>THEN THIS.</em></h2>
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

      <section className={styles.shoppe} aria-labelledby="shoppe-title">
        <div className={styles.shoppePlate}>BENCH 02 · SAN GREGORIO / CALIFORNIA</div>
        <div className={styles.shoppeCopy}>
          <p className={styles.kicker}>POPPE&apos;S PROMPT SHOPPE</p>
          <h2 id="shoppe-title">OLD PROMPTS<br />BOUGHT &amp; SOLD.</h2>
          <p>Bring in the tired ones. The guys will put them on the dyno, find the hidden assumptions and see if there is a decision inside.</p>
          <Link href="/prompt-shoppe/">ENTER THE SHOPPE ↗</Link>
        </div>
        <div className={styles.shoppeMachine} aria-hidden="true">
          <span>TEST</span><span>LOAD</span><span>INTENT</span>
        </div>
      </section>

      <EarthriseMoment />

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
