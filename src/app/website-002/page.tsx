import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "./website-002.module.css";
import { Website002Shell } from "./website-002-shell";

export const metadata: Metadata = {
  title: "Website 002 — ctrl+love",
  description: "Experimental Sunnyvale Annex homepage for ctrl+love.",
  robots: { index: false, follow: false },
};

const instruments = [
  { no: "001", name: "Pitch Crash Test", src: "/instruments/01-pitch-crash-test.webp", href: "/stress-test" },
  { no: "002", name: "Decision Collider", src: "/instruments/02-decision-collider.webp", href: "/decision-collider" },
  { no: "003", name: "Living Ticker", src: "/instruments/03-living-ticker.webp", href: "/instruments" },
  { no: "004", name: "Brand Transplant", src: "/instruments/04-brand-transplant.webp", href: "/instruments" },
  { no: "005", name: "Signal Distortion", src: "/instruments/05-signal-distortion.webp", href: "/instruments" },
  { no: "006", name: "Decision Surface", src: "/instruments/06-decision-surface.webp", href: "/instruments" },
];

const personas = [
  { name: "Akiko Hayashi", role: "Synthetic mind", src: "/room/personas/akiko-hayashi.jpg" },
  { name: "Adrian Mbeki", role: "Synthetic mind", src: "/room/personas/adrian-mbeki.jpg" },
  { name: "Maya Elise Harper", role: "Synthetic mind", src: "/room/personas/maya-elise-harper.webp" },
  { name: "Nick Deckman", role: "Synthetic mind", src: "/room/personas/nick-deckman.jpg" },
];

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

        <section className={styles.instrumentFloor}>
          <div className={styles.sectionIntro}>
            <div>
              <span className={styles.sectionLabel}>INSTRUMENT FLOOR / ACTIVE</span>
              <h2>Not ideas about decisions.<br />Things you can use on them.</h2>
            </div>
            <Link href="/instruments" className={styles.textLink}>ENTER THE INSTRUMENT LIBRARY ↗</Link>
          </div>
          <div className={styles.instrumentGrid}>
            {instruments.map((instrument) => (
              <Link href={instrument.href} className={styles.instrumentCard} key={instrument.name}>
                <div className={styles.instrumentImageWrap}>
                  <Image src={instrument.src} alt={instrument.name} fill sizes="(max-width: 800px) 50vw, 16vw" className={styles.instrumentImage} />
                </div>
                <div className={styles.instrumentMeta}>
                  <span>{instrument.no}</span>
                  <strong>{instrument.name}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.controlRoom}>
          <div className={styles.controlVisual}>
            <Image src="/home/judgment-control-room.webp" alt="Judgment control room" fill sizes="(max-width: 900px) 100vw, 62vw" className={styles.controlImage} />
            <div className={styles.controlCaption}>JUDGMENT CONTROL / LIVE ROOM</div>
          </div>
          <div className={styles.controlCopy}>
            <span className={styles.sectionLabel}>WHY THIS PLACE EXISTS</span>
            <h2>Intelligence is getting cheaper.<br />Judgment isn’t.</h2>
            <p>So we build rooms, instruments and protocols that make assumptions visible, disagreement useful and decisions easier to examine before reality examines them for you.</p>
            <Link href="/inside-ctrl-love" className={styles.textLink}>INSIDE THE INSTITUTE ↗</Link>
          </div>
        </section>

        <section className={styles.people}>
          <div className={styles.peopleIntro}>
            <span className={styles.sectionLabel}>HUMAN NETWORK / SYNTHETIC MINDS</span>
            <h2>The room is never empty.</h2>
            <p>Real humans, synthetic personas and one deliberately inconvenient missing seat. Different minds are not decoration here. They are part of the apparatus.</p>
          </div>
          <div className={styles.personaGrid}>
            {personas.map((persona) => (
              <div className={styles.persona} key={persona.name}>
                <div className={styles.personaImageWrap}>
                  <Image src={persona.src} alt={persona.name} fill sizes="(max-width: 700px) 50vw, 20vw" className={styles.personaImage} />
                </div>
                <span>{persona.name}</span>
                <small>{persona.role}</small>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.foundation}>
          <div className={styles.foundationMark}>
            <Image src="/poppe/foundation-logo.svg" alt="ctrl+love Foundation" width={560} height={220} />
          </div>
          <div className={styles.foundationCopy}>
            <span className={styles.sectionLabel}>DEPARTMENT / OPEN ACCESS</span>
            <h2>AI access shouldn’t depend on where you were born.</h2>
            <p>The ctrl+love Foundation is the part of the institute pointed outward: getting useful AI access and curiosity into places where cost or circumstance would otherwise keep it out.</p>
            <Link href="/poppe" className={styles.textLink}>FOUNDATION FIELD NOTE ↗</Link>
          </div>
        </section>

        <section className={styles.fieldNotes}>
          <div className={styles.sectionLabel}>FIELD NOTES / CURRENT</div>
          <div className={styles.notesGrid}>
            <Link href="/brand-survival" className={styles.note}><span>READING 001</span><strong>Brand Survival</strong><small>What survives when average gets almost free?</small></Link>
            <Link href="/maria" className={styles.note}><span>EXCAVATION</span><strong>Maria</strong><small>Human protocols, mined before they become frameworks.</small></Link>
            <Link href="/purge" className={styles.note}><span>INSTRUMENT 020</span><strong>Purge</strong><small>For when addition has stopped helping.</small></Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <div>
            <span className={styles.sectionLabel}>ADMISSIONS / OPEN</span>
            <h2>Bring us something<br />that refuses to become clear.</h2>
          </div>
          <div className={styles.footerMeta}>
            <a href="mailto:hello@ctrlpluslove.com">hello@ctrlpluslove.com</a>
            <span>HAARLEM · NL / SUNNYVALE ANNEX · SOMEWHERE BETWEEN REALITY AND THE LAB</span>
            <span>WEBSITE 002 · REVIEW SPECIMEN</span>
          </div>
        </footer>
      </main>
    </Website002Shell>
  );
}
