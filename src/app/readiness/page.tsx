"use client";

import { useMemo, useState } from "react";
import styles from "./readiness.module.css";

const questions = [
  { name:"Clarity", prompt:"When a consequential decision lands on the table, what happens first?", options:["We debate solutions before agreeing what the decision is.","Someone frames the problem, but the desired outcome remains fuzzy.","We define the decision, owner and success criteria before exploring solutions.","We explicitly agree what is being decided, what is not, and what evidence would change our minds."], cue:"Name the actual decision before searching for answers.", tool:"Decision Accelerator" },
  { name:"Evidence", prompt:"How do you know the evidence supporting a decision is sound?", options:["A convincing presentation is usually enough.","We cite evidence, though its provenance is rarely challenged.","We distinguish verified facts from assumptions and anecdotes.","We tag evidence quality, test contradictions and document what remains unknown."], cue:"Separate a strong story from a strong signal.", tool:"Signal Distortion" },
  { name:"Opposition", prompt:"What happens when someone disagrees with the preferred direction?", options:["They usually keep it to themselves.","They can speak up, but it rarely changes the direction.","We actively invite disagreement before committing.","A protected opposition role must make the strongest case against the favoured option."], cue:"Give disagreement a formal seat.", tool:"Opposition Seat" },
  { name:"Speed", prompt:"How quickly do important decisions become action?", options:["They regularly return to another meeting.","We make decisions but implementation frequently stalls.","Decisions have owners, deadlines and a next action.","We distinguish reversible from irreversible calls and move at the speed each deserves."], cue:"Turn the meeting into a move.", tool:"Meeting Filter" },
  { name:"Ownership", prompt:"Who is accountable after a decision is made?", options:["It is usually unclear.","The team shares responsibility, which can blur ownership.","One person owns the decision and next step.","One named owner records rationale, conditions for reversal and a review date."], cue:"Give the decision a name and an owner.", tool:"Decision Memory" },
  { name:"Alternatives", prompt:"How seriously are alternatives considered?", options:["The first plausible answer tends to win.","We compare a shortlist that looks largely alike.","We include materially different approaches.","We compare distinct options against doing nothing, with explicit trade-offs."], cue:"Make the do-nothing option earn its place.", tool:"Do-Nothing Control" },
  { name:"Uncertainty", prompt:"How is uncertainty handled in the room?", options:["We disguise it with confident forecasts.","We acknowledge it, then choose one number anyway.","We express confidence, assumptions and key unknowns.","We identify what would change the decision and design a cheap test for it."], cue:"Expose what you do not yet know.", tool:"Decision Collider" },
  { name:"Learning", prompt:"What happens after decisions prove wrong?", options:["We move on and rarely discuss them.","We occasionally hold a retrospective.","We compare outcomes to our original assumptions.","We keep a searchable record of misses, reversals and what we learned."], cue:"Archive the misses, not just the victories.", tool:"Miss Archive" },
  { name:"Courage", prompt:"Can you stop an idea the organisation loves?", options:["Rarely. Too much has already been invested.","Only when failure becomes impossible to ignore.","Yes, if clear evidence no longer supports it.","Yes. We pre-agree kill criteria and reward stopping when the evidence demands it."], cue:"Measure the willingness to stop.", tool:"PURGE" },
] as const;

