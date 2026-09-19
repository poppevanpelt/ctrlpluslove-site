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
      "Nine people. Sixty minutes. No decision owner. No decision question.",
    beforeSignal: "The meeting exists. Its purpose is therefore treated as proven.",
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
      "Except the person closest to the problem. One chair remains empty.",
    beforeSignal: "The missing information is sitting outside.",
    afterTitle: "MISSING SEAT",
    afterCopy:
      "Before discussion starts, the room asks one thing: who knows something we do not?",
    afterSignal: "The missing person enters before the frame hardens.",
    instrument: "MISSING SEAT",
    roomClass: "chairs",
  },
  {
    beforeTime: "09:06",
    afterTime: "09:03",
    object: "SLIDE 1 OF 47",
    beforeTitle: "THE DECK BEGINS",
    beforeCopy:
      "Twelve minutes reproduce what everybody already knows. The unique information waits.",
    beforeSignal: "Shared information sounds like progress.",
    afterTitle: "SIGNAL DISTORTION",
    afterCopy:
      "Shared information is compressed. Unique information goes first.",
    afterSignal: "The room hears what only one person knows.",
    instrument: "SIGNAL DISTORTION",
    roomClass: "deck",
  },
  {
    beforeTime: "09:14",
    afterTime: "09:09",
    object: "\"I PERSONALLY THINK B.\"",
    beforeTitle: "THE SENIOR VOICE SPEAKS",
    beforeCopy:
      "Nothing visible changes. The next contributions quietly bend toward B.",
    beforeSignal: "Preference arrived before the evidence finished arriving.",
    afterTitle: "BLIND TRIAL",
    afterCopy:
      "Everybody writes before anybody declares a preference.",
    afterSignal: "Agreement can no longer arrive first.",
    instrument: "BLIND TRIAL",
    roomClass: "senior",
  },
  {
    beforeTime: "09:22",
    afterTime: "09:18",
    object: "THE LAPTOP",
    beforeTitle: "TAB 17 STAYS CLOSED",
    beforeCopy:
      "Someone knows B does not work. The evidence is open. They say nothing.",
    beforeSignal: "The fact is in the room. The decision never receives it.",
    afterTitle: "OPPOSITION SEAT",
    afterCopy:
      "One person is asked to make the strongest case against B.",
    afterSignal: "Disagreement becomes a job, not a social risk.",
    instrument: "OPPOSITION SEAT",
    roomClass: "laptop",
  },
  {
    beforeTime: "09:31",
    afterTime: "09:31",
    object: "THE POST-ITS",
    beforeTitle: "\"LET'S OPEN IT UP\"",
    beforeCopy:
      "Thirty-five ideas appear after B is already obvious. Somehow they become B.",
    beforeSignal: "Divergence is performed after convergence.",
    afterTitle: "DO-NOTHING CONTROL",
    afterCopy:
      "B must beat one awkward alternative: do nothing.",
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
      "One does not. Nobody notices.",
    beforeSignal: "Silence is counted as consent.",
    afterTitle: "KILL QUESTION",
    afterCopy:
      "One question gets permission to kill B: what would have to be true for this to be a bad decision?",
    afterSignal: "Confidence gets one last collision.",
    instrument: "KILL QUESTION",
    roomClass: "aligned",
  },
  {
    beforeTime: "09:53",
    afterTime: "09:54",
    object: "THE CALENDAR",
    beforeTitle: "\"MAYBE WE SHOULD GET ANOTHER HOUR IN\"",
    beforeCopy:
      "No decision. Everyone starts searching for the next meeting.",
    beforeSignal: "Continuation feels easier than conclusion.",
    afterTitle: "DECISION",
    afterCopy:
      "Decision. Evidence. Opposition. Next reversible move.",
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
  const [autoRun, setAutoRun] = useState(false);
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
    if (!isRepair || !autoRun) return;
    if (active >= scenes.length - 1) {
      setAutoRun(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setActive((current) => Math.min(current + 1, scenes.length - 1));
    }, 1550);

    return () => window.clearTimeout(timeout);
  }, [active, autoRun, isRepair]);

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
    setAutoRun(false);
    setActive((current) => Math.min(current + 1, scenes.length - 1));
  }

  function rewind() {
    setAutoRun(false);
    setActive((current) => Math.max(current - 1, 0));
  }

  function runAgain() {
    setMode("repair");
    setActive(0);
    setAutoRun(true);
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
            {isRepair ? (
              <span className={styles.autoRunState}>{autoRun ? "AUTO RUN" : "MANUAL"}</span>
            ) : null}
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
              onClick={() => {
                setAutoRun(false);
                setActive(index);
              }}
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

      <section className={styles.evidence} aria-label="Evidence and provenance">
        <details className={styles.receipts}>
          <summary>
            <span>SHOW RECEIPTS</span>
            <strong>THE ROOM HAS EVIDENCE.</strong>
          </summary>

          <div className={styles.evidenceGrid}>
            <article>
              <span>01 / SHARED INFORMATION</span>
              <p>
                Groups disproportionately discuss information everybody already shares while unique information
                struggles to enter the conversation.
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
                Dissent improved solution rates through more intensive and less biased discussion, even when
                the dissenter did not initially hold the correct answer.
              </p>
              <a href="https://pubmed.ncbi.nlm.nih.gov/17144766/" target="_blank" rel="noreferrer">
                STUDY ↗
              </a>
            </article>
          </div>
        </details>

        <div className={styles.credit}>
          <p>
            Inspired by the perceptual move in Jordan Dworkin&apos;s{" "}
            <a href="https://ordinaryabundance.com/" target="_blank" rel="noreferrer">
              Ordinary Abundance ↗
            </a>
            : making the familiar visible again. An independent ctrl+love experiment about the
            decision habits work has taught us not to notice.
          </p>
          <Link href="/">CTRL+LOVE / SHORTCUT TO REALITY →</Link>
        </div>
      </section>
    </main>
  );
}
