import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LivingInstrumentState from "./living-instrument-state";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Instrument Room | ctrl+love",
  description: "A physical room of ctrl+love instruments, protocols, field tests and decision artifacts.",
};

type State = "WORKING" | "PROTOTYPE" | "FIELD TEST" | "ARCHIVE" | "IN DEVELOPMENT";
type Instrument = {
  no: string;
  name: string;
  state: State;
  line: string;
  why: string;
  href?: string;
  action?: string;
  family: "SEE" | "TEST" | "DECIDE" | "MOVE" | "ARTIFACT";
};

const instruments: readonly Instrument[] = [
  { no: "001", name: "DECISION COLLIDER", state: "WORKING", family: "DECIDE", line: "Collide assumptions before people collide.", why: "Built because agreement can hide incompatible definitions of the same decision.", href: "/decision-collider/", action: "RUN INSTRUMENT" },
  { no: "002", name: "MEETING FILTER", state: "WORKING", family: "SEE", line: "Decide whether the meeting should exist.", why: "Built after too many rooms were booked before anyone asked what the room was for.", href: "/meeting-filter/", action: "RUN FILTER" },
  { no: "003", name: "LIVING TICKER", state: "PROTOTYPE", family: "SEE", line: "Minutes record words. The ticker records movement.", why: "Tracks challenge, reframing, ownership and rupture while a room is changing." },
  { no: "004", name: "DECISION MEMORY", state: "PROTOTYPE", family: "ARTIFACT", line: "A forgotten decision must win its argument again.", why: "Preserves the evidence, assumptions and reversals that created a decision.", href: "/decision-memory/", action: "OPEN MEMORY" },
  { no: "005", name: "CTRL+SWAT", state: "FIELD TEST", family: "MOVE", line: "Detect. Judge. Build. Dispatch before the moment disappears.", why: "A rapid-response instrument for situations where strategic latency is the problem.", href: "/swat/", action: "ENTER SWAT" },
  { no: "006", name: "CTRL+FIZZ", state: "PROTOTYPE", family: "ARTIFACT", line: "Carbonated judgment for meetings that have gone flat.", why: "A physical reminder that perspective sometimes changes faster when the object changes.", href: "/fizz/", action: "OPEN BOTTLE" },
  { no: "007", name: "SIGNAL FIRE", state: "PROTOTYPE", family: "SEE", line: "Weak signals before they become obvious opportunities.", why: "Maps pressure, incumbent weakness and decision gaps before the market names them." },
  { no: "008", name: "POLICY PRISM", state: "PROTOTYPE", family: "TEST", line: "What happens after the policy meets behaviour?", why: "Separates stated intent from second-order effects and likely human response." },
  { no: "009", name: "PROMPT SHOPPE", state: "WORKING", family: "MOVE", line: "A prompt without a decision is decoration.", why: "Tunes instructions by finding the real judgment hidden inside them.", href: "/prompt-shoppe/", action: "OPEN SHOPPE" },
  { no: "010", name: "FRICTION FINDER", state: "PROTOTYPE", family: "SEE", line: "Find the pothole before blaming the driver.", why: "Separates recurring system friction from the people forced to work around it." },
  { no: "011", name: "HUMAN TEST", state: "FIELD TEST", family: "TEST", line: "Can you still detect lived detail?", why: "A small forensic test for the qualities human writing loses when it becomes generic." },
  { no: "012", name: "MOMENTUM BUILDER", state: "FIELD TEST", family: "MOVE", line: "Make the next useful move smaller than the hesitation.", why: "Built to turn interpretation into an immediate concrete action." },
  { no: "013", name: "DO-NOTHING CONTROL", state: "WORKING", family: "TEST", line: "Change has to beat reality left alone.", why: "Stops action from being treated as automatically wiser than deliberate inaction." },
  { no: "014", name: "OPPOSITION SEAT", state: "WORKING", family: "TEST", line: "Pay someone to disagree.", why: "Makes dissent structural instead of depending on bravery in the room." },
  { no: "015", name: "BLIND TRIAL", state: "WORKING", family: "TEST", line: "Remove the label before judging the thing.", why: "Separates the work from status, authorship and expectation." },
  { no: "016", name: "EVIDENCE TAGGER", state: "PROTOTYPE", family: "SEE", line: "Observed is not the same as assumed.", why: "Makes the source of confidence visible: Observed / Inferred / Assumed / Tested / Proven." },
  { no: "017", name: "MISSING SEAT", state: "PROTOTYPE", family: "SEE", line: "Who lives with the decision but is absent from it?", why: "Surfaces constituencies who inherit the consequences without shaping the choice." },
  { no: "018", name: "CONFLICT CAMERA", state: "IN DEVELOPMENT", family: "SEE", line: "Point it at the disagreement, not the people.", why: "An experimental interface for making competing forces visible in ordinary situations." },
  { no: "019", name: "DECISION IN A BOX", state: "PROTOTYPE", family: "ARTIFACT", line: "Five options enter. One imperfect object leaves.", why: "Turns an abstract decision into something that can be handled, compared and committed to." },
  { no: "020", name: "PURGE", state: "PROTOTYPE", family: "MOVE", line: "Cut the fat. Keep the organ.", why: "A subtraction instrument for seeing exactly what can be removed without damaging the thing that matters.", href: "/purge/", action: "START PURGE" },
  { no: "021", name: "MISS ARCHIVE", state: "ARCHIVE", family: "ARTIFACT", line: "Keep the wrong calls. Extract the lesson.", why: "Stores misses because a laboratory that only displays wins cannot learn." },
  { no: "022", name: "TRAJECTORY / ATLAS / MARIA", state: "IN DEVELOPMENT", family: "ARTIFACT", line: "Map how a decision travels, not only where it ends.", why: "A developing system for human coordination terrain, protocol primitives and decision trajectories.", href: "/maria/", action: "ENTER EXCAVATION 001" },
  { no: "023", name: "CTRL+CHASE", state: "PROTOTYPE", family: "MOVE", line: "A question either produces evidence or earns its death.", why: "Keeps unresolved signals moving until they become evidence, a next move, or a justified stop.", href: "/chase/", action: "START CHASE" },
];

