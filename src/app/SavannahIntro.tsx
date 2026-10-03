"use client";

// Savannah production entrance

import { useEffect, useRef, useState } from "react";
import styles from "./home-2026.module.css";

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) setVisible(false);
  }, []);

  const enterSite = () => {
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 700);
  };

  if (!visible) return null;

  return (
    <section className={`${styles.savannahIntro} ${leaving ? styles.savannahLeaving : ""}`} aria-label="Enter ctrl+love" data-deploy="savannah-live-2">
      <video
        ref={videoRef}
        className={styles.savannahIntroVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={enterSite}
        onError={enterSite}
      >
        <source src="https://dnznrvs05pmza.cloudfront.net/kling-o3-pro/935466402926952540/Same_exact_Savannah__same_exact_warm_ctrl_love_office__same_wardrobe__hair__face_and_lighting__Start.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYjAyZmFiZDBmY2Q2YTRjMyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MTE1NTc5Mn0.ZL9nGYVE-NawoO2vSi4YihdcdjiIU0JE8aIcLPPS1mc" type="video/mp4" />
      </video>
      <div className={styles.savannahIntroShade} />
      <div className={styles.savannahIntroBrand}>ctrl+love</div>
      <button className={styles.savannahEnter} onClick={enterSite} type="button">
        Enter
      </button>
    </section>
  );
}
