"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import styles from "./everything-looks-normal.module.css";

type Mode = "ordinary" | "repair";

const scenes = [
  {
    beforeTime: "08:58",
    afterTime: "08:58",
    object: "THE CALENDAR INVITE",
    beforeTitle: "Q4 STRATEGIC ALIGNMENT",
    beforeCopy:
      "Nine people. Sixty minutes. No decision owner. No decision question. Nobody knows what must be true at 10:00 that was not true at 09:00.",
    beforeSignal: "The meeting already exists, so its purpose is treated as proven.",
    afterTitle: "MEETING FILTER",
    afterCopy:
      "The invite is forced to answer one question before it is accepted: what decision must leave the room?",
    afterSignal: "If there is no decision, the meeting dies here.",
    instrument: "MEETING FILTER",
    roomClass: "invite",
  },
  {
    beforeTime: "09:02",
    afterTime: "09:00",
    object: "THE EIGHT CHAIRS",
    beforeTitle: "EVERY EXPECTED PERSON IS HERE",
    beforeCopy:
      "Except the person closest to the problem. One chair remains empty. Nobody asks whose information is missing.",
    beforeSignal: "The missing information often lives with the missing person.",
    afterTitle: "DECISION OWNER",
    afterCopy:
      "One person is named to own the decision. Everyone else now knows why they are in the room.",
    afterSignal: "Attendance stops being a substitute for authority.",
    instrument: "DECISION OWNER",
    roomClass: "chairs",
  },
  {
    beforeTime: "09:06",
    afterTime: "09:03",
    object: "SLIDE 1 OF 47",
    beforeTitle: "THE DECK BEGINS",
    beforeCopy:
      "The first twelve minutes reproduce information everybody already has. The unique information stays on laptops, in notebooks and in people's heads.",
    beforeSignal: "Shared information feels safer, so it gets airtime.",
    afterTitle: "BLIND TRIAL",
    afterCopy:
      "Everyone records an independent read before the most senior voice can shape the room.",
    afterSignal: "Useful disagreement is preserved before consensus starts.",
    instrument: "BLIND TRIAL",
    roomClass: "deck",
  },
  {
    beforeTime: "09:14",
    afterTime: "09:09",
    object: "\"I PERSONALLY THINK B.\"",
    beforeTitle: "THE SENIOR VOICE SPEAKS",
    beforeCopy:
      "Nothing visible changes. But the room now knows where safety is. The next contributions quietly bend toward B.",
    beforeSignal: "Preference arrives before evidence has finished arriving.",
    afterTitle: "MISSING SEAT",
    afterCopy:
      "The room asks who has evidence but no chair. The person closest to the problem joins before the frame hardens.",
    afterSignal: "Absence becomes a design flaw, not a social fact.",
    instrument: "MISSING SEAT",
    roomClass: "senior",
  },
  {
    beforeTime: "09:22",
    afterTime: "09:18",
    object: "THE LAPTOP",
    beforeTitle: "TAB 17 STAYS CLOSED",
    beforeCopy:
      "Someone knows B does not work. The evidence is open on their laptop. They decide the moment has passed.",
    beforeSignal: "A fact can be present in the room and still fail to enter the decision.",
    afterTitle: "OPPOSITION SEAT",
    afterCopy:
      "One person is explicitly asked to make the strongest case against the emerging preference.",
    afterSignal: "Disagreement becomes a role, not a personality defect.",
    instrument: "OPPOSITION SEAT",
    roomClass: "laptop",
  },
  {
    beforeTime: "09:31",
    afterTime: "09:31",
    object: "THE POST-ITS",
    beforeTitle: "\"LET'S OPEN IT UP\"",
    beforeCopy:
      "Thirty-five ideas appear after the preferred direction is already obvious. Somehow they arrange themselves into B.",
    beforeSignal: "Divergence is performed after convergence has already happened.",
    afterTitle: "DO-NOTHING CONTROL",
    afterCopy:
      "The preferred option is forced to beat the control case: what happens if we do nothing?",
    afterSignal: "Action has to earn its existence.",
    instrument: "DO-NOTHING CONTROL",
    roomClass: "postits",
  },
  {
    beforeTime: "09:42",
    afterTime: "09:43",
    object: "\"ARE WE ALIGNED?\"",
    beforeTitle: "EIGHT HEADS NOD",
    beforeCopy:
      "One does not. Nobody notices. Agreement is measured. Understanding is not.",
    beforeSignal: "Silence is counted as consent.",
    afterTitle: "KILL QUESTION",
    afterCopy:
      "Before the decision closes, one question is allowed to kill it: what would have to be true for this to be a bad decision?",
    afterSignal: "Confidence is asked to survive one last collision.",
    instrument: "KILL QUESTION",
    roomClass: "aligned",
  },
  {
    beforeTime: "09:53",
    afterTime: "09:54",
    object: "THE CALENDAR",
    beforeTitle: "\"MAYBE WE SHOULD GET ANOTHER HOUR IN\"",
    beforeCopy:
      "The decision has not happened. Everyone instinctively starts searching for the next meeting.",
    beforeSignal: "Continuation feels easier than conclusion.",
    afterTitle: "DECISION",
    afterCopy:
      "The owner states the decision, the evidence that survived, the opposition that mattered and the next reversible move.",
    afterSignal: "The room leaves six minutes early.",
    instrument: "DECISION",
    roomClass: "calendar",
  },
] as const;

