"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-2026.module.css";

const START_AT = 1.35;
const DEPTH_25_AT = 6.15;
const DEPTH_225_AT = 6.95;
const DEPTH_2D_AT = 7.55;
const HANDOFF_AT = 8.15;
const HANDOFF_REMOVE_AFTER = 1150;

type DepthStage = "film" | "twoFive" | "twoQuarter" | "twoD";

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [siteLayer, setSiteLayer] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [depthStage, setDepthStage] = useState<DepthStage>("film");
  const videoRef = useRef<HTMLVideoElement>(null);
  const handoffStarted = useRef(false);
  const lockStarted = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);

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

      // Reduced Motion should never make the entrance disappear.
      // Hold on a quiet Savannah still instead; visitors can explicitly play
      // the opening film if they want it.
      setFallback(true);
      setReady(true);
      setSiteLayer(true);
      setDepthStage("twoD");
    };

    syncMotionPreference();
    media.addEventListener?.("change", syncMotionPreference);
    return () => media.removeEventListener?.("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    // A dead media request can otherwise leave the front door as a black void:
    // no canplay event, no error event, and therefore no fallback.
    const watchdog = window.setTimeout(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        setFallback(true);
        setReady(true);
        setSiteLayer(true);
        setDepthStage("twoD");
      }
    }, 2600);

    return () => window.clearTimeout(watchdog);
  }, []);

  const primeVideo = () => {
    const video = videoRef.current;
    if (!video || ready) return;

    video.currentTime = START_AT;
    video.muted = true;

    const start = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        video.pause();
        setFallback(true);
        setReady(true);
        setSiteLayer(true);
        setDepthStage("twoD");
        return;
      }

      setReady(true);
      void video.play().then(() => {
        setFallback(false);
      }).catch(() => {
        // Autoplay can be blocked by browser policy. Keep an intentional
        // entrance visible instead of silently skipping Savannah.
        setFallback(true);
        setSiteLayer(true);
        setDepthStage("twoD");
      });
    };

    if (video.readyState >= 2) start();
    else video.addEventListener("canplay", start, { once: true });
  };

  const playOpening = () => {
    const video = videoRef.current;
    if (!video) return;

    document.documentElement.classList.remove("savannah-page-locking", "savannah-page-locked");
    setFallback(false);
    setSiteLayer(false);
    setDepthStage("film");
    setHandoff(false);
    setReady(true);
    handoffStarted.current = false;
    lockStarted.current = false;
    armVaultAudio();

    try { video.currentTime = START_AT; } catch {}
    video.muted = true;
    void video.play().catch(() => {
      setFallback(true);
      setSiteLayer(true);
      setDepthStage("twoD");
    });
  };

  const clickLock = () => {
    if (lockStarted.current) return;
    lockStarted.current = true;

    document.documentElement.classList.remove("savannah-page-locked");
    document.documentElement.classList.add("savannah-page-locking");
    window.setTimeout(() => {
      playVaultClunk();
      document.documentElement.classList.remove("savannah-page-locking");
      document.documentElement.classList.add("savannah-page-locked");

      // Keep the vault-seat effect transient. Leaving a transform on the entire
      // long homepage can turn it into one giant composited layer and clip
      // scrolling/rendering partway down in Safari/Chromium.
      window.setTimeout(() => {
        document.documentElement.classList.remove("savannah-page-locked");
      }, 460);
    }, 560);
  };

  const finishHandoff = () => {
    if (handoffStarted.current) return;
    handoffStarted.current = true;
    setSiteLayer(true);
    setDepthStage("twoD");
    clickLock();
    setHandoff(true);
    window.setTimeout(() => setVisible(false), HANDOFF_REMOVE_AFTER);
  };

  const trackHandoff = () => {
    const video = videoRef.current;
    if (!video) return;

    const t = video.currentTime;

    if (t >= DEPTH_25_AT) {
      setSiteLayer(true);
      setDepthStage((stage) => stage === "film" ? "twoFive" : stage);
    }
    if (t >= DEPTH_225_AT) {
      setDepthStage((stage) => stage === "twoFive" || stage === "film" ? "twoQuarter" : stage);
    }
    if (t >= DEPTH_2D_AT) {
      setDepthStage("twoD");
      clickLock();
    }
    if (t >= HANDOFF_AT) finishHandoff();
  };

  if (!visible) return null;

  return (
    <section
      className={[
        styles.savannahIntro,
        ready ? styles.savannahIntroReady : "",
        fallback ? styles.savannahIntroFallback : "",
        siteLayer ? styles.savannahSiteLayerVisibleState : "",
        depthStage === "twoFive" ? styles.savannahDepth25 : "",
        depthStage === "twoQuarter" ? styles.savannahDepth225 : "",
        depthStage === "twoD" ? styles.savannahDepth2d : "",
        handoff ? styles.savannahHandoff : "",
      ].join(" ")}
      aria-label="Enter ctrl+love"
      data-deploy="savannah-dimensional-handoff"
      data-depth={depthStage}
    >
      <div className={styles.savannahIntroFallbackImage} aria-hidden="true" />
      <video
        ref={videoRef}
        className={styles.savannahIntroVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={primeVideo}
        onTimeUpdate={trackHandoff}
        onEnded={finishHandoff}
        onError={() => {
          setFallback(true);
          setReady(true);
          setSiteLayer(true);
          setDepthStage("twoD");
        }}
      >
        <source src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4" type="video/mp4" />
      </video>

      <div className={styles.savannahIntroShade} />
      <div className={styles.savannahIntroControls}>
        {fallback ? (
          <button type="button" className={styles.savannahIntroPlay} onClick={playOpening}>Play opening ▶</button>
        ) : null}
        <button
          type="button"
          className={styles.savannahIntroEnter}
          onPointerDown={armVaultAudio}
          onClick={finishHandoff}
        >
          Come in ↘
        </button>
      </div>

      <div
        className={[
          styles.savannahSiteLayer,
          siteLayer ? styles.savannahSiteLayerVisible : "",
        ].join(" ")}
        aria-hidden="true"
      >
        <div className={styles.savannahSiteNav}>
          <strong>ctrl+love</strong>
          <span>Work&nbsp;&nbsp; Difference&nbsp;&nbsp; Cases&nbsp;&nbsp; Instruments&nbsp;&nbsp; About</span>
        </div>
        <div className={styles.savannahSiteNote}>
          <small>Applied AI for human judgment</small>
          <strong>Observe.<br />Analyse.<br />Accelerate.</strong>
        </div>
      </div>
    </section>
  );
}