const stateClass: Record<State, string> = {
  WORKING: styles.stateWorking,
  PROTOTYPE: styles.statePrototype,
  "FIELD TEST": styles.stateField,
  ARCHIVE: styles.stateArchive,
  "IN DEVELOPMENT": styles.stateDevelopment,
};

export default function InstrumentRoomPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>ctrl+love</Link>
        <span className={styles.serial}>INSTRUMENT DIVISION · SUNNYVALE · ROOM 001</span>
        <Link href="/factory/" className={styles.exec}>FACTORY: OPEN →</Link>
      </header>

      <section className={styles.arrival} aria-labelledby="instrument-room-title">
        <div className={styles.arrivalCopy}>
          <p className={styles.kicker}>APPLIED INTELLIGENCE / PHYSICAL EVIDENCE</p>
          <h1 id="instrument-room-title">THE<br />INSTRUMENT<br />ROOM</h1>
          <p className={styles.lead}>An unreasonable number of ways to make reality harder to avoid.</p>
        </div>
        <div className={styles.doorway} aria-hidden="true">
          <div className={styles.roomPlate}><span>ROOM</span><strong>001</strong><small>HUMAN JUDGMENT LAB</small></div>
          <div className={styles.window}><span className={styles.bench} /><span className={styles.lamp} /><span className={styles.cabinetSilhouette} /></div>
          <div className={styles.calibration}>
            <Image src="/museum/steel-ball-packshot-cutout.png" alt="" width={118} height={118} priority />
            <span>CALIBRATION MASS<br /><b>40.00 MM</b></span>
          </div>
        </div>
      </section>

      <section className={styles.roomStatus} aria-label="Room status">
        <strong>{instruments.length} SPECIMENS</strong>
        <span>WORKING / TESTING / FAILING / LEARNING</span>
        <span>ONLY REAL DOORS OPEN</span>
      </section>

      <section className={styles.protocolRail} aria-label="Live field evidence">
        <span>LIVE FIELD EVIDENCE</span>
        <strong>MISSION 001 · CTRL+SWAT</strong><b>ROYAL SWINKELS · DISPATCHED</b><strong>≈12 MIN DETECTION → INBOX</strong><Link href="/swat/">OPEN FIELD RECORD ↗</Link>
      </section>

      <section className={styles.floor} aria-label="ctrl+love instrument collection">
        <div className={styles.wallLabel}><span>INSTRUMENTS</span><small>RUN THEM. PRESS THEM. DISAGREE WITH THEM.</small></div>
        <div className={styles.specimenWall}>
          {instruments.filter((item) => item.family !== "ARTIFACT").map((instrument) => (
            <details className={styles.specimen} key={instrument.no}>
              <summary>
                <div className={styles.specimenTop}>
                  <span className={styles.number}>{instrument.no}</span>
                  <span className={`${styles.state} ${stateClass[instrument.state]}`}>{instrument.state}</span>
                </div>
                <div className={styles.device} data-family={instrument.family}>
                  <span className={styles.deviceScreen}>{instrument.family}</span>
                  <span className={styles.dial} />
                  <span className={styles.switch} />
                  <span className={styles.slot} />
                  <LivingInstrumentState no={instrument.no} state={instrument.state} family={instrument.family} />
                </div>
                <h2>{instrument.name}</h2>
                <p>{instrument.line}</p>
                <span className={styles.pull}>PULL TO INSPECT</span>
              </summary>
              <div className={styles.drawer}>
                <div><span>WHY IT EXISTS</span><p>{instrument.why}</p></div>
                {instrument.href ? <Link href={instrument.href}>{instrument.action ?? "OPEN"} ↗</Link> : <span className={styles.noDoor}>NO PUBLIC DOOR YET</span>}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.archiveZone} aria-label="Artifacts and archive">
        <div className={styles.wallLabel}><span>ARTIFACT BAY</span><small>OBJECTS, TRACES, MISSES, THINGS THAT REFUSED TO DISAPPEAR.</small></div>
        <div className={styles.artifactBench}>
          {instruments.filter((item) => item.family === "ARTIFACT" && item.name !== "MISS ARCHIVE").map((instrument) => (
            <details className={styles.artifact} key={instrument.no}>
              <summary><span>{instrument.no} · {instrument.state}</span><strong>{instrument.name}</strong><p>{instrument.line}</p></summary>
              <div><p>{instrument.why}</p>{instrument.href ? <Link href={instrument.href}>{instrument.action ?? "OPEN"} ↗</Link> : <span>SPECIMEN HELD IN LAB</span>}</div>
            </details>
          ))}
          <details className={styles.missArchive}>
            <summary><span>021 · ARCHIVE CABINET</span><strong>MISS ARCHIVE</strong><p>Wrong calls kept on purpose.</p><i aria-hidden="true" /></summary>
            <div><p>A laboratory that only displays wins cannot learn. Failed predictions, missed signals and conclusions we later changed belong here.</p><span>ARCHIVE / INTERNAL EVIDENCE</span></div>
          </details>
        </div>
      </section>

      <section className={styles.protocolRail} aria-label="Foundational protocols">
        <span>FOUNDATIONAL RAIL</span>
        <strong>OPPOSITION SEAT</strong><b>DO-NOTHING CONTROL</b><strong>BLIND TRIAL</strong><b>EVIDENCE TAGS</b><strong>KILL QUESTION</strong>
      </section>

      <footer className={styles.footer}><p>Observe. Understand. Judge. Remain human.</p><Link href="/factory/">ENTER FACTORY ↗</Link></footer>
    </main>
  );
}
