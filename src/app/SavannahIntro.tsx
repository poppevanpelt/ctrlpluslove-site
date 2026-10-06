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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) return;
    const frame = window.requestAnimationFrame(() => setVisible(false));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const primeVideo = () => {
    const video = videoRef.current;
    if (!video || ready) return;

    video.currentTime = START_AT;
    video.muted = true;

    const start = () => {
      setReady(true);
      video.play().catch(() => { setFallback(true); setSiteLayer(true); window.setTimeout(() => finishHandoff(), 3200); });
    };

    if (video.readyState >= 2) start();
    else video.addEventListener("canplay", start, { once: true });
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
        onError={() => { setFallback(true); setReady(true); setSiteLayer(true); window.setTimeout(() => finishHandoff(), 3200); }}
      >
        <source src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4" type="video/mp4" />
      </video>

      <div className={styles.savannahIntroShade} />
      <button type="button" className={styles.savannahIntroEnter} onClick={finishHandoff}>Come in ↘</button>

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
