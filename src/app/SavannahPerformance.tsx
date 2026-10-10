"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties } from "react";

const PRESENCE = "/savannah-presence/savannah-motion.mp4";
const SOURCE = "https://d8j0ntlcm91z4.cloudfront.net/user_3KNACbddGNvgqJBvAUAT5DoeYO3/hf_20261010_195143_7a75e120-da0a-4031-adc6-6ff467062f1c.mp4";
export type SavannahPerformanceHandle = { greet: () => Promise<boolean>; stop: () => void };
type Props = { phase: "waiting" | "listening" | "thinking" | "speaking"; onGreetingChange?: (active: boolean) => void };

// Reuse the silent performance for presence. The recorded greeting keeps its
// own audio; fresh voice replies never borrow recorded talking mouth movements.
// Stop at 6s, before the silent source starts opening her mouth.
export const SavannahPerformance = forwardRef<SavannahPerformanceHandle, Props>(function SavannahPerformance({ phase, onGreetingChange }, ref) {
  const video = useRef<HTMLVideoElement>(null);
  const presence = useRef<HTMLVideoElement>(null);
  const greeting = useRef(false);
  const latestPhase = useRef(phase);
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [presenceReady, setPresenceReady] = useState(false);
  const [presenceFailed, setPresenceFailed] = useState(false);
  useEffect(() => { latestPhase.current = phase; }, [phase]);
  const finish = useRef<((completed: boolean) => void) | null>(null);
  const nextMove = useRef(0);
  const end = useRef(4.92);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  function stop(completed = false) {
    const player = video.current;
    if (player) { player.pause(); player.muted = true; }
    setGreetingVisible(false);
    if (greeting.current) { greeting.current = false; onGreetingChange?.(false); }
    const done = finish.current;
    finish.current = null;
    done?.(completed);
    if (player && player.readyState >= 2) player.currentTime = 3.92;
    nextMove.current = performance.now() + 3500;
  }

  useImperativeHandle(ref, () => ({
    stop,
    greet: () => {
      const player = video.current;
      if (!player || failed || greeting.current) return Promise.resolve(true);
      greeting.current = true;
      presence.current?.pause();
      setGreetingVisible(true);
      onGreetingChange?.(true);
      player.pause(); player.currentTime = 0; player.muted = false;
      return new Promise<boolean>(resolve => {
        finish.current = resolve;
        // Called directly in the tap handler to retain Safari's audio gesture.
        void player.play().catch(() => stop(true));
      });
    },
  }));

  useEffect(() => {
    const player = presenceFailed ? video.current : presence.current;
    if (!player || !(presenceFailed ? ready && !failed : presenceReady)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let frame = 0;
    let playing = false;
    let cursor = 0;
    const windows = presenceFailed ? [[3.92, 4.92]] : [[0, 1.95], [1.95, 3.9], [3.9, 6]];
    const schedule = () => {
      const active = latestPhase.current === "listening" || latestPhase.current === "thinking";
      nextMove.current = performance.now() + (active ? 700 : 2400) + Math.random() * (active ? 1200 : 2800);
    };
    // Start only once media is ready. State changes don't seek mid-gesture.
    player.muted = true;
    if (!greeting.current) player.currentTime = windows[0][0];
    nextMove.current = 0;
    const tick = () => {
      if (document.hidden || preference.matches || greeting.current) {
        if (!greeting.current || !presenceFailed) player.pause();
        playing = false;
        schedule();
      } else if (playing && player.currentTime >= end.current) {
        player.pause();
        playing = false;
        schedule();
      } else if (!playing && performance.now() >= nextMove.current) {
        const window = windows[cursor % windows.length];
        cursor += 1;
        player.muted = true;
        player.currentTime = window[0];
        end.current = window[1];
        playing = true;
        void player.play().catch(() => { if (!cancelled) { playing = false; schedule(); } });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(frame); player.pause(); };
  }, [ready, presenceReady, presenceFailed, failed]);

  useEffect(() => () => { video.current?.pause(); presence.current?.pause(); finish.current?.(false); }, []);

  if (failed && presenceFailed) return null;
  const style: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#272421", zIndex: 3, pointerEvents: "none" };
  return <>
    {!presenceFailed && <video ref={presence} src={PRESENCE} muted playsInline preload="auto" aria-label="Savannah" onLoadedData={() => setPresenceReady(true)} onError={() => setPresenceFailed(true)} style={{ ...style, opacity: presenceReady ? 1 : 0 }} />}
    {!failed && <video ref={video} src={SOURCE} muted playsInline preload="auto" aria-label="Savannah greeting" onLoadedData={() => { if (!greeting.current && video.current) video.current.currentTime = 3.92; setReady(true); }} onEnded={() => stop(true)} onError={() => { stop(); setFailed(true); }} style={{ ...style, zIndex: 4, opacity: ready && (greetingVisible || !presenceReady || presenceFailed) ? 1 : 0, transition: "opacity 180ms ease" }} />}
  </>;
});
