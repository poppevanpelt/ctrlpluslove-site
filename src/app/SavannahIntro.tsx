"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
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
  const [headlineStyle, setHeadlineStyle] = useState<CSSProperties>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekPrimedRef = useRef(false);
  const handoffStarted = useRef(false);
  const lockStarted = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const lockSeatTimerRef = useRef<number | null>(null);
  const lockReleaseTimerRef = useRef<number | null>(null);

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

  const measureHeadline = () => {
    const target = document.querySelector<HTMLElement>('[data-savannah-handoff-headline="true"]');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const computed = window.getComputedStyle(target);

    setHeadlineStyle({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
    });
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
    measureHeadline();
    const onResize = () => measureHeadline();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
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
      setFallback(true);
      setReady(true);
      setStage("film");
    };

    syncMotionPreference();
    media.addEventListener?.("change", syncMotionPreference);
    return () => media.removeEventListener?.("change", syncMotionPreference);
  }, []);

  // If priming or playback stalls, proceed directly to the site; never hold
  // visitors on a full-screen fallback portrait waiting for a manual click.
  useEffect(() => {
    const watchdog = window.setTimeout(() => {
      if (!handoffStarted.current) completeHandoff(false);
    }, 12000);
    return () => window.clearTimeout(watchdog);
  }, []);

  useEffect(() => () => releasePageLock(), []);

  // iOS Safari may paint the video at t=0 before a metadata-time seek.
  // Never reveal or autoplay the film until the intended first frame is decoded.
  const primeVideo = () => {
    const video = videoRef.current;
    if (!video || seekPrimedRef.current) return;
    seekPrimedRef.current = true;
    video.pause();
    video.muted = true;
    try {
      video.currentTime = START_AT;
    } catch {
      completeHandoff(false);
    }
  };

  const startFromPrimedFrame = () => {
    const video = videoRef.current;
    if (!video || handoffStarted.current || ready || video.currentTime < START_AT - 0.08) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      completeHandoff(false);
      return;
    }
    setReady(true);
    void video.play().then(() => setFallback(false)).catch(() => completeHandoff(false));
  };

  const clickLock = () => {
    if (lockStarted.current) return;
    lockStarted.current = true;

    document.documentElement.classList.remove("savannah-page-locked");
    document.documentElement.classList.add("savannah-page-locking");
    lockSeatTimerRef.current = window.setTimeout(() => {
      lockSeatTimerRef.current = null;
      playVaultClunk();
      document.documentElement.classList.remove("savannah-page-locking");
      document.documentElement.classList.add("savannah-page-locked");
      lockReleaseTimerRef.current = window.setTimeout(() => releasePageLock(), 460);
    }, 620);
  };

  const completeHandoff = (animateIntoPlace = false) => {
    if (handoffStarted.current) return;
    handoffStarted.current = true;
    setStage("locked");
    clickLock();

    const seatDelay = animateIntoPlace ? 620 : 180;
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
    const t = video.currentTime;

    if (t >= LOCK_AT) {
      setStage("locked");
      clickLock();
    } else if (t >= DAYLIGHT_AT) {
      setStage("daylight");
    } else if (t >= REGISTER_AT) {
      setStage("register");
    }

    if (t >= HANDOFF_AT) completeHandoff(false);
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
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={primeVideo}
          onSeeked={startFromPrimedFrame}
          onTimeUpdate={trackHandoff}
          onEnded={() => completeHandoff(false)}
          onError={() => completeHandoff(false)}
        >
          <source src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4" type="video/mp4" />
        </video>
        <div className={styles.savannahIntroShade} />
      </div>

      {headlineStyle ? (
        <h1 className={styles.savannahProjectionHeadline} style={headlineStyle} aria-hidden="true">
          We build instruments for human judgment.
        </h1>
      ) : null}

      <div className={styles.savannahIntroControls}>
        <button
          type="button"
          className={styles.savannahIntroEnter}
          onPointerDown={armVaultAudio}
          onClick={() => completeHandoff(true)}
        >
          Come in ↘
        </button>
      </div>
    </section>
  );
}
