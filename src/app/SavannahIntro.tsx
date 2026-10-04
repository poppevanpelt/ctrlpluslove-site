"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-2026.module.css";

const SAVANNAH_START = 1.35;
const UI_REVEAL_AT = 6.4;

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [siteLayer, setSiteLayer] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setVisible(false);
  }, []);

  const primeVideo = () => {
    const video = videoRef.current;
    if (!video || ready) return;

    video.currentTime = SAVANNAH_START;
    video.muted = true;

    const start = () => {
      setReady(true);
      video.play().catch(() => setVisible(false));
    };

    if (video.readyState >= 2) start();
    else video.addEventListener("canplay", start, { once: true });
  };

  const trackHandoff = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime >= UI_REVEAL_AT) {
      setSiteLayer(true);
    }
  };

  const enterSite = () => {
    if (leaving) return;
    setSiteLayer(true);
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 900);
  };

  if (!visible) return null;

  return (
    <section
      className={[
        styles.savannahIntro,
        ready ? styles.savannahIntroReady : "",
        leaving ? styles.savannahLeaving : "",
      ].join(" ")}
      aria-label="Enter ctrl+love"
      data-deploy="savannah-only-handoff"
    >
      <video
        ref={videoRef}
        className={styles.savannahIntroVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={primeVideo}
        onTimeUpdate={trackHandoff}
        onEnded={enterSite}
        onError={() => setVisible(false)}
      >
        <source
          src="https://dnznrvs05pmza.cloudfront.net/kling-o3-pro/935632333061881948/Create_one_continuous_restrained_photoreal_transition_from_this_exact_approved_ctrl_love_office_stil.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMWJmZDk1NjljNDQ5YTA4OSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTI2NDQ4OX0.AqSXIvZLlf5QDQ_JRecyUxtKQxSupPRjk1AoSV1aJI0"
          type="video/mp4"
        />
      </video>

      <div className={styles.savannahIntroShade} />

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
