"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-2026.module.css";

const START_AT = 1.35;
const UI_REVEAL_AT = 6.15;
const HANDOFF_AT = 8.15;

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [siteLayer, setSiteLayer] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [fallback, setFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handoffStarted = useRef(false);
  const lockStarted = useRef(false);

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
      });
    };

    if (video.readyState >= 2) start();
    else video.addEventListener("canplay", start, { once: true });
  };

  const playOpening = () => {
    const video = videoRef.current;
    if (!video) return;

    setFallback(false);
    setSiteLayer(false);
    setReady(true);
    handoffStarted.current = false;
    lockStarted.current = false;

    try { video.currentTime = START_AT; } catch {}
    video.muted = true;
    void video.play().catch(() => {
      setFallback(true);
      setSiteLayer(true);
    });
  };

  const clickLock = () => {
    if (lockStarted.current) return;
    lockStarted.current = true;

    document.documentElement.classList.add("savannah-page-locking");
    window.setTimeout(() => {
      document.documentElement.classList.remove("savannah-page-locking");
      document.documentElement.classList.add("savannah-page-locked");
    }, 1000);
  };

  const finishHandoff = () => {
    if (handoffStarted.current) return;
    handoffStarted.current = true;
    clickLock();
    setHandoff(true);
    window.setTimeout(() => setVisible(false), 2100);
  };

  const trackHandoff = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime >= UI_REVEAL_AT) setSiteLayer(true);
    if (video.currentTime >= HANDOFF_AT - 0.18) clickLock();
    if (video.currentTime >= HANDOFF_AT) finishHandoff();
  };

  if (!visible) return null;

  return (
    <section
      className={[
        styles.savannahIntro,
        ready ? styles.savannahIntroReady : "",
        fallback ? styles.savannahIntroFallback : "",
        handoff ? styles.savannahHandoff : "",
      ].join(" ")}
      aria-label="Enter ctrl+love"
      data-deploy="savannah-live-handoff"
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
        onError={() => { setFallback(true); setReady(true); setSiteLayer(true); }}
      >
        <source src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4" type="video/mp4" />
      </video>

      <div className={styles.savannahIntroShade} />
      <div className={styles.savannahIntroControls}>
        {fallback ? (
          <button type="button" className={styles.savannahIntroPlay} onClick={playOpening}>Play opening ▶</button>
        ) : null}
        <button type="button" className={styles.savannahIntroEnter} onClick={finishHandoff}>Come in ↘</button>
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
