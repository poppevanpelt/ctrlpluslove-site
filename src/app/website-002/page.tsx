import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { EarthriseMoment } from "../earthrise-moment";
import { confirmedAmbassadors } from "../ambassadors-data";
import { coreRoomPersonas } from "../room-personas-data";
import styles from "./website-002.module.css";
import { Website002Shell } from "./website-002-shell";

export const metadata: Metadata = {
  title: "Website 002 — ctrl+love",
  description: "Experimental Sunnyvale Annex homepage for ctrl+love.",
  robots: { index: false, follow: false },
};

const publicInstruments = [
  { no: "024", name: "Brand Survival", state: "READING 001", line: "How much can we take away before it stops being you?", href: "/brand-survival/" },
  { no: "023", name: "CTRL+CHASE", state: "PROTOTYPE", line: "A question either produces evidence or earns its death.", href: "/chase/" },
  { no: "022", name: "Maria Excavation", state: "ONGOING", line: "Map how a decision travels, not only where it ends.", href: "/maria/" },
  { no: "020", name: "Purge", state: "PROTOTYPE", line: "Cut the fat. Keep the organ.", href: "/purge/" },
  { no: "009", name: "Poppe’s Prompt Shoppe", state: "WORKING", line: "A prompt without a decision is decoration.", href: "/prompt-shoppe/" },
  { no: "006", name: "CTRL+FIZZ", state: "PROTOTYPE", line: "Carbonated judgment for meetings that have gone flat.", href: "/fizz/" },
  { no: "005", name: "CTRL+SWAT", state: "FIELD TEST", line: "Detect. Judge. Build. Dispatch before the moment disappears.", href: "/swat/" },
  { no: "004", name: "Decision Memory", state: "PROTOTYPE", line: "A forgotten decision must win its argument again.", href: "/decision-memory/" },
  { no: "002", name: "Meeting Filter", state: "WORKING", line: "Decide whether the meeting should exist.", href: "/meeting-filter/" },
  { no: "001", name: "Decision Collider", state: "WORKING", line: "Collide assumptions before people collide.", href: "/decision-collider/" },
] as const;

const personaHeritage: Record<string, string> = {
  "nick-deckman": "60% Simon Neefjes · 30% Erik Kellerhuis · 10% Maxime Hartman",
};

const homepagePersonas = coreRoomPersonas.filter((persona) => persona.id !== "the-customer");

const shoppeObjects = [
  { no: "OBJ—01", name: "Prompt Dyno", line: "Puts a prompt under working load and reads what holds." },
  { no: "OBJ—02", name: "Assumption Extractor", line: "Presses out the assumptions a prompt smuggles in." },
  { no: "OBJ—03", name: "Intent Compass", line: "Finds the true intent and holds the heading." },
] as const;

const fieldNotes = [
  { stamp: "READING 001", title: "Brand Survival", line: "What survives when average gets almost free?", href: "/brand-survival/" },
  { stamp: "EXCAVATION", title: "Maria", line: "Human protocols, mined before they become frameworks.", href: "/maria/" },
  { stamp: "INSTRUMENT 020", title: "Purge", line: "For when addition has stopped helping.", href: "/purge/" },
] as const;

