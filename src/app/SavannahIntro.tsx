"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./home-2026.module.css";
import { clearSavannahPageLock } from "./savannah-runtime";

const START_AT = 1.35;
const REGISTER_AT = 6.2;
const DAYLIGHT_AT = 6.86;
const LOCK_AT = 7.56;
const HANDOFF_AT = 8.14;

type SceneStage = "film" | "register" | "daylight" | "locked";

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [stage, setStage] = useState<SceneStage>("film");
  const [headlineStyle, setHeadlineStyle] = useState<CSSProperties>();
  const videoRef = useRef<HTMLVideoElement>(null);
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
    if (audioRef.current.state === "suspended") {
      void audioRef.current.resume();
    }
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

  useEffect(() => {
    const watchdog = window.setTimeout(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        releasePageLock();
        setFallback(true);
        setReady(true);
        setStage("film");
      }
    }, 2600);

    return () => window.clearTimeout(watchdog);
  }, []);

  useEffect(() => () => releasePageLock(), []);

  const primeVideo = () => {
    const video = videoRef.current;
    if (!video || ready) return;

    video.currentTime = START_AT;
    video.muted = true;

    const start = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        video.pause();
        releasePageLock();
        setFallback(true);
        setReady(true);
        setStage("film");
        return;
      }

      setReady(true);
      void video.play().then(() => {
        setFallback(false);
      }).catch(() => {
        releasePageLock();
        setFallback(true);
        setStage("film");
      });
    };

    if (video.readyState >= 2) start();
    else video.addEventListener("canplay", start, { once: true });
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

      lockReleaseTimerRef.current = window.setTimeout(() => {
        releasePageLock();
      }, 460);
    }, 560);
  };

  const completeHandoff = (animateIntoPlace = false) => {
    if (handoffStarted.current) return;
    handoffStarted.current = true;

    setStage("locked");
    clickLock();

    const fadeDelay = animateIntoPlace ? 460 : 70;
    window.setTimeout(() => setHandoff(true), fadeDelay);
    window.setTimeout(() => setVisible(false), fadeDelay + 240);
  };

  const playOpening = () => {
    const video = videoRef.current;
    if (!video) return;

    releasePageLock();
    setFallback(false);
    setStage("film");
    setHandoff(false);
    setReady(true);
    handoffStarted.current = false;
    lockStarted.current = false;
    armVaultAudio();
    measureHeadline();

    try { video.currentTime = START_AT; } catch {}
    video.muted = true;
    void video.play().catch(() => {
      releasePageLock();
      setFallback(true);
      setStage("film");
    });
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
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={primeVideo}
          onTimeUpdate={trackHandoff}
          onEnded={() => completeHandoff(false)}
          onError={() => {
            releasePageLock();
            setFallback(true);
            setReady(true);
            setStage("film");
          }}
        >
          <source src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4" type="video/mp4" />
        </video>
        <div className={styles.savannahIntroShade} />
      </div>

      {headlineStyle ? (
        <h1
          className={styles.savannahProjectionHeadline}
          style={headlineStyle}
          aria-hidden="true"
        >
          We build instruments for human judgment.
        </h1>
      ) : null}

      <div className={styles.savannahIntroControls}>
        {fallback ? (
          <button type="button" className={styles.savannahIntroPlay} onClick={playOpening}>Play opening ▶</button>
        ) : null}
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
