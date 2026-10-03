import type { Metadata } from "next";
import Link from "next/link";
import CostMeter from "./cost-meter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "€0 voor jouw toekomst | Laat je niet naaien",
  description:
    "Heeft een concurrentiebeding jou ooit geld gekost? Meld je kosten. Wij meten wat Nederland nooit heeft uitgerekend.",
  alternates: { canonical: "https://laatjenietnaaien.nl/" },
  openGraph: {
    title: "€0 VOOR JOUW TOEKOMST",
    description: "3,1 miljoen gratis opties. Wat kosten concurrentiebedingen Nederland werkelijk?",
    url: "https://laatjenietnaaien.nl/",
    siteName: "ctrl+love",
    locale: "nl_NL",
    type: "website",
  },
};

const sources = [
  {
    label: "Rijksoverheid · modernisering concurrentiebeding · juni 2026",
    href: "https://www.rijksoverheid.nl/actueel/nieuws/2026/06/26/meer-vrijheid-voor-werknemer-door-modernisering-concurrentiebeding",
    note: "Het kabinet zegt dat inmiddels ongeveer één op de drie werknemers een concurrentiebeding heeft.",
  },
  {
    label: "Tweede Kamer · Panteia-onderzoek",
    href: "https://zoek.officielebekendmakingen.nl/kst-29544-1089.html",
    note: "Panteia schatte 3,1 miljoen werknemers, 37% van de werkenden, met een concurrentiebeding.",
  },
  {
    label: "OECD Employment Outlook 2026",
    href: "https://www.oecd.org/en/publications/oecd-employment-outlook-2026_7e710f54-en/full-report/component-9.html",
    note: "Internationaal onderzoek koppelt meer concurrentiebedingen aan minder mobiliteit, tragere loonontwikkeling en lagere productiviteit. De OECD noemt de productiviteitsschattingen associaties, geen zuiver causale effecten.",
  },
  {
    label: "CBS · bevolking · juli 2026",
    href: "https://www.cbs.nl/nl-nl/cijfers/detail/83474NED",
    note: "Nederland telde eind juli 2026 voorlopig 18.153.271 inwoners.",
  },
];

export default function LaatJeNietNaaienPage() {
  return (
    <main id="main-content" className={styles.shell} lang="nl">
      <header className={styles.hero}>
        <div className={styles.topline}>
          <Link href="/" className={styles.brand}>ctrl+love</Link>
          <span>publiek meetinstrument / 2026</span>
        </div>
        <p className={styles.kicker}>HEEFT EEN CONCURRENTIEBEDING JOU OOIT GELD GEKOST?</p>
        <h1 className={styles.title}><span>€0</span> VOOR JOUW<br />TOEKOMST</h1>
        <p className={styles.subhead}>3,1 MILJOEN GRATIS OPTIES.<br />DAAR MAG HEEL NEDERLAND VOOR BLOEDEN.</p>
        <div className={styles.intro}>
          <p>Een baan niet aangenomen. Een bedrijf niet begonnen. Een opdracht geweigerd. Advocaten moeten inschakelen. Betaald om ervan af te komen.</p>
          <p>Nederland weet dat concurrentiebedingen mobiliteit kunnen remmen. <strong>Maar niemand heeft de rekening.</strong></p>
          <p className={styles.instrumentLine}>Dus meten we hem. Wij tellen geen meningen. Wij tellen euro&apos;s.</p>
        </div>
      </header>

      <section className={styles.numberStrip} aria-label="De schaal">
        <article><strong>3,1 mln</strong><span>werknemers geschat met een beding in het Panteia-onderzoek</span></article>
        <article><strong>1 op 3</strong><span>werknemers volgens de Rijksoverheid in 2026</span></article>
        <article><strong>18.153.271</strong><span>inwoners van Nederland eind juli 2026, voorlopig CBS-cijfer</span></article>
      </section>

      <section className={styles.case}>
        <p className={styles.sectionLabel}>CASE 001 / WAAROM DEZE METER BESTAAT</p>
        <div className={styles.caseGrid}>
          <div><strong>€6.651,61</strong><span>aantoonbare advocatenkosten in één concurrentiebeding-dossier</span></div>
          <div><strong>€4.836,61</strong><span>daarvan stond op 29 september 2026 nog open</span></div>
          <div><strong>€0</strong><span>algemene wettelijke prijs om het recht vooraf in een contract te reserveren</span></div>
        </div>
        <p className={styles.caseNote}>Dat is één dossier. Deze meter is bedoeld om te ontdekken wat er gebeurt als Nederland de rest ook gaat tellen.</p>
      </section>

      <CostMeter />

      <section className={styles.method}>
        <p className={styles.sectionLabel}>WAT WE WEL — EN NIET — TELLEN</p>
        <div className={styles.methodGrid}>
          <article><span>01</span><h2>Harde kosten</h2><p>Advocaten, afkoop, schikking en andere rechtstreeks betaalde bedragen.</p></article>
          <article><span>02</span><h2>Gemeld inkomensverlies</h2><p>Door jou opgegeven misgelopen salaris, opdrachten of winst. Apart gehouden van harde kosten.</p></article>
          <article><span>03</span><h2>Geen claimmachine</h2><p>De uitkomst is wat jij meldt. Geen juridisch oordeel, geen bewijs van aansprakelijkheid en geen vaststelling van schade.</p></article>
        </div>
      </section>

      <section className={styles.challenge}>
        <p className={styles.sectionLabel}>ARBEIDSRECHTELIJK NEDERLAND</p>
        <h2>Wat missen we?</h2>
        <p>Welke juridische of economische reden is er om het recht op iemands toekomstige arbeidsvrijheid gratis te mogen reserveren?</p>
        <p className={styles.challengePunch}>Niet gratis uitoefenen. <strong>Gratis reserveren.</strong></p>
      </section>

      <section className={styles.sources}>
        <p className={styles.sectionLabel}>BRONNEN / ZODAT IEDEREEN KAN TERUGREKENEN</p>
        <div className={styles.sourceList}>
          {sources.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
              <strong>{source.label}</strong><span>{source.note}</span>
            </a>
          ))}
        </div>
        <p className={styles.finePrint}>De 3,1 miljoen is een schatting uit het Panteia-onderzoek en dus geen actuele telling. De Rijksoverheid meldt in 2026 dat ongeveer één op de drie werknemers een concurrentiebeding heeft. OECD-resultaten zijn internationaal en mogen niet mechanisch worden omgerekend naar Nederlandse miljardenclaims.</p>
      </section>

      <footer className={styles.footer}>
        <div><strong>LAAT JE NIET NAAIEN.</strong><span>een ctrl+love instrument</span></div>
        <Link href="/">ctrlpluslove.com</Link>
      </footer>
    </main>
  );
}