export default function Website002Page() {
  return (
    <Website002Shell>
      <main className={`${styles.page} website-002-page`}>
        <section className={styles.hero}>
          <Image
            src="/home/sunnyvale-campus.webp"
            alt="ctrl+love Sunnyvale Annex campus"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroVeil} />
          <header className={styles.heroHeader}>
            <Link href="/website-002" className={styles.wordmark}>ctrl+love</Link>
            <div className={styles.coordinates}>INSTITUTE FOR DECISION RESEARCH<br />HAARLEM · SUNNYVALE ANNEX</div>
          </header>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>APPLIED INTELLIGENCE / FIELD STATION 002</p>
            <h1>We build instruments<br />for human judgment.</h1>
            <p className={styles.heroLead}>AI can generate more answers than we will ever need. The interesting problem is knowing what deserves to be believed.</p>
          </div>
          <div className={styles.heroStatus}>
            <span><i /> ALL SYSTEMS CURIOUS</span>
            <span>24 INSTRUMENTS · AND COUNTING</span>
          </div>
        </section>

        <section className={styles.mission}>
          <div className={styles.sectionLabel}>MISSION / 001</div>
          <p>Better judgment begins with better observation.</p>
          <span className={styles.smallNote}>Observe. Understand. Judge. Remain human.</span>
        </section>

        <section className={styles.reading}>
          <div className={styles.sectionIntro}>
            <div>
              <span className={styles.sectionLabel}>CURRENT READING / INSTRUMENT 024</span>
              <h2>Brand / Wallpaper</h2>
            </div>
            <Link href="/brand-survival/" className={styles.textLink}>OPEN READING 001 ↗</Link>
          </div>
          <div className={styles.readingGrid}>
            <div className={styles.readingCopy}>
              <p>What survives when you remove the logo, language and familiar tricks?</p>
              <small>Recognition under subtraction. No score pretending to be truth.</small>
            </div>
            <div className={styles.curve} aria-label="Brand Survival recognition curves">
              <span className={styles.curveAxis}>RECOGNITION</span>
              <div className={styles.curvePlot}>
                <span className={styles.curveBrand} />
                <strong className={styles.brandLabel}>BRAND</strong>
                <span className={`${styles.downArrow} ${styles.arrowOne}`} aria-hidden="true">↓</span>
                <span className={`${styles.downArrow} ${styles.arrowTwo}`} aria-hidden="true">↓</span>
                <span className={`${styles.downArrow} ${styles.arrowThree}`} aria-hidden="true">↓</span>
                <span className={`${styles.downArrow} ${styles.arrowFour}`} aria-hidden="true">↓</span>
                <span className={styles.curveWallpaper} />
                <strong className={styles.wallpaperLabel}>WALLPAPER</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.instrumentFloor}>
          <div className={styles.sectionIntro}>
            <div>
              <span className={styles.sectionLabel}>INSTRUMENT FLOOR / PUBLIC DOORS</span>
              <h2>Things you can actually open.</h2>
            </div>
            <Link href="/instruments/" className={styles.textLink}>FULL REGISTER / 024 ↗</Link>
          </div>

          <div className={styles.instrumentGrid}>
            {publicInstruments.map((instrument) => (
              <Link href={instrument.href} className={styles.instrumentCard} key={instrument.no}>
                <div className={styles.instrumentMeta}>
                  <span>{instrument.no}</span>
                  <span>{instrument.state}</span>
                </div>
                <div className={styles.instrumentDevice} aria-hidden="true">
                  <span className={styles.deviceScreen}>{instrument.no}</span>
                  <span className={styles.deviceDial} />
                  <span className={styles.deviceSwitch} />
                  <span className={styles.deviceSlot} />
                </div>
                <h3>{instrument.name}</h3>
                <p>{instrument.line}</p>
                <span className={styles.openDoor}>OPEN REAL DOOR ↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.shoppe}>
          <div className={styles.shoppeHeader}>
            <span className={styles.sectionLabel}>WORKSHOP / SAN GREGORIO · CALIFORNIA</span>
            <h2>Poppe’s<br />Prompt Shoppe</h2>
            <p>Bring in your old ones. We’ll make ’em perform like never before.</p>
            <Link href="/prompt-shoppe/" className={styles.textLink}>ENTER THE SHOPPE ↗</Link>
          </div>
          <div className={styles.shoppeBench}>
            {shoppeObjects.map((object) => (
              <article className={styles.shoppeObject} key={object.no}>
                <div className={styles.shoppeMachine} aria-hidden="true">
                  <span className={styles.machinePlate}>{object.no}</span>
                  <span className={styles.machineGauge} />
                  <span className={styles.machineLever} />
                  <span className={styles.machineButton} />
                </div>
                <span>{object.no}</span>
                <h3>{object.name}</h3>
                <p>{object.line}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.thesis}>
          <span className={styles.sectionLabel}>WHY THIS PLACE EXISTS</span>
          <h2>Intelligence is getting cheaper. Judgment isn’t.</h2>
          <p>So we build rooms, instruments and protocols that make assumptions visible, disagreement useful and decisions easier to examine before reality examines them for you.</p>
        </section>

        <section className={styles.people}>
          <div className={styles.peopleIntro}>
            <span className={styles.sectionLabel}>SYNTHETIC MINDS / FUNCTION FIRST</span>
            <h2>The room is never empty.</h2>
            <p>Each persona exists to introduce a distinct pressure. Function comes before biography.</p>
          </div>
          <div className={styles.personaGrid}>
            {homepagePersonas.map((persona) => (
              <article className={styles.persona} key={persona.id}>
                <div className={styles.personaImageWrap}>
                  {persona.portrait ? (
                    <Image src={persona.portrait} alt={persona.name} fill sizes="(max-width: 700px) 50vw, 24vw" className={styles.personaImage} />
                  ) : null}
                </div>
                <div className={styles.personaCopy}>
                  <span className={styles.personaName}>{persona.name}</span>
                  <strong className={styles.personaRole}>{persona.role}</strong>
                  <p>{persona.contribution ?? persona.line}</p>
                  {personaHeritage[persona.id] ? (
                    <div className={styles.heritage}>
                      <span>GENETIC HERITAGE</span>
                      <b>{personaHeritage[persona.id]}</b>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ambassadors}>
          <div className={styles.sectionIntro}>
            <div>
              <span className={styles.sectionLabel}>AMBASSADORS / HUMAN NETWORK</span>
              <h2>Around the table.</h2>
            </div>
            <Link href="/ambassadors/" className={styles.textLink}>ALL AMBASSADORS ↗</Link>
          </div>
          <div className={styles.ambassadorGrid}>
            {confirmedAmbassadors.map((ambassador) => (
              <Link href={`/ambassadors/${ambassador.id}/`} className={styles.ambassador} key={ambassador.id}>
                <div className={styles.ambassadorImageWrap}>
                  {ambassador.image ? (
                    <Image src={ambassador.image} alt={ambassador.name} fill sizes="(max-width: 700px) 50vw, 20vw" className={styles.ambassadorImage} />
                  ) : (
                    <span className={styles.initials}>{ambassador.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                  )}
                </div>
                <div className={styles.ambassadorMeta}>
                  <strong>{ambassador.name}</strong>
                  <span>{ambassador.participationLabel}</span>
                  <small>{ambassador.city} · {ambassador.country}</small>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.foundation}>
          <div className={styles.foundationVisual}>
            <Image src="/poppe/foundation-logo.svg" alt="Children gathered around a laptop for the ctrl+love Foundation" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.foundationImage} />
          </div>
          <div className={styles.foundationCopy}>
            <span className={styles.sectionLabel}>CTRL+LOVE FOUNDATION / OPEN ACCESS</span>
            <h2>AI access shouldn’t depend on where you were born.</h2>
            <p>The Foundation points the institute outward: useful AI access, curiosity and practical tools in places where cost or circumstance would otherwise keep them out.</p>
            <span className={styles.foundationNote}>FIELD PROGRAM / IN DEVELOPMENT</span>
          </div>
        </section>

        <section className={styles.fieldNotes}>
          <div className={styles.sectionLabel}>FIELD NOTES / CURRENT</div>
          <div className={styles.notesGrid}>
            {fieldNotes.map((note) => (
              <Link href={note.href} className={styles.note} key={note.title}>
                <span>{note.stamp}</span>
                <strong>{note.title}</strong>
                <small>{note.line}</small>
              </Link>
            ))}
          </div>
        </section>

        <EarthriseMoment />

        <footer className={styles.footer}>
          <div>
            <span className={styles.sectionLabel}>ADMISSIONS / OPEN</span>
            <h2>Bring us something<br />that refuses to become clear.</h2>
          </div>
          <div className={styles.footerMeta}>
            <a href="mailto:hello@ctrlpluslove.com">hello@ctrlpluslove.com</a>
            <span>HAARLEM · NL / SUNNYVALE ANNEX</span>
            <span>WEBSITE 002.1 · REVIEW SPECIMEN</span>
          </div>
        </footer>
      </main>
    </Website002Shell>
  );
}
