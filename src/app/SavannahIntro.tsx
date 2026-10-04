"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home-2026.module.css";

const UI_REVEAL_AT = 2.65;
const PAGE_HANDOFF_AT = 4.25;
const EXIT_AT = 5.35;

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [siteLayer, setSiteLayer] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setVisible(false);
  }, []);

  const primeVideo = () => {
    const video = videoRef.current;
    if (!video || ready) return;

    video.currentTime = 0;
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

    const t = video.currentTime;

    if (t >= UI_REVEAL_AT) setSiteLayer(true);
    if (t >= PAGE_HANDOFF_AT) setHandoff(true);

    if (t >= EXIT_AT && !leaving) {
      setLeaving(true);
      window.setTimeout(() => setVisible(false), 900);
    }
  };

  if (!visible) return null;

  return (
    <section
      className={[
        styles.savannahIntro,
        ready ? styles.savannahIntroReady : "",
        handoff ? styles.savannahHandoff : "",
        leaving ? styles.savannahLeaving : "",
      ].join(" ")}
      aria-label="Enter ctrl+love"
      data-deploy="savannah-final-transition"
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
        onEnded={() => {
          setHandoff(true);
          setLeaving(true);
          window.setTimeout(() => setVisible(false), 900);
        }}
        onError={() => setVisible(false)}
      >
        <source
          src="https://dnznrvs05pmza.cloudfront.net/kling-o3-pro/935638701269450847/Continue_this_exact_reference_shot_seamlessly__but_movement_is_mandatory__Savannah_must_be_ALREADY_M.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjk1YWI2YjBiMGJjMzU3MCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTIyNjI4OH0.3sVK6oLFp5ayo7CW1Hu32BE0oF6Dhjna9R8-zLnuOOc"
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
