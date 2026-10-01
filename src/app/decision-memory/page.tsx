import type { Metadata } from "next";
import Link from "next/link";
import { ObjectStage } from "../object-stage";
import DecisionMemory from "./decision-memory";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Decision Memory | ctrl+love",
  description: "Record why a decision was made, then reopen it when reality answers back.",
};

export default function DecisionMemoryPage() {
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/">ctrl+love</Link>
        <span>INSTRUMENT 004 · ARTIFACT DIVISION</span>
        <Link href="/instruments/">INSTRUMENT ROOM →</Link>
      </header>

      <ObjectStage
        kicker="Decision Memory / working prototype"
        title={<>The decision was recorded.<br />The outcome was not.</>}
        intro={<p>A forgotten decision should not have to win its argument again.</p>}
        annotations={[
          { index: "01", title: "Decision", body: "What did we actually choose?" },
          { index: "02", title: "Evidence", body: "What did we know at the time?" },
          { index: "03", title: "Assumptions", body: "What did we have to believe?" },
          { index: "04", title: "Human owner", body: "Who was responsible for the call?" },
        ]}
        object={
          <div className={styles.memoryObject} aria-label="Decision Memory archival envelope">
            <div className={styles.memoryFlap} />
            <div className={styles.memoryStamp}>FILED / AWAITING REALITY</div>
            <div className={styles.memoryLabel}>
              <span>CTRL+LOVE / DECISION MEMORY</span>
              <b>004</b>
            </div>
            <div className={styles.memoryQuestion}>
              <small>DECISION RECORD</small>
              <strong>WHY DID WE THINK THIS WAS RIGHT?</strong>
            </div>
            <div className={styles.memoryLines}>
              <span>DECISION</span>
              <span>EVIDENCE</span>
              <span>ASSUMPTIONS</span>
              <span>NEXT MOVE</span>
            </div>
            <div className={styles.memoryReality}>
              <span>REALITY ANSWERS HERE</span>
            </div>
          </div>
        }
        readout={{
          label: "ARCHIVAL RULE",
          text: "Record the reasoning now. Reopen the file when reality has had enough time to disagree.",
          note: "Memory before mythology",
        }}
      />

      <DecisionMemory />
    </main>
  );
}