type Answer = 0 | 1 | 2 | 3;
export default function ReadinessPage() {
  const [answers, setAnswers] = useState<(Answer | null)[]>(Array(questions.length).fill(null));
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const complete = answers.every(a => a !== null);
  const total = useMemo(() => answers.reduce<number>((sum,a) => sum + (a === null ? 0 : a + 1),0),[answers]);
  const score = Math.round((total / 36) * 100);
  const ranking = questions.map((q,i) => ({...q, value:(answers[i] ?? 0)+1})).sort((a,b)=>a.value-b.value);
  const weakest = ranking.slice(0,3);
  const reportText = "THE DECISION READINESS TEST™ — ctrl+love\nPerceived decision readiness: "+score+"%\nSelf-reported, not independently verified.\n\n"+questions.map((q,i)=>q.name+": "+((answers[i]??0)+1)+"/4").join("\n")+"\n\nPriority areas: "+weakest.map(q=>q.name).join(", ")+".\nA live Reality Check is required to compare perceptions with observed decisions.";
  const reset = () => {setAnswers(Array(questions.length).fill(null));setStep(0);setShowResults(false);};
  const mail = "mailto:poppevanpelt@gmail.com?subject="+encodeURIComponent("Reality Check — Decision Readiness Test")+"&body="+encodeURIComponent("I'd like to test our actual decision readiness.\n\n"+reportText);
  return <main id="main-content" className={styles.page}>
    <div className={styles.top}><a href="/" className={styles.brand}>ctrl<span>+</span>love</a><span>INSTRUMENT / 013</span><span>DECISION INTELLIGENCE</span></div>
    {!showResults ? <section className={styles.stage} aria-labelledby="test-title">
      <div className={styles.eyebrow}>THE DECISION READINESS TEST™ <span>· 3 MINUTES · 9 DIMENSIONS</span></div>
      <h1 id="test-title">{step===0 ? <>You may be ready for AI.<br/><em>Are you ready to decide?</em></> : <>{questions[step-1].name}<span className={styles.period}>.</span></>}</h1>
      {step===0 ? <><p className={styles.lead}>Most AI assessments measure technology, adoption and ambition. This one asks a less comfortable question: how good is your organisation at making decisions?</p><p className={styles.small}>Nine questions. One honest self-assessment. No email required. No artificial certainty.</p><button className={styles.primary} onClick={()=>setStep(1)}>START THE TEST <span>↗</span></button></> :
      <><div className={styles.progress}><span>QUESTION {String(step).padStart(2,"0")} / 09</span><div><i style={{width:(step/9)*100+"%"}}/></div></div>
      <p className={styles.question}>{questions[step-1].prompt}</p>
      <div className={styles.options} role="group" aria-label={questions[step-1].name}>
        {questions[step-1].options.map((choice,i)=><button key={i} className={answers[step-1]===i?styles.selected:styles.option} aria-pressed={answers[step-1]===i} onClick={()=>setAnswers(old=>old.map((a,index)=>index===step-1?i as Answer:a))}><span className={styles.letter}>{String.fromCharCode(65+i)}</span><span>{choice}</span><span className={styles.dot}>{answers[step-1]===i?"●":"○"}</span></button>)}
      </div>
      <div className={styles.actions}><button className={styles.back} onClick={()=>setStep(step-1)}>← BACK</button><button className={styles.primary} disabled={answers[step-1]===null} onClick={()=>step===9?setShowResults(true):setStep(step+1)}>{step===9?"REVEAL MY RESULT":"NEXT QUESTION"} <span>↗</span></button></div>
      </>}
    </section> : <section className={styles.results} aria-labelledby="results-title">
      <div className={styles.eyebrow}>THE DECISION READINESS TEST™ / YOUR REPORT</div>
      <h1 id="results-title">What you say.<br/><em>Not yet what you do.</em></h1>
      <div className={styles.scoreline}><div><span className={styles.mini}>PERCEIVED DECISION READINESS</span><div className={styles.score}>{score}<span>%</span></div></div><p>This is a structured summary of your answers, not a validated benchmark or observed performance score. The useful question is what survives contact with reality.</p></div>
      <div className={styles.graph}>{questions.map((q,i)=><div className={styles.barRow} key={q.name}><span>{String(i+1).padStart(2,"0")} / {q.name}</span><div className={styles.track}><div style={{width:(((answers[i]??0)+1)/4)*100+"%"}}/></div><b>{(answers[i]??0)+1}/4</b></div>)}</div>
      <div className={styles.insights}><div><div className={styles.eyebrow}>YOUR THREE STARTING POINTS</div>{weakest.map((q,i)=><div className={styles.insight} key={q.name}><span>0{i+1}</span><div><h2>{q.name}</h2><p>{q.cue}</p><small>RELATED CTRL+LOVE INSTRUMENT: {q.tool}</small></div></div>)}</div><aside><div className={styles.eyebrow}>THE REALITY GAP™</div><h2>Not a number.<br/>Not yet.</h2><p>A questionnaire can show what people believe. Only observing a real decision can show what they actually do.</p><p>In the Reality Check, we observe evidence, disagreement, ownership and movement during a live decision. Then we compare the two.</p><a className={styles.primary} href={mail}>BOOK A REALITY CHECK ↗</a></aside></div>
      <div className={styles.bottomActions}><button onClick={()=>navigator.clipboard?.writeText(reportText)} className={styles.back}>COPY YOUR REPORT ↗</button><button onClick={reset} className={styles.back}>START AGAIN ↺</button></div>
    </section>}
    <footer className={styles.footer}><span>BUILT FOR HUMAN JUDGEMENT.</span><span>OBSERVE → ANALYSE → ACCELERATE.</span><a href="/">BACK TO CTRL+LOVE ↗</a></footer>
  </main>;
}
