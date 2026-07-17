"use client";

import { useEffect, useRef, useState } from "react";

import {
  dispatchSoundtrackStatus,
  neutralWorldEmotionState,
  type WorldEmotionState,
  WORLD_EMOTION_EVENT,
} from "./world-emotion-engine";

const SOUNDTRACK_URL = "/audio/open-arms-drift-v2.wav";
const STORAGE_KEY = "ctrl-love-soundtrack-muted";
const BASE_VOLUME = 0.12;

type AudioState = "idle" | "loading" | "playing" | "muted" | "unavailable";

function readMutedPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function getAudioContext() {
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  return AudioContextClass ? new AudioContextClass() : null;
}

export function BackgroundSoundtrack() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lowShelfRef = useRef<BiquadFilterNode | null>(null);
  const lowPassRef = useRef<BiquadFilterNode | null>(null);
  const panRef = useRef<StereoPannerNode | null>(null);
  const targetEmotionRef = useRef<WorldEmotionState>(neutralWorldEmotionState);
  const currentEmotionRef = useRef<WorldEmotionState>(neutralWorldEmotionState);
  const playingRef = useRef(false);
  const hiddenRef = useRef(false);
  const [audioState, setAudioState] = useState<AudioState>(() => {
    if (typeof window === "undefined") {
      return "muted";
    }

    return readMutedPreference() ? "muted" : "idle";
  });

  function setupAudioGraph(audio: HTMLAudioElement) {
    if (sourceRef.current) {
      return contextRef.current;
    }

    const context = getAudioContext();
    if (!context) {
      return null;
    }

    const source = context.createMediaElementSource(audio);
    const lowShelf = context.createBiquadFilter();
    const lowPass = context.createBiquadFilter();
    const gain = context.createGain();
    const pan =
      "createStereoPanner" in context ? context.createStereoPanner() : null;

    lowShelf.type = "lowshelf";
    lowShelf.frequency.value = 120;
    lowShelf.gain.value = 0;
    lowPass.type = "lowpass";
    lowPass.frequency.value = 11200;
    lowPass.Q.value = 0.4;
    gain.gain.value = 0;

    source.connect(lowShelf);
    lowShelf.connect(lowPass);
    if (pan) {
      lowPass.connect(pan);
      pan.connect(gain);
    } else {
      lowPass.connect(gain);
    }
    gain.connect(context.destination);

    contextRef.current = context;
    sourceRef.current = source;
    gainRef.current = gain;
    lowShelfRef.current = lowShelf;
    lowPassRef.current = lowPass;
    panRef.current = pan;

    return context;
  }

  function applyEmotionToGraph(state: WorldEmotionState) {
    const context = contextRef.current;
    if (!context) {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = hiddenRef.current ? 0.03 : BASE_VOLUME;
      }
      return;
    }

    const intensity =
      state.energy * 0.34 +
      state.warmth * 0.18 +
      state.curiosity * 0.18 +
      state.playfulness * 0.12 +
      state.calm * 0.18;
    const volume = hiddenRef.current
      ? 0.025
      : BASE_VOLUME + Math.min(0.035, intensity * 0.035);
    const lowGain = -0.8 + state.energy * 1.6 + state.focus * 0.45;
    const cutoff = 9200 + state.curiosity * 2400 + state.calm * 1200;
    const pan = (state.playfulness - state.focus) * 0.035;
    const now = context.currentTime;

    lowShelfRef.current?.gain.setTargetAtTime(lowGain, now, 2.8);
    lowPassRef.current?.frequency.setTargetAtTime(cutoff, now, 4.2);
    panRef.current?.pan.setTargetAtTime(pan, now, 3.4);

    if (playingRef.current) {
      gainRef.current?.gain.setTargetAtTime(volume, now, 3.2);
    }
  }

  async function startSoundtrack() {
    if (audioState === "playing" || audioState === "loading") {
      return;
    }

    setAudioState("loading");

    try {
      const audio = audioRef.current;
      if (!audio) {
        setAudioState("unavailable");
        return;
      }

      audio.loop = true;
      audio.muted = false;
      audio.volume = BASE_VOLUME;
      const context = setupAudioGraph(audio);
      if (context?.state === "suspended") {
        await context.resume();
      }

      await audio.play();

      playingRef.current = true;
      applyEmotionToGraph(currentEmotionRef.current);
      const gain = gainRef.current;
      if (gain && context) {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.setValueAtTime(0, context.currentTime);
        gain.gain.linearRampToValueAtTime(BASE_VOLUME, context.currentTime + 3);
      }

      try {
        localStorage.setItem(STORAGE_KEY, "false");
      } catch {}

      dispatchSoundtrackStatus(true);
      setAudioState("playing");
    } catch {
      playingRef.current = false;
      dispatchSoundtrackStatus(false);
      setAudioState("idle");
    }
  }

  function stopSoundtrack() {
    const audio = audioRef.current;
    const context = contextRef.current;
    const gain = gainRef.current;

    playingRef.current = false;
    dispatchSoundtrackStatus(false);

    if (gain && context) {
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + 2.4);
      window.setTimeout(() => {
        if (!playingRef.current) {
          audio?.pause();
        }
      }, 2500);
    } else if (audio) {
      audio.pause();
    }

    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}

    setAudioState("muted");
  }

  function toggleSoundtrack() {
    if (audioState === "playing") {
      stopSoundtrack();
      return;
    }

    void startSoundtrack();
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = BASE_VOLUME;

    const handleError = () => setAudioState("unavailable");
    const handleEnded = () => setAudioState("muted");
    const handleEmotion = (event: Event) => {
      const customEvent = event as CustomEvent<WorldEmotionState>;
      targetEmotionRef.current = customEvent.detail ?? neutralWorldEmotionState;
    };
    const handleVisibility = () => {
      hiddenRef.current = document.visibilityState === "hidden";
      applyEmotionToGraph(currentEmotionRef.current);
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);
    window.addEventListener(WORLD_EMOTION_EVENT, handleEmotion);
    document.addEventListener("visibilitychange", handleVisibility);

    let frame = 0;
    let previousTime = performance.now();

    function animateEmotion(time: number) {
      const deltaSeconds = Math.max(0.001, (time - previousTime) / 1000);
      previousTime = time;
      const amount = 1 - Math.exp(-deltaSeconds / 34);
      const current = currentEmotionRef.current;
      const target = targetEmotionRef.current;
      currentEmotionRef.current = {
        energy: lerp(current.energy, target.energy, amount),
        warmth: lerp(current.warmth, target.warmth, amount),
        focus: lerp(current.focus, target.focus, amount),
        curiosity: lerp(current.curiosity, target.curiosity, amount),
        playfulness: lerp(current.playfulness, target.playfulness, amount),
        calm: lerp(current.calm, target.calm, amount),
      };

      applyEmotionToGraph(currentEmotionRef.current);
      frame = window.requestAnimationFrame(animateEmotion);
    }

    frame = window.requestAnimationFrame(animateEmotion);

    return () => {
      playingRef.current = false;
      dispatchSoundtrackStatus(false);
      window.cancelAnimationFrame(frame);
      audio.pause();
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
      window.removeEventListener(WORLD_EMOTION_EVENT, handleEmotion);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const isPlaying = audioState === "playing";
  const isLoading = audioState === "loading";
  const buttonLabel =
    audioState === "unavailable"
      ? "Sound unavailable"
      : isPlaying
        ? "Sound on"
        : isLoading
          ? "Loading sound"
          : "Sound off";

  return (
    <>
      <audio ref={audioRef} src={SOUNDTRACK_URL} preload="none" />
      <button
        className="soundtrack-toggle"
        type="button"
        aria-label={isPlaying ? "Mute background soundtrack" : "Play background soundtrack"}
        aria-pressed={isPlaying}
        disabled={audioState === "unavailable"}
        onClick={toggleSoundtrack}
        title="The soundtrack evolves with the world’s emotional climate."
      >
        <span className="soundtrack-toggle__mark" aria-hidden="true">
          {isPlaying ? "♪" : isLoading ? "…" : "×"}
        </span>
        <span className="soundtrack-toggle__label">{buttonLabel}</span>
      </button>
    </>
  );
}
