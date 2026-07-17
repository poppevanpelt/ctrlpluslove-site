"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SOUNDTRACK_URL = "/audio/open-arms-drift-v2.m4a";
const STORAGE_KEY = "ctrl-love-soundtrack-muted";
const VOLUME = 0.14;

type AudioState = "idle" | "loading" | "playing" | "muted" | "unavailable";

function readMutedPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return true;
  }
}

export function BackgroundSoundtrack() {
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const loadingRef = useRef<Promise<AudioBuffer> | null>(null);
  const [audioState, setAudioState] = useState<AudioState>(() => {
    if (typeof window === "undefined") {
      return "idle";
    }

    return readMutedPreference() ? "muted" : "idle";
  });

  const loadBuffer = useCallback(async (context: AudioContext) => {
    if (bufferRef.current) {
      return bufferRef.current;
    }

    if (!loadingRef.current) {
      loadingRef.current = fetch(SOUNDTRACK_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Soundtrack unavailable");
          }

          return response.arrayBuffer();
        })
        .then((arrayBuffer) => context.decodeAudioData(arrayBuffer));
    }

    bufferRef.current = await loadingRef.current;
    return bufferRef.current;
  }, []);

  const startSoundtrack = useCallback(async () => {
    if (audioState === "playing" || audioState === "loading") {
      return;
    }

    setAudioState("loading");

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const context = contextRef.current ?? new AudioContextClass();
      contextRef.current = context;

      if (context.state === "suspended") {
        await context.resume();
      }

      const buffer = await loadBuffer(context);
      sourceRef.current?.stop();

      const source = context.createBufferSource();
      const gain = context.createGain();
      gain.gain.value = VOLUME;
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain).connect(context.destination);
      source.start();

      sourceRef.current = source;
      gainRef.current = gain;

      try {
        localStorage.setItem(STORAGE_KEY, "false");
      } catch {}

      setAudioState("playing");
    } catch {
      setAudioState("unavailable");
    }
  }, [audioState, loadBuffer]);

  const stopSoundtrack = useCallback(() => {
    sourceRef.current?.stop();
    sourceRef.current = null;
    gainRef.current = null;

    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}

    setAudioState("muted");
  }, []);

  function toggleSoundtrack() {
    if (audioState === "playing") {
      stopSoundtrack();
      return;
    }

    void startSoundtrack();
  }

  useEffect(() => {
    return () => {
      sourceRef.current?.stop();
      contextRef.current?.close();
      sourceRef.current = null;
      contextRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (readMutedPreference()) {
      return;
    }

    function unlockSoundtrack() {
      void startSoundtrack();
    }

    window.addEventListener("pointerdown", unlockSoundtrack, { once: true });
    window.addEventListener("keydown", unlockSoundtrack, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockSoundtrack);
      window.removeEventListener("keydown", unlockSoundtrack);
    };
  }, [startSoundtrack]);

  const isPlaying = audioState === "playing";
  const isLoading = audioState === "loading";

  return (
    <button
      className="soundtrack-toggle"
      type="button"
      aria-label={isPlaying ? "Mute background soundtrack" : "Play background soundtrack"}
      aria-pressed={isPlaying}
      disabled={audioState === "unavailable"}
      onClick={toggleSoundtrack}
    >
      <span aria-hidden="true">{isPlaying ? "♪" : isLoading ? "…" : "◦"}</span>
    </button>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
