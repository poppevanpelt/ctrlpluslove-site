"use client";

import { useEffect, useRef, useState } from "react";

import {
  dispatchSoundtrackStatus,
  neutralWorldEmotionState,
  type WorldEmotionState,
  WORLD_EMOTION_EVENT,
} from "./world-emotion-engine";

const STORAGE_KEY = "ctrl-love-soundtrack-muted";
const OFFICE_SOUNDTRACK_EVENT = "ctrl-love-office-soundtrack-shift";
const BASE_VOLUME = 0.12;
const HIDDEN_VOLUME = 0.025;
const GRAPH_UPDATE_INTERVAL_MS = 150;

const SOUNDTRACK_SOURCES = [
  { src: "/audio/open-arms-drift-v2.webm", type: 'audio/webm; codecs="opus"' },
  { src: "/audio/open-arms-drift-v2.m4a", type: "audio/mp4" },
  { src: "/audio/open-arms-drift-v2.mp3", type: "audio/mpeg" },
  { src: "/audio/open-arms-drift-v2.wav", type: "audio/wav" },
] as const;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTargetVolume(state: WorldEmotionState, isHidden: boolean) {
  if (isHidden) {
    return HIDDEN_VOLUME;
  }

  const intensity =
    state.energy * 0.34 +
    state.warmth * 0.18 +
    state.curiosity * 0.18 +
    state.playfulness * 0.12 +
    state.calm * 0.18;

  return BASE_VOLUME + Math.min(0.035, intensity * 0.035);
}

function getOfficeAdjustedVolume(
  state: WorldEmotionState,
  isHidden: boolean,
  officeDensity: number,
) {
  return getTargetVolume(state, isHidden) * clamp(officeDensity, 0.42, 1.14);
}

function getAudioContext() {
  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  return AudioContextClass ? new AudioContextClass() : null;
}

function holdParamAtNow(param: AudioParam, now: number) {
  const paramWithHold = param as AudioParam & {
    cancelAndHoldAtTime?: (time: number) => AudioParam;
  };

  if (typeof paramWithHold.cancelAndHoldAtTime === "function") {
    paramWithHold.cancelAndHoldAtTime(now);
    return;
  }

  const currentValue = param.value;
  param.cancelScheduledValues(now);
  param.setValueAtTime(currentValue, now);
}

function setSmoothedParam(
  param: AudioParam | undefined,
  target: number,
  now: number,
  timeConstant: number,
) {
  if (!param) {
    return;
  }

  holdParamAtNow(param, now);
  param.setTargetAtTime(target, now, timeConstant);
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
  const officeDensityRef = useRef(1);
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
      audio.volume = 1;
      return contextRef.current;
    }

    const context = getAudioContext();
    if (!context) {
      return null;
    }

    audio.volume = 1;

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

  function applyEmotionToGraph(
    state: WorldEmotionState,
    options: { updateGain?: boolean } = {},
  ) {
    const shouldUpdateGain = options.updateGain ?? true;
    const context = contextRef.current;
    if (!context) {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = getOfficeAdjustedVolume(
          state,
          hiddenRef.current,
          officeDensityRef.current,
        );
      }
      return;
    }

    const officeDensity = officeDensityRef.current;
    const volume = getOfficeAdjustedVolume(state, hiddenRef.current, officeDensity);
    const lowGain = clamp(
      -1.2 + state.energy * 2.4 + state.focus * 0.6 + (officeDensity - 1) * 0.7,
      -1.2,
      1.8,
    );
    const cutoff = clamp(
      7600 + state.curiosity * 3600 + state.calm * 1500 + (officeDensity - 1) * 900,
      7200,
      12700,
    );
    const pan = clamp((state.playfulness - state.focus) * 0.07, -0.07, 0.07);
    const now = context.currentTime;

    if (audioRef.current) {
      audioRef.current.volume = 1;
    }
    setSmoothedParam(lowShelfRef.current?.gain, lowGain, now, 2.8);
    setSmoothedParam(lowPassRef.current?.frequency, cutoff, now, 4.2);
    setSmoothedParam(panRef.current?.pan, pan, now, 3.4);

    if (playingRef.current && shouldUpdateGain) {
      setSmoothedParam(gainRef.current?.gain, volume, now, 3.2);
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
      const context = setupAudioGraph(audio);
      const targetVolume = getOfficeAdjustedVolume(
        currentEmotionRef.current,
        hiddenRef.current,
        officeDensityRef.current,
      );

      audio.volume = context ? 1 : targetVolume;
      if (context?.state === "suspended") {
        await context.resume();
      }

      await audio.play();

      playingRef.current = true;
      const gain = gainRef.current;
      if (gain && context) {
        applyEmotionToGraph(currentEmotionRef.current, { updateGain: false });
        holdParamAtNow(gain.gain, context.currentTime);
        gain.gain.setValueAtTime(0, context.currentTime);
        gain.gain.linearRampToValueAtTime(
          targetVolume,
          context.currentTime + 3,
        );
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
      holdParamAtNow(gain.gain, context.currentTime);
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

    audio.volume = getOfficeAdjustedVolume(
      neutralWorldEmotionState,
      hiddenRef.current,
      officeDensityRef.current,
    );

    const handleError = () => setAudioState("unavailable");
    const handleEnded = () => setAudioState("muted");
    const handleEmotion = (event: Event) => {
      const customEvent = event as CustomEvent<WorldEmotionState>;
      targetEmotionRef.current = customEvent.detail ?? neutralWorldEmotionState;
    };
    const handleOfficeSoundtrack = (event: Event) => {
      const customEvent = event as CustomEvent<{ density?: number }>;
      officeDensityRef.current = clamp(customEvent.detail?.density ?? 1, 0.42, 1.14);
      applyEmotionToGraph(currentEmotionRef.current);
    };
    const handleVisibility = () => {
      hiddenRef.current = document.visibilityState === "hidden";
      applyEmotionToGraph(currentEmotionRef.current);
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);
    window.addEventListener(WORLD_EMOTION_EVENT, handleEmotion);
    window.addEventListener(OFFICE_SOUNDTRACK_EVENT, handleOfficeSoundtrack);
    document.addEventListener("visibilitychange", handleVisibility);

    let frame = 0;
    let previousTime = performance.now();
    let previousGraphUpdate = 0;

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

      if (time - previousGraphUpdate >= GRAPH_UPDATE_INTERVAL_MS) {
        applyEmotionToGraph(currentEmotionRef.current);
        previousGraphUpdate = time;
      }

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
      window.removeEventListener(OFFICE_SOUNDTRACK_EVENT, handleOfficeSoundtrack);
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
      <audio ref={audioRef} preload="none">
        {/* Generate compressed versions from the WAV master for smaller web delivery. */}
        {SOUNDTRACK_SOURCES.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </audio>
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
