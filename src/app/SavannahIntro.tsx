"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-2026.module.css";
import { clearSavannahPageLock } from "./savannah-runtime";

const START_AT = 1.35;
const REGISTER_AT = 6.2;
const DAYLIGHT_AT = 6.9;
const LOCK_AT = 7.6;
const HANDOFF_AT = 8.12;

type SceneStage = "film" | "register" | "daylight" | "locked";

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [stage, setStage] = useState<SceneStage>("film");
  const videoRef = useRef<HTMLVideoElement>(null);
  const bufferTimerRef = useRef<number | null>(null);
  const handoffStarted = useRef(false);
  const lockStarted = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const lockSeatTimerRef = useRef<number | null>(null);
  const lockReleaseTimerRef = useRef<number | null>(null);
  const pivotStartedRef = useRef(false);
  const pivotTimersRef = useRef<number[]>([]);

  const cancelBufferTimer = () => {
    if (bufferTimerRef.current !== null) {
      window.clearTimeout(bufferTimerRef.current);
      bufferTimerRef.current = null;
    }
  };
  const guardBuffering = () => {
    if (handoffStarted.current || !videoRef.current || videoRef.current.paused) return;
    cancelBufferTimer();
    bufferTimerRef.current = window.setTimeout(() => {
      bufferTimerRef.current = null;
      if (!handoffStarted.current && videoRef.current?.paused === false) completeHandoff(false);
    }, 3500);
  };

  const releasePageLock = () => {
    if (lockSeatTimerRef.current !== null) {
      window.clearTimeout(lockSeatTimerRef.current);
      lockSeatTimerRef.current = null;
    }
    if (lockReleaseTimerRef.current !== null) {
      window.clearTimeout(lockReleaseTimerRef.current);
      lockReleaseTimerRef.current = null;
    }
    clearSavannahPageLock((...classes) => document.documentElement.classList.remove(...classes));
  };

  const armVaultAudio = () => {
    if (typeof window === "undefined") return;
    const Context = window.AudioContext;
    if (!Context) return;

    if (!audioRef.current) audioRef.current = new Context();
    if (audioRef.current.state === "suspended") void audioRef.current.resume();
  };

  const playVaultClunk = () => {
    const context = audioRef.current;
    if (!context || context.state !== "running") return;

    const now = context.currentTime;
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.008);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
    master.connect(context.destination);

    const low = context.createOscillator();
    low.type = "sine";
    low.frequency.setValueAtTime(82, now);
    low.frequency.exponentialRampToValueAtTime(46, now + 0.29);
    low.connect(master);
    low.start(now);
    low.stop(now + 0.35);

    const metalGain = context.createGain();
    metalGain.gain.setValueAtTime(0.0001, now);
    metalGain.gain.exponentialRampToValueAtTime(0.12, now + 0.003);
    metalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);
    metalGain.connect(context.destination);

    const metal = context.createOscillator();
    metal.type = "triangle";
    metal.frequency.setValueAtTime(188, now);
    metal.frequency.exponentialRampToValueAtTime(74, now + 0.08);
    metal.connect(metalGain);
    metal.start(now);
    metal.stop(now + 0.11);
  };

  useEffect(() => {
    document.documentElement.classList.add("savannah-intro-running");
    window.dispatchEvent(new Event("savannah-intro-active"));
    return () => {
      document.documentElement.classList.remove("savannah-intro-running");
    };
  }, []);

  useEffect(() => {
    const arm = () => armVaultAudio();
    window.addEventListener("pointerdown", arm, { once: true, passive: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (!media.matches) return;
      const video = videoRef.current;
      if (video) video.pause();
      releasePageLock();
      // Reduced-motion visitors enter the site immediately; never park on a still portrait.
      completeHandoff(false);
    };

    syncMotionPreference();
    media.addEventListener?.("change", syncMotionPreference);
    return () => media.removeEventListener?.("change", syncMotionPreference);
  }, []);

  // A slow or blocked video must not trap a visitor behind the opening film.
  // The site underneath is the fallback; preserve it rather than displaying a static face.
  useEffect(() => {
    const primeWatchdog = window.setTimeout(() => {
      if (!ready && !handoffStarted.current) completeHandoff(false);
    }, 6500);
    return () => window.clearTimeout(primeWatchdog);
  }, [ready]);

  // If priming or playback stalls, proceed directly to the site; never hold
  // visitors on a full-screen fallback portrait waiting for a manual click.
  useEffect(() => {
    const watchdog = window.setTimeout(() => {
      if (!handoffStarted.current) completeHandoff(false);
    }, 12000);
    return () => window.clearTimeout(watchdog);
  }, []);

  useEffect(() => () => {
    pivotTimersRef.current.forEach(id => window.clearTimeout(id));
    releasePageLock();
  }, []);

  // Native muted inline autoplay is more reliable on iOS than pausing and
  // seeking before the first play(). Keep the initial close-up concealed
  // until the video naturally reaches the approved wide frame.
  const attemptPlayback = () => {
    const video = videoRef.current;
    if (!video || handoffStarted.current || !video.paused) return;
    video.muted = true;
    void video.play().catch(() => {
      // Autoplay may be disallowed in embedded browsers; the homepage stays
      // visible and the watchdog will remove this invisible intro.
    });
  };

  const clickLock = () => {
    if (lockStarted.current) return;
    lockStarted.current = true;

    document.documentElement.classList.remove("savannah-page-locked");
    document.documentElement.classList.add("savannah-page-locking");
    // The latch fires on the exact frame the wall becomes the real site.
    playVaultClunk();
    lockSeatTimerRef.current = window.setTimeout(() => {
      lockSeatTimerRef.current = null;
      document.documentElement.classList.remove("savannah-page-locking");
      document.documentElement.classList.add("savannah-page-locked");
      lockReleaseTimerRef.current = window.setTimeout(() => releasePageLock(), 220);
    }, 100);
  };

  const completeHandoff = (animateIntoPlace = false) => {
    if (handoffStarted.current) return;
    handoffStarted.current = true;
    cancelBufferTimer();
    setStage("locked");
    // Only an actual cinematic handoff gets the vault-lock treatment.
    // A failed, skipped or reduced-motion film must leave the site immediately usable.
    const cinematic = ready && !fallback && pivotStartedRef.current;
    if (cinematic) clickLock();
    else releasePageLock();

    const seatDelay = 0;
    // Keep the projected heading on its measured DOM coordinates while seating.
    // The final handoff is a cut, not an opacity dissolve.
    window.setTimeout(() => setHandoff(true), seatDelay);
    window.setTimeout(() => {
      setVisible(false);
      document.documentElement.classList.remove("savannah-intro-running");
      releasePageLock();
      window.dispatchEvent(new Event("savannah-intro-complete"));
    }, seatDelay + 50);
  };

  const trackHandoff = () => {
    const video = videoRef.current;
    if (!video) return;
    // Mobile asset is already trimmed past the unwanted close-up.
    const trimmed = video.currentSrc.includes("savannah-intro-mobile-v2.mp4");
    const t = video.currentTime + (trimmed ? START_AT : 0);

    if (t >= REGISTER_AT && !pivotStartedRef.current && !handoffStarted.current) {
      // TIC: freeze the projected sentence as part of the physical wall.
      pivotStartedRef.current = true;
      video.pause();
      cancelBufferTimer();
      setStage("register");
      // TAC: the wall rotates into the viewer, becoming square to the screen.
      pivotTimersRef.current.push(window.setTimeout(() => setStage("daylight"), 160));
      // CLUNC: one hard cut from the aligned wall to the actual site.
      pivotTimersRef.current.push(window.setTimeout(() => completeHandoff(true), 960));
    }
  };

  if (!visible) return null;

  return (
    <section
      className={[
        styles.savannahIntro,
        ready ? styles.savannahIntroReady : "",
        fallback ? styles.savannahIntroFallback : "",
        stage === "register" ? styles.savannahSceneRegister : "",
        stage === "daylight" ? styles.savannahSceneDaylight : "",
        stage === "locked" ? styles.savannahSceneLocked : "",
        handoff ? styles.savannahHandoff : "",
      ].join(" ")}
      aria-label="Enter ctrl+love"
      data-deploy="savannah-scene-match-handoff"
      data-stage={stage}
    >
      <div className={styles.savannahFilm} aria-hidden="true">
        <div className={styles.savannahIntroFallbackImage} />
        <video
          ref={videoRef}
          className={styles.savannahIntroVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={attemptPlayback}
          onCanPlay={attemptPlayback}
          onPlaying={() => { cancelBufferTimer(); setFallback(false); }}
          onWaiting={guardBuffering}
          onStalled={guardBuffering}
          onTimeUpdate={() => {
            cancelBufferTimer();
            // If Safari starts at zero, keep the unwanted close-up hidden.
            // Reveal only once the approved wide scene has been reached.
            const video = videoRef.current;
            const trimmed = video?.currentSrc.includes("savannah-intro-mobile-v2.mp4");
            if (!handoffStarted.current && (video?.currentTime ?? 0) >= (trimmed ? 0.08 : START_AT - 0.08)) {
              setReady(true);
            }
            trackHandoff();
          }}
          onEnded={() => completeHandoff(false)}
          onError={() => completeHandoff(false)}
        >
          <source media="(max-width: 768px)" src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro-mobile-v2.mp4" type="video/mp4" />
          <source src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4" type="video/mp4" />
        </video>
        <div className={styles.savannahIntroShade} />
      </div>


      {/* The film is the entrance. No second manual "Come in" gate. */}
    </section>
  );
}
