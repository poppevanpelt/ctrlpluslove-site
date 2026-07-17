"use client";

import { useEffect, useRef, useState } from "react";

const SOUNDTRACK_URL = "/audio/open-arms-drift-v2.wav";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<AudioState>(() => {
    if (typeof window === "undefined") {
      return "idle";
    }

    return readMutedPreference() ? "muted" : "idle";
  });

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

      audio.volume = VOLUME;
      audio.loop = true;
      audio.muted = false;
      await audio.play();

      try {
        localStorage.setItem(STORAGE_KEY, "false");
      } catch {}

      setAudioState("playing");
    } catch {
      setAudioState("idle");
    }
  }

  function stopSoundtrack() {
    const audio = audioRef.current;

    if (audio) {
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

    audio.volume = VOLUME;

    const handleError = () => setAudioState("unavailable");
    const handleEnded = () => setAudioState("muted");

    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
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
      >
        <span className="soundtrack-toggle__mark" aria-hidden="true">
          {isPlaying ? "♪" : isLoading ? "…" : "×"}
        </span>
        <span className="soundtrack-toggle__label">{buttonLabel}</span>
      </button>
    </>
  );
}
