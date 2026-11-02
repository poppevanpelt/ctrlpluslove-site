"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./home-2026.module.css";
import { clearSavannahPageLock } from "./savannah-runtime";

// A single, explicit film clock. These are media timestamps, not CSS delays.
const START_AT = 1.35;
const DEPTH_275_AT = 3.65;
const DEPTH_25_AT = 4.75;
const DEPTH_2D_AT = 6.2;
const CLUNK_AT = 6.65;
const EXIT_AT = 7.65;
const LOAD_TIMEOUT_MS = 3500;
const PLAY_TIMEOUT_MS = 12000;
const TITLE_HOLD_MS = 1100;
const MOBILE_FILM = "/savannah-intro/entrance-mobile-v4.mp4";
const DESKTOP_FILM = "/savannah-intro/entrance-desktop-v4.mp4";
type Stage = "film" | "twoSevenFive" | "twoFive" | "twoD" | "clunk";

export default function SavannahIntro() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState<Stage>("film");
  const [handoff, setHandoff] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [fallbackVideo, setFallbackVideo] = useState(false);
  const [headlineStyle, setHeadlineStyle] = useState<CSSProperties>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const navGhostRef = useRef<HTMLDivElement>(null);
  const headlineGhostRef = useRef<HTMLHeadingElement>(null);
  const completed = useRef(false);
  const readyRef = useRef(false);
  const titleDone = useRef(false);
  const bufferTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);
  const retryTimer = useRef<number | null>(null);
  const lastProgress = useRef(0);
  const audioContext = useRef<AudioContext | null>(null);
  const clunkPlayed = useRef(false);

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
    // Never strand a visitor behind the black film layer if media cannot load.
    // A user gesture may be required on iOS (Low Power Mode and browser policies).
    // Keep the film available instead of silently skipping it.
    // The approved title is an intro beat, not a network-loading indicator.
    const titleTimer = window.setTimeout(() => {
      titleDone.current = true;
      tryPlay();
    }, TITLE_HOLD_MS);
    const exitOffer = window.setTimeout(() => {
      if (!readyRef.current && !completed.current) finish();
    }, TITLE_HOLD_MS + 1000);
    const loading = window.setTimeout(() => {
      if (!readyRef.current && !completed.current) finish();
    }, LOAD_TIMEOUT_MS);
    const watchdog = window.setTimeout(() => {
      if (!completed.current && lastProgress.current < EXIT_AT) finish();
    }, PLAY_TIMEOUT_MS);
    return () => {
      window.clearTimeout(titleTimer);
      window.clearTimeout(exitOffer);
      window.clearTimeout(loading);
      window.clearTimeout(watchdog);
      if (bufferTimer.current !== null) window.clearTimeout(bufferTimer.current);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
      reduce.removeEventListener?.("change", onReduce);
      document.documentElement.classList.remove("savannah-intro-running");
      clearSavannahPageLock((...classes) => document.documentElement.classList.remove(...classes));
    };
  }, []);

  const armClunkAudio = () => {
    if (typeof window === "undefined") return;
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) return;
    if (!audioContext.current) audioContext.current = new AudioContextConstructor();
    if (audioContext.current.state === "suspended") void audioContext.current.resume();
  };
  const playClunk = () => {
    if (clunkPlayed.current) return;
    clunkPlayed.current = true;
    const context = audioContext.current;
    if (!context || context.state !== "running") return;
    const now = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    gain.connect(context.destination);
    const low = context.createOscillator();
    low.type = "sine";
    low.frequency.setValueAtTime(76, now);
    low.frequency.exponentialRampToValueAtTime(43, now + 0.26);
    low.connect(gain);
    low.start(now);
    low.stop(now + 0.29);
    const metalGain = context.createGain();
    metalGain.gain.setValueAtTime(0.0001, now);
    metalGain.gain.exponentialRampToValueAtTime(0.09, now + 0.004);
    metalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
    metalGain.connect(context.destination);
    const metal = context.createOscillator();
    metal.type = "triangle";
    metal.frequency.setValueAtTime(184, now);
    metal.frequency.exponentialRampToValueAtTime(72, now + 0.075);
    metal.connect(metalGain);
    metal.start(now);
    metal.stop(now + 0.1);
  };
  useEffect(() => {
    const arm = () => armClunkAudio();
    window.addEventListener("pointerdown", arm, { once: true, passive: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, []);

  const tryPlay = () => {
    const video = videoRef.current;
    if (!video || completed.current || !titleDone.current) return;
    video.muted = true;
    void video.play().catch(() => {
      if (!completed.current) finish();
    });
  };
  const onMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    // Both renditions are pretrimmed to the same approved wide frame.
    // Safari starts at zero without a remote seek or a hidden-frame interval.
    tryPlay();
  };
  const onProgress = () => {
    const video = videoRef.current;
    if (!video || completed.current) return;
    const t = video.currentTime + START_AT;
    if (!readyRef.current && !video.paused && titleDone.current && video.currentTime >= 0.02) {
      readyRef.current = true;
      setReady(true);
      setNeedsTap(false);
      setShowExit(false);
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    }
    if (t > lastProgress.current + 0.05) {
      lastProgress.current = t;
      if (bufferTimer.current !== null) window.clearTimeout(bufferTimer.current);
      bufferTimer.current = null;
    }
    if (t >= CLUNK_AT) {
      setStage("clunk");
      playClunk();
    } else if (t >= DEPTH_2D_AT) setStage("twoD");
    else if (t >= DEPTH_25_AT) setStage("twoFive");
    else if (t >= DEPTH_275_AT) setStage("twoSevenFive");
    if (t >= EXIT_AT) finish();
  };
  const onWaiting = () => {
    if (completed.current || !readyRef.current || bufferTimer.current !== null) return;
    bufferTimer.current = window.setTimeout(() => {
      if (!completed.current) finish();
    }, 3000);
  };
  const playFromTap = () => {
    const video = videoRef.current;
    if (!video || completed.current) return;
    video.muted = true;
    titleDone.current = true;
    video.setAttribute("playsinline", "");
    // Must be called directly in the click handler for iOS autoplay restrictions.
    void video.play().then(() => setNeedsTap(false)).catch(() => {
      setFallbackVideo(true);
      setNeedsTap(true);
      setShowExit(true);
    });
  };
  if (!visible) return null;

  return (
    <section className={[
      styles.savannahIntro,
      ready ? styles.savannahIntroReady : "",
      stage === "twoSevenFive" ? styles.savannahScene275 : "",
      stage === "twoFive" ? styles.savannahScene25 : "",
      stage === "twoD" ? styles.savannahScene2d : "",
      stage === "clunk" ? styles.savannahSceneClunk : "",
      handoff ? styles.savannahHandoff : "",
    ].join(" ")} aria-label="Enter ctrl+love" data-deploy="savannah-canonical-title-v4" data-stage={stage}>
      <div className={styles.savannahFilm} aria-hidden="true">
        <video key={fallbackVideo ? "wide" : "responsive"} ref={videoRef} className={styles.savannahIntroVideo}
          muted playsInline preload="auto" poster="/savannah-intro/entrance-poster-v4.jpg"
          onLoadedMetadata={onMetadata} onLoadedData={tryPlay} onCanPlay={tryPlay} onSeeked={tryPlay} onPlaying={onProgress}
          onTimeUpdate={onProgress} onWaiting={onWaiting} onStalled={onWaiting}
          onEnded={finish} onError={finish}>
          {!fallbackVideo && <source media="(max-width: 768px)" src={MOBILE_FILM} type="video/mp4" />}
          <source src={DESKTOP_FILM} type="video/mp4" />
        </video>
        <div className={styles.savannahIntroShade} />
      </div>


      {showExit && (
        <button type="button" onClick={() => { armClunkAudio(); finish(); }} aria-label="Enter ctrl+love without the film"
          style={{position:"absolute",right:20,bottom:24,zIndex:8,padding:"12px 16px",background:"rgba(245,243,238,.94)",color:"#111",border:0,font:"inherit",cursor:"pointer"}}>
          Enter site →
        </button>
      )}
      {!ready && <div style={{position:"absolute",inset:0,zIndex:2,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:"#f3f1eb",textAlign:"center",pointerEvents:"none"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"0 6vw"}}><div style={{fontSize:"clamp(30px,6.8vw,82px)",fontWeight:900,letterSpacing:"-.065em",lineHeight:.9,maxWidth:1100}}>SAVANNAH, EMPLOYEE #4.</div><div style={{fontSize:"clamp(14px,2vw,22px)",fontWeight:500,letterSpacing:".08em",textTransform:"uppercase"}}>COME IN.</div></div></div>}
      <div ref={navGhostRef} className={styles.savannahNavGhost} aria-hidden="true" />
      <h2 ref={headlineGhostRef} className={styles.savannahHeadlineGhost} style={headlineStyle} aria-hidden="true" />
    </section>
  );
}
