"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./HeroMnemonic.module.css";

const words = [
  ["We", "Not I. Not AI. A collective act."],
  ["build", "Not advise. Make something that works."],
  ["instruments", "Tools with a purpose, not another presentation."],
  ["for", "The hinge. Everything before serves what follows."],
  ["human", "The non-negotiable centre. People stay in charge."],
  ["judgment.", "Not more output. The ability to decide well."]
] as const;

const hidden = [
  ["H", "Hold your assumptions lightly."],
  ["U", "Understand what is actually happening."],
  ["M", "Make room for opposition."],
  ["A", "Ask what the evidence supports."],
  ["N", "Notice what you might be missing."],
  ["S", "Stay human when deciding."]
] as const;

export default function HeroMnemonic() {
  const [selected, setSelected] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [stage, setStage] = useState(-1);
  const [played, setPlayed] = useState(false);
  const refs = useRef<(HTMLButtonElement|null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const [ball, setBall] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("ctrl-love-six-words-seen")) return;
    const id = window.setTimeout(() => { setPlayed(true); setStage(0); sessionStorage.setItem("ctrl-love-six-words-seen", "1"); }, 1800);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    if (stage < 0) return;
    const el = refs.current[stage], box = root.current;
    if (el && box) setBall(el.getBoundingClientRect().left - box.getBoundingClientRect().left + el.offsetWidth / 2);
    const id = window.setTimeout(() => { if (stage === 5) { setStage(-1); setSelected(null); } else setStage(stage + 1); }, stage === 4 ? 1150 : 740);
    return () => clearTimeout(id);
  }, [stage]);
  const current = stage >= 0 ? stage : selected;
  return <div className={styles.root} ref={root}>
    <h1 className={styles.title} data-savannah-handoff-headline="true" aria-label="We build instruments for human judgment.">
      {words.map(([word], i) => <span key={word} className={styles.wrap}><button type="button" ref={el => { refs.current[i] = el; }} className={styles.word} data-active={current === i} aria-label={`${word}: ${words[i][1]}`} aria-pressed={current === i} onClick={() => { setStage(-1); setPlayed(true); setSelected(selected === i ? null : i); }} onMouseEnter={() => { if(stage < 0) setSelected(i); }} onMouseLeave={() => { if(stage < 0) setSelected(null); }}>{word}</button>{i < 5 ? " " : ""}</span>)}
    </h1>
    <div className={styles.rail} aria-hidden="true"><span className={styles.ball} data-visible={stage >= 0} style={{left:ball}} /></div>
    <div className={styles.explain} aria-live="polite">{current === null ? <span className={styles.quiet}>{played ? "Every word has a job." : "Touch a word. Discover its purpose."}</span> : <><span className={styles.number}>0{current + 1} / 06</span>{words[current][1]}</>}</div>
    <button className={styles.secretTrigger} type="button" aria-expanded={reveal} aria-controls="hero-hidden-acrostic" onClick={() => setReveal(!reveal)}><span className={styles.tinyBall} aria-hidden="true" />{reveal ? "Hide the second message" : "There is another message here"} <span aria-hidden="true">{reveal ? "−" : "+"}</span></button>
    {reveal && <div id="hero-hidden-acrostic" className={styles.secret}>
      <div className={styles.secretEyebrow}>SIX LETTERS / ONE REMINDER</div>
      <div className={styles.secretLines}>{hidden.map(([letter,rest])=><div className={styles.secretLine} key={letter}><b>{letter}</b><span>{rest}</span></div>)}</div>
      <p className={styles.secretEnd}>HUMANS. The ones making the call.</p>
    </div>}
  </div>;
}
