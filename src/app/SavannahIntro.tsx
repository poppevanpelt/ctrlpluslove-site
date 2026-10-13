"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./home-2026.module.css";
import { clearSavannahPageLock } from "./savannah-runtime";

// A single, explicit film clock. These are media timestamps, not CSS delays.
const START_AT = 1.35;
const NAV_AT = 3.65;
const HEADLINE_AT = 4.75;
const REGISTER_AT = 6.2;
const DAYLIGHT_AT = 6.65;
const EXIT_AT = 7.65;
const LOAD_TIMEOUT_MS = 14000;
const PLAY_TIMEOUT_MS = 30000;
type Stage = "film" | "nav" | "headline" | "register" | "daylight";

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState<Stage>("film");
  const [handoff, setHandoff] = useState(false);
  const [playbackIssue, setPlaybackIssue] = useState(false);
  const [headlineStyle, setHeadlineStyle] = useState<CSSProperties>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const navGhostRef = useRef<HTMLDivElement>(null);
  const headlineGhostRef = useRef<HTMLHeadingElement>(null);
  const completed = useRef(false);
  const readyRef = useRef(false);
  const bufferTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const retryTimer = useRef<number | null>(null);
  const lastProgress = useRef(0);

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    if (bufferTimer.current !== null) window.clearTimeout(bufferTimer.current);
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    videoRef.current?.pause();
    clearSavannahPageLock((...classes) => document.documentElement.classList.remove(...classes));
    setHandoff(true);
    window.setTimeout(() => {
      setVisible(false);
      document.documentElement.classList.remove("savannah-intro-running");
      window.dispatchEvent(new Event("savannah-intro-complete"));
    }, 50);
  };

  // Reuse the real nav and measure the real headline. No fake duplicate homepage.
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(`main .${styles.nav}`);
    if (nav && navGhostRef.current) {
      const clone = nav.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
      clone.querySelectorAll("a,button").forEach(el => {
        el.setAttribute("tabindex", "-1");
        el.setAttribute("aria-hidden", "true");
      });
      navGhostRef.current.replaceChildren(clone);
    }
    const measure = () => {
      const headline = document.querySelector<HTMLElement>('[data-savannah-handoff-headline="true"]');
      if (!headline) return;
      if (headlineGhostRef.current) headlineGhostRef.current.textContent = headline.textContent;
      const rect = headline.getBoundingClientRect();
      const computed = window.getComputedStyle(headline);
      setHeadlineStyle({
        left:rect.left,top:rect.top,width:rect.width,
        fontFamily:computed.fontFamily,fontSize:computed.fontSize,
        fontWeight:computed.fontWeight,lineHeight:computed.lineHeight,
        letterSpacing:computed.letterSpacing,
      });
    };
    measure();
    window.addEventListener("resize", measure, { passive:true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("savannah-intro-running");
    window.dispatchEvent(new Event("savannah-intro-active"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduce = () => { if (reduce.matches) finish(); };
    onReduce();
    reduce.addEventListener?.("change", onReduce);
    const loading = window.setTimeout(() => {
      if (!readyRef.current && !completed.current) setPlaybackIssue(true);
    }, LOAD_TIMEOUT_MS);
    const watchdog = window.setTimeout(() => {
      if (!completed.current && lastProgress.current < EXIT_AT) setPlaybackIssue(true);
    }, PLAY_TIMEOUT_MS);
    return () => {
      window.clearTimeout(loading);
      window.clearTimeout(watchdog);
      if (bufferTimer.current !== null) window.clearTimeout(bufferTimer.current);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
      reduce.removeEventListener?.("change", onReduce);
      document.documentElement.classList.remove("savannah-intro-running");
      clearSavannahPageLock((...classes) => document.documentElement.classList.remove(...classes));
    };
  }, []);

  const tryPlay = () => {
    const video = videoRef.current;
    if (!video || completed.current || video.seeking) return;
    video.muted = true;
    void video.play().catch(() => {
      if (!completed.current) setPlaybackIssue(true);
    });
  };
  const onMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    const mobile = video.currentSrc.includes("savannah-intro-mobile-v2.mp4");
    if (mobile) { tryPlay(); return; }
    // Seek to the approved wide shot before starting playback: no giant-face flash.
    try {
      video.currentTime = START_AT;
      // iOS/Safari can omit seeked for an early metadata seek.
      window.setTimeout(() => { if (!completed.current) tryPlay(); }, 1200);
    } catch { tryPlay(); }
  };
  const onProgress = () => {
    const video = videoRef.current;
    if (!video || completed.current) return;
    const mobile = video.currentSrc.includes("savannah-intro-mobile-v2.mp4");
    const t = video.currentTime + (mobile ? START_AT : 0);
    if (!readyRef.current && video.currentTime >= (mobile ? 0.02 : START_AT - 0.05)) {
      readyRef.current = true;
      setReady(true);
      setPlaybackIssue(false);
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    }
    if (t > lastProgress.current + 0.05) {
      lastProgress.current = t;
      setPlaybackIssue(false);
      if (bufferTimer.current !== null) window.clearTimeout(bufferTimer.current);
      bufferTimer.current = null;
    }
    if (t >= DAYLIGHT_AT) setStage("daylight");
    else if (t >= REGISTER_AT) setStage("register");
    else if (t >= HEADLINE_AT) setStage("headline");
    else if (t >= NAV_AT) setStage("nav");
    if (t >= EXIT_AT) finish();
  };
  const onWaiting = () => {
    if (completed.current || !readyRef.current || bufferTimer.current !== null) return;
    bufferTimer.current = window.setTimeout(() => {
      if (!completed.current) setPlaybackIssue(true);
    }, 5500);
  };
  const retryFilm = () => {
    const video = videoRef.current;
    if (!video || completed.current) return;
    setPlaybackIssue(false);
    setReady(false);
    readyRef.current = false;
    lastProgress.current = 0;
    setStage("film");
    if (bufferTimer.current !== null) window.clearTimeout(bufferTimer.current);
    bufferTimer.current = null;
    if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    retryTimer.current = window.setTimeout(() => {
      if (!readyRef.current && !completed.current) setPlaybackIssue(true);
    }, LOAD_TIMEOUT_MS);
    video.pause();
    video.load();
  };
  if (!visible) return null;

  return (
    <section className={[
      styles.savannahIntro,
      ready ? styles.savannahIntroReady : "",
      stage === "nav" ? styles.savannahSceneNav : "",
      stage === "headline" ? styles.savannahSceneHeadline : "",
      stage === "register" ? styles.savannahSceneRegister : "",
      stage === "daylight" ? styles.savannahSceneDaylight : "",
      handoff ? styles.savannahHandoff : "",
    ].join(" ")} aria-label="Enter ctrl+love" data-deploy="savannah-one-film-choreography" data-stage={stage}>
      <div className={styles.savannahFilm} aria-hidden="true">
        <video ref={videoRef} className={styles.savannahIntroVideo}
          muted playsInline preload="auto"
          onLoadedMetadata={onMetadata} onLoadedData={tryPlay} onCanPlay={tryPlay} onSeeked={tryPlay} onPlaying={onProgress}
          onTimeUpdate={onProgress} onWaiting={onWaiting} onStalled={onWaiting}
          onEnded={finish} onError={() => setPlaybackIssue(true)}>
          <source media="(max-width: 768px)" src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro-mobile-v2.mp4" type="video/mp4" />
          <source src="https://ctrl-love-media.floot.app/_cdn/static/savannah-intro.mp4" type="video/mp4" />
        </video>
        <div className={styles.savannahIntroShade} />
      </div>
      {playbackIssue && (
        <div role="status" style={{position:"absolute",inset:0,zIndex:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:18,padding:24,color:"#f3f1eb",background:"rgba(13,13,12,.94)",textAlign:"center"}}>
          <p style={{fontSize:16,maxWidth:350,margin:0}}>Savannah’s film is taking longer than expected.</p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
            <button type="button" onClick={retryFilm} style={{padding:"12px 18px",background:"#f3f1eb",color:"#111",border:0,cursor:"pointer",font:"inherit"}}>Play Savannah</button>
            <button type="button" onClick={finish} style={{padding:"12px 18px",background:"transparent",color:"#f3f1eb",border:"1px solid #aaa",cursor:"pointer",font:"inherit"}}>Enter site</button>
          </div>
        </div>
      )}
      <div ref={navGhostRef} className={styles.savannahNavGhost} aria-hidden="true" />
      <h2 ref={headlineGhostRef} className={styles.savannahHeadlineGhost} style={headlineStyle} aria-hidden="true" />
    </section>
  );
}