type RoomAudio = {
  context: AudioContext;
  hum: OscillatorNode;
  humGain: GainNode;
};

function playTone(
  context: AudioContext,
  frequency: number,
  delay = 0,
  duration = 0.08,
  level = 0.018,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + delay;
  const end = start + duration;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.02);
}

function playRoomNoise(
  context: AudioContext,
  delay = 0,
  duration = 0.28,
  level = 0.012,
  cutoff = 900,
) {
  const length = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < length; index += 1) {
    const envelope = 1 - index / length;
    data[index] = (Math.random() * 2 - 1) * envelope;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  const start = context.currentTime + delay;

  filter.type = "lowpass";
  filter.frequency.value = cutoff;
  gain.gain.setValueAtTime(level, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(start);
}

export function MeetingExperience() {
  const [mode, setMode] = useState<Mode>("ordinary");
  const [active, setActive] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<RoomAudio | null>(null);

  const scene = scenes[active];
  const isRepair = mode === "repair";
  const time = isRepair ? scene.afterTime : scene.beforeTime;
  const title = isRepair ? scene.afterTitle : scene.beforeTitle;
  const copy = isRepair ? scene.afterCopy : scene.beforeCopy;
  const signal = isRepair ? scene.afterSignal : scene.beforeSignal;

  async function ensureAudio() {
    if (audioRef.current) {
      if (audioRef.current.context.state === "suspended") {
        await audioRef.current.context.resume();
      }
      return audioRef.current;
    }

    const context = new AudioContext();
    const hum = context.createOscillator();
    const humGain = context.createGain();

    hum.type = "sine";
    hum.frequency.value = 50;
    humGain.gain.value = 0.0001;
    hum.connect(humGain);
    humGain.connect(context.destination);
    hum.start();

    audioRef.current = { context, hum, humGain };
    return audioRef.current;
  }

  async function toggleSound() {
    const audio = await ensureAudio();
    const next = !soundOn;
    const now = audio.context.currentTime;

    audio.humGain.gain.cancelScheduledValues(now);
    audio.humGain.gain.setValueAtTime(Math.max(audio.humGain.gain.value, 0.0001), now);
    audio.humGain.gain.exponentialRampToValueAtTime(next ? 0.0032 : 0.0001, now + 0.22);

    if (next) {
      playTone(audio.context, 659, 0.02, 0.055, 0.012);
    }

    setSoundOn(next);
  }

  useEffect(() => {
    if (!soundOn || !audioRef.current) return;

    const { context } = audioRef.current;

    if (!isRepair && scene.roomClass === "laptop") {
      playRoomNoise(context, 0, 0.09, 0.006, 1600);
      playTone(context, 180, 0.025, 0.04, 0.006);
    }

    if (!isRepair && scene.roomClass === "calendar") {
      playTone(context, 880, 0, 0.07, 0.016);
      playTone(context, 1174, 0.11, 0.08, 0.014);
    }

    if (isRepair && scene.roomClass === "calendar") {
      playRoomNoise(context, 0, 0.42, 0.01, 650);
      playRoomNoise(context, 0.18, 0.34, 0.008, 520);
    }
  }, [active, isRepair, scene.roomClass, soundOn]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        audio.hum.stop();
      } catch {
        // It may already be stopped by the browser.
      }
      void audio.context.close();
    };
  }, []);

  function advance() {
    setActive((current) => Math.min(current + 1, scenes.length - 1));
  }

  function rewind() {
    setActive((current) => Math.max(current - 1, 0));
  }

  function runAgain() {
    setMode("repair");
    setActive(0);
    document.getElementById("meeting")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className={styles.page} id="main-content">
      <section className={styles.intro} aria-labelledby="normal-title">
        <div className={styles.topline}>
          <Link href="/">ctrl+love</Link>
          <span>FIELD OBJECT 025</span>
          <span>COMPOSITE MEETING / ILLUSTRATIVE</span>
          <button
            className={styles.soundToggle}
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
          >
            <i aria-hidden="true" />
            ROOM SOUND {soundOn ? "ON" : "OFF"}
          </button>
        </div>

        <div className={styles.introClock}>08:58</div>
        <div className={styles.introCopy}>
          <p className={styles.eyebrow}>A PERFECTLY ORDINARY MEETING</p>
          <h1 id="normal-title">EVERYTHING<br />LOOKS NORMAL.</h1>
          <p className={styles.lead}>
            Sixty-six minutes. Nine people. Forty-seven slides.
            <br />
            Nothing goes wrong.
          </p>
          <a className={styles.enter} href="#meeting">
            ENTER THE MEETING ↓
          </a>
        </div>

        <p className={styles.introNote}>
          The room is fictional. The habits are not.
        </p>
      </section>

      <section
        className={styles.experience + " " + (isRepair ? styles.repair : styles.ordinary)}
        id="meeting"
        aria-labelledby="meeting-title"
      >
        <div className={styles.experienceHeader}>
          <div>
            <span>{isRepair ? "SECOND RUN / INTERVENTION" : "FIRST RUN / ORDINARY"}</span>
            <strong id="meeting-title">
              {isRepair ? "THE SAME ROOM. DIFFERENT RULES." : "NOTHING APPEARS TO BE WRONG."}
            </strong>
          </div>
          <div className={styles.headerTools}>
            <span>{String(active + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</span>
            <button
              className={styles.soundToggle}
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
            >
              <i aria-hidden="true" />
              SOUND {soundOn ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        <div className={styles.experienceGrid}>
          <div className={styles.roomWrap}>
            <div className={styles.room + " " + styles[scene.roomClass]}>
              <div className={styles.roomCeiling} aria-hidden="true" />
              <div className={styles.screen} aria-hidden="true">
                <span>{isRepair ? scene.instrument : active === 2 ? "01 / 47" : "Q4"}</span>
                <strong>{isRepair ? "DECISION IN PROGRESS" : "STRATEGIC ALIGNMENT"}</strong>
              </div>
              <div className={styles.clock} aria-live="polite">{time}</div>

              <div className={styles.roomEvidence} aria-hidden="true">
                <div className={styles.inviteCard}>
                  <span>CALENDAR</span>
                  <strong>Q4 STRATEGIC ALIGNMENT</strong>
                  <small>09:00–10:00 · 9 accepted</small>
                  <em>{isRepair ? "DECISION: GO / NO-GO ON B" : "No agenda attached"}</em>
                </div>

                <div className={styles.missingPlacard}>
                  <span>{isRepair ? "SEAT ADDED" : "NOT INVITED"}</span>
                  <strong>{isRepair ? "THE PERSON WITH THE EVIDENCE" : "?"}</strong>
                </div>

                <div className={styles.deckCounter}>
                  <span>POWERPOINT</span>
                  <strong>{isRepair ? "1" : "47"}</strong>
                  <small>{isRepair ? "question" : "slides"}</small>
                </div>

                <div className={styles.seniorBubble}>
                  <span>09:14</span>
                  <strong>{isRepair ? "WRITE FIRST." : "I PERSONALLY THINK B."}</strong>
                </div>

                <div className={styles.tabSeventeen}>
                  <span>TAB 17</span>
                  <strong>{isRepair ? "OPEN" : "B DOESN'T WORK"}</strong>
                  <small>{isRepair ? "entered into discussion" : "last viewed 09:21"}</small>
                </div>

                <div className={styles.alignmentMeter}>
                  <span>ALIGNMENT</span>
                  <strong>{isRepair ? "8 + 1 objection" : "8 / 9"}</strong>
                  <small>{isRepair ? "objection recorded" : "marked green"}</small>
                </div>

                <div className={styles.calendarSearch}>
                  <span>{isRepair ? "DECISION LOGGED" : "FIND A TIME"}</span>
                  <strong>{isRepair ? "B / TEST FIRST" : "NEXT WEEK?"}</strong>
                  <small>{isRepair ? "Owner: named · next move: reversible" : "Tue 14:00 · Wed impossible · Thu Lars away"}</small>
                </div>
              </div>

              <div className={styles.table} aria-hidden="true">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span
                    className={styles.seat + (index === 6 ? " " + styles.emptySeat : "")}
                    key={index}
                  />
                ))}
                <div className={styles.laptop}>TAB 17</div>
                <div className={styles.deck}>47</div>
                <div className={styles.postits}>
                  {Array.from({ length: 12 }).map((_, index) => <i key={index}>B</i>)}
                </div>
              </div>
              <div className={styles.roomCaption}>
                <span>{scene.object}</span>
                <span>{isRepair ? "INSTRUMENT ACTIVE" : "NO ALERT"}</span>
              </div>
            </div>
          </div>

          <article className={styles.readout} aria-live="polite">
            <div className={styles.readoutMeta}>
              <span>{time}</span>
              <span>{scene.object}</span>
            </div>
            <h2>{title}</h2>
            <p>{copy}</p>
            <blockquote>{signal}</blockquote>
            {isRepair ? <strong className={styles.instrument}>{scene.instrument} →</strong> : null}
          </article>
        </div>

        <div className={styles.timeline} aria-label="Meeting timeline">
          {scenes.map((item, index) => (
            <button
              className={index === active ? styles.timelineActive : ""}
              key={item.beforeTime}
              onClick={() => setActive(index)}
              type="button"
              aria-label={"Go to " + (isRepair ? item.afterTime : item.beforeTime) + ": " + item.object}
            >
              <span>{isRepair ? item.afterTime : item.beforeTime}</span>
              <i />
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          <button onClick={rewind} disabled={active === 0} type="button">← PREVIOUS</button>
          <span>{scene.object}</span>
          <button onClick={advance} disabled={active === scenes.length - 1} type="button">NEXT →</button>
        </div>
      </section>

      {!isRepair ? (
        <section className={styles.verdict} aria-labelledby="verdict-title">
          <span>10:04</span>
          <p>THE ROOM IS EMPTY.</p>
          <h2 id="verdict-title">NOTHING<br />WENT WRONG.</h2>
          <strong>THAT WAS THE PROBLEM.</strong>
          <div className={styles.scoreboard} aria-label="First run outcome">
            <span><strong>66</strong> minutes</span>
            <span><strong>0</strong> decisions</span>
            <span><strong>1</strong> more meeting</span>
          </div>
          <p className={styles.verdictBody}>
            Most bad decisions do not look bad while they are happening.
            <br />
            They look ordinary.
          </p>
          <button className={styles.runAgain} onClick={runAgain} type="button">
            RUN THE SAME MEETING AGAIN ↻
          </button>
        </section>
      ) : (
        <section className={styles.verdict + " " + styles.repairedVerdict} aria-labelledby="repaired-title">
          <span>09:54</span>
          <p>THE ROOM IS EMPTY.</p>
          <h2 id="repaired-title">DECISION<br />MADE.</h2>
          <strong>SIX MINUTES EARLY.</strong>
          <div className={styles.scoreboard} aria-label="Second run outcome">
            <span><strong>56</strong> minutes</span>
            <span><strong>1</strong> decision</span>
            <span><strong>0</strong> follow-up meetings</span>
          </div>
          <p className={styles.verdictBody}>
            ctrl+love does not make meetings more interesting.
            <br />
            It gives decisions something to survive.
          </p>
          <Link className={styles.runAgain} href="/instruments/">
            ENTER THE INSTRUMENT ROOM →
          </Link>
        </section>
      )}

      <section className={styles.evidence} aria-labelledby="evidence-title">
        <div className={styles.evidenceHeading}>
          <span>WHY THIS IS NOT JUST MEETING COMEDY</span>
          <h2 id="evidence-title">THE ROOM HAS RECEIPTS.</h2>
        </div>

        <div className={styles.evidenceGrid}>
          <article>
            <span>01 / SHARED INFORMATION</span>
            <p>
              Research on hidden-profile decisions finds that groups disproportionately discuss information
              everybody already shares while unique information struggles to enter the conversation.
            </p>
            <a href="https://pubmed.ncbi.nlm.nih.gov/21896790/" target="_blank" rel="noreferrer">
              META-ANALYSIS ↗
            </a>
          </article>
          <article>
            <span>02 / EARLY PREFERENCES</span>
            <p>
              Knowing other people&apos;s preferences before discussion can reduce attention to incoming
              information and harm decision quality.
            </p>
            <a href="https://pubmed.ncbi.nlm.nih.gov/20438225/" target="_blank" rel="noreferrer">
              STUDY ↗
            </a>
          </article>
          <article>
            <span>03 / DISSENT</span>
            <p>
              In hidden-profile experiments, dissent improved solution rates by producing more intensive
              and less biased discussion, even when the dissenter did not initially hold the correct answer.
            </p>
            <a href="https://pubmed.ncbi.nlm.nih.gov/17144766/" target="_blank" rel="noreferrer">
              STUDY ↗
            </a>
          </article>
        </div>

        <div className={styles.credit}>
          <p>
            Inspired by the perceptual move in Jordan Dworkin&apos;s{" "}
            <a href="https://ordinaryabundance.com/" target="_blank" rel="noreferrer">
              Ordinary Abundance ↗
            </a>
            : making the familiar visible again. This is an independent ctrl+love experiment about the
            decision habits work has taught us not to notice.
          </p>
          <Link href="/">CTRL+LOVE / SHORTCUT TO REALITY →</Link>
        </div>
      </section>
    </main>
  );
}
