import type { Metadata } from "next";
import Link from "next/link";

import { ObjectStage } from "../object-stage";
import { routeMetadata } from "../seo";
import styles from "./inside-ctrl-love.module.css";

export const metadata: Metadata = routeMetadata("/inside-ctrl-love/");

const departments = [
  {
    name: "Reality Preservation",
    href: "/reality/",
    person: "Cornelis van Loon",
  },
  {
    name: "Unfinished Thoughts",
    href: "/unfinished-thoughts/",
    person: "Nora Veld",
  },
  {
    name: "Necessary Elimination",
    href: "/necessary-elimination/",
    person: "Kill Almost Everything. Apple, 1997.",
  },
  {
    name: "Irreversible Decisions",
    href: "/irreversible-decisions/",
    person: "Burn the Boats. Netflix, 2007.",
  },
  {
    name: "Essential Things",
    href: "/essential-things/",
    person: "Remember the Brick. LEGO, 2004.",
  },
  {
    name: "Consequential Belief",
    href: "/consequential-belief/",
    person: "Mortgage the Heroes. Marvel, 2009.",
  },
];

const instruments = [
  {
    name: "Instrument Cabinet",
    href: "/instruments/",
    note: "The physical family. Ideas enter. Evidence leaves.",
  },
  {
    name: "Decision Collider",
    href: "/decision-collider/",
    note: "Push one decision through collision and judgment.",
  },
  {
    name: "Meeting Filter",
    href: "/meeting-filter/",
    note: "Should this meeting exist?",
  },
  {
    name: "AI-Y-fier",
    href: "/ai-y-fier/",
    note: "Empty thoughts in. Thought leadership out.",
  },
  {
    name: "Out-house",
    href: "/out-house/",
    note: "External pressure for in-house teams. Keep the uncomfortable seat occupied.",
  },
  {
    name: "Live Decision Simulator",
    href: "/living-decision-review/",
    note: "A decision room that thinks in public.",
  },
];

const archive = [
  {
    name: "Museum",
    href: "/museum/",
    note: "Ideas. Artifacts. Consequences.",
  },
  {
    name: "Artifact Registry",
    href: "/artifacts/",
    note: "Objects, consequences and decision folklore.",
  },
  {
    name: "Constitution",
    href: "/constitution/",
    note: "Governance archive.",
  },
];

function LinkGroup({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: Array<{ name: string; href: string; note?: string; person?: string }>;
}) {
  return (
    <section className={styles.group}>
      <div className={styles.groupHead}>
        <span>{label}</span>
        <h2>{title}</h2>
      </div>
      <div className={styles.links}>
        {items.map((item) => (
          <Link className={styles.card} href={item.href} key={item.name}>
            <strong>{item.name} →</strong>
            <span>{item.note ?? item.person}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function InsideCtrlLovePage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/">ctrl+love</Link>
        <span>Sunnyvale / internal directory</span>
        <Link href="/factory/">Factory →</Link>
      </header>

      <ObjectStage
        kicker="Inside ctrl+love / facility directory"
        title="The engine room."
        intro={
          <p>
            Working instruments, internal departments and strange objects that
            earn their place by helping a decision get closer to reality.
          </p>
        }
        annotations={[
          { index: "01", title: "People", body: "Judgment stays attached to somebody." },
          { index: "02", title: "Instruments", body: "Intelligence becomes something you can use." },
          { index: "03", title: "Departments", body: "Different jobs for different kinds of doubt." },
          { index: "04", title: "Archive", body: "Nothing gets to become folklore too quickly." },
        ]}
        object={
          <div className={styles.directoryObject} aria-label="ctrl+love facility directory">
            <div className={styles.directoryHeader}>
              <span>CTRL+LOVE / SUNNYVALE FACILITY</span>
              <b>YOU ARE HERE</b>
            </div>
            <div className={styles.directoryFloors}>
              <div className={styles.floor}>
                <span className={styles.floorNo}>05</span>
                <div><strong>Reality Preservation</strong><small>Keep contact with what is actually happening.</small></div>
                <em>open</em>
              </div>
              <div className={styles.floor}>
                <span className={styles.floorNo}>04</span>
                <div><strong>The Room</strong><small>Human judgment before certainty hardens.</small></div>
                <em>occupied</em>
              </div>
              <div className={styles.floor}>
                <span className={styles.floorNo}>03</span>
                <div><strong>Instrument Lab</strong><small>Decision objects, prototypes and pressure rigs.</small></div>
                <em>live</em>
              </div>
              <div className={styles.floor}>
                <span className={styles.floorNo}>02</span>
                <div><strong>Factory</strong><small>Unfinished things enter. Survivors ship.</small></div>
                <em>noisy</em>
              </div>
              <div className={styles.floor}>
                <span className={styles.floorNo}>01</span>
                <div><strong>Museum + Archive</strong><small>Artifacts, consequences and inconvenient memory.</small></div>
                <em>quiet</em>
              </div>
            </div>
            <div className={styles.directoryFooter}>
              <span>Reception: Savannah</span>
              <span>Fire extinguisher: ask Werner</span>
            </div>
          </div>
        }
        readout={{
          label: "FACILITY RULE",
          text: "Every room, object and department needs a job. Otherwise it becomes decoration.",
          note: "No ornamental AI",
        }}
      />

      <div className={styles.content}>
        <LinkGroup label="Working instruments" title="Things that do something." items={instruments} />
        <LinkGroup label="Departments" title="Different ways to refuse easy answers." items={departments} />
        <LinkGroup label="Archive" title="What remains after the room leaves." items={archive} />
      </div>
    </main>
  );
}
