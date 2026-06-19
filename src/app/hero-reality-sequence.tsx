"use client";

import { useEffect, useState } from "react";

const START_PHRASE = "Long route to reality.";
const FINAL_PHRASE = "Shortcut to reality.";

const PHRASES = [
  "Let's not rush this.",
  "Maybe after summer.",
  "We need more research.",
  "The board won't like it.",
  "Interesting.",
  "Let's socialize it first.",
  "Can we make it premium?",
  "We should ask Gen Z.",
  "We need a framework.",
  "It's complicated.",
  "Let's benchmark.",
  "The timing isn't right.",
  "Let's align.",
  "We need consensus.",
  "We should be careful.",
  "That's not how we do things.",
  "Let's revisit next quarter.",
  "Nobody clicked.",
  "Everyone nodded.",
  "Nobody believed it.",
  "Three meetings later.",
  "The customer left.",
  "The deck got bigger.",
  "The idea got smaller.",
  "Seven approvals.",
  "One decision.",
  "Nobody asked the customer.",
  "Everybody liked it.",
  "Monday morning fatigue.",
  "Fear dressed as caution.",
  "Hope dressed as strategy.",
  "A very expensive opinion.",
  "Somebody's pet project.",
  "The loudest person in the room.",
  "The meeting before the meeting.",
  "The deck before the deck.",
  "The strategy about the strategy.",
  "Let's take this offline.",
  "Can we zoom out?",
  "Can we zoom in?",
  "Let's pressure test it.",
  "Let's wait for the data.",
  "Let's ask legal.",
  "Let's ask finance.",
  "Let's ask marketing.",
  "Let's ask everybody.",
  "Politically sensitive.",
  "Startup romanticization.",
  "Innovation theatre.",
  "Purpose inflation.",
  "Consensus management.",
  "Stakeholder gravity.",
];

const GLITCH_CHARACTERS = "#/\\|[]{}<>_—+*?";

function shuffledPhrases() {
  const shuffled = [...PHRASES];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, 14 + Math.floor(Math.random() * 7));
}

function organicDuration() {
  const chance = Math.random();

  if (chance < 0.18) return 50 + Math.floor(Math.random() * 51);
  if (chance < 0.58) return 100 + Math.floor(Math.random() * 101);
  return 400 + Math.floor(Math.random() * 401);
}

function corrupt(phrase: string) {
  return phrase
    .split("")
    .map((character) => {
      if (character === " " || Math.random() > 0.18) return character;
      return GLITCH_CHARACTERS[Math.floor(Math.random() * GLITCH_CHARACTERS.length)];
    })
    .join("");
}

export function HeroRealitySequence() {
  const [display, setDisplay] = useState(START_PHRASE);
  const [phase, setPhase] = useState<"start" | "glitch" | "final">("start");
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => {
        setDisplay(FINAL_PHRASE);
        setPhase("final");
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const phrases = shuffledPhrases();
    const timers: number[] = [];
    let elapsed = 760;

    phrases.forEach((phrase, index) => {
      const duration = organicDuration();
      const corruptionTime = Math.min(72, Math.max(38, duration * 0.34));

      timers.push(
        window.setTimeout(() => {
          setPhase("glitch");
          setDisplay(corrupt(phrase));
          setPulse(index + 1);
        }, elapsed),
      );
      timers.push(window.setTimeout(() => setDisplay(phrase), elapsed + corruptionTime));
      elapsed += duration;
    });

    // A small pocket of silence lets the final line arrive as resolution, not another cut.
    timers.push(
      window.setTimeout(() => {
        setDisplay(FINAL_PHRASE);
        setPhase("final");
      }, elapsed + 260),
    );

    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <h1 className={`hero-line hero-line-${phase}`} aria-label={FINAL_PHRASE}>
      <span
        className="hero-route hero-route-live"
        data-glitch-text={display}
        key={phase === "glitch" ? pulse : phase}
        aria-hidden="true"
      >
        {display}
      </span>
    </h1>
  );
}
