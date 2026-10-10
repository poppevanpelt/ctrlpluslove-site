"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const SOURCE = "https://d8j0ntlcm91z4.cloudfront.net/user_3KNACbddGNvgqJBvAUAT5DoeYO3/hf_20261010_195143_7a75e120-da0a-4031-adc6-6ff467062f1c.mp4";
export type SavannahPerformanceHandle = { greet: () => Promise<boolean>; stop: () => void };
type Props = { phase: "waiting" | "listening" | "thinking" | "speaking"; onGreetingChange?: (active: boolean) => void };

// Only the recorded hello uses the speaking section. Unrelated live replies
// never borrow its mouth movements. Silent windows are outside 1.8–3.6s.
export const SavannahPerformance = forwardRef<SavannahPerformanceHandle, Props>(function SavannahPerformance({ phase, onGreetingChange }, ref) {
  const video = useRef<HTMLVideoElement>(null);
  const greeting = useRef(false);
  const finish = useRef<((completed: boolean) => void) | null>(null);
  const nextMove = useRef(0);
  const end = useRef(4.92);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  function stop(completed = false) {
    const player = video.current;
    if (player) { player.pause(); player.muted = true; }
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
    const player = video.current;
    if (!player || !ready || failed) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const schedule = () => { nextMove.current = performance.now() + 4000 + Math.random() * 4500; };
    if (!greeting.current) {
      player.pause(); player.muted = true;
      player.currentTime = phase === "thinking" ? 0 : 3.92;
      end.current = phase === "thinking" ? 0.65 : 4.92;
      if (!reduced && phase !== "speaking") void player.play().catch(() => {});
      schedule();
    }
    let frame = 0;
    const tick = () => {
      if (!greeting.current) {
        if (document.hidden || reduced || phase === "speaking") player.pause();
        else if (!player.paused && player.currentTime >= end.current) { player.pause(); schedule(); }
        else if (player.paused && performance.now() >= nextMove.current) {
          // Subsequent natural breaths use the settled section, with pauses
          // between plays instead of an endless five-second talking loop.
          player.muted = true; player.currentTime = 3.92; end.current = 4.92;
          void player.play().catch(() => {}); schedule();
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, ready, failed]);

  useEffect(() => () => { video.current?.pause(); finish.current?.(false); }, []);

  if (failed) return null;
  return <video ref={video} src={SOURCE} muted playsInline preload="auto" aria-label="Savannah" onLoadedData={() => { if (!greeting.current && video.current) video.current.currentTime = 3.92; setReady(true); }} onEnded={() => stop(true)} onError={() => { stop(); setFailed(true); }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#272421", zIndex: 3, opacity: ready ? 1 : 0, pointerEvents: "none" }} />;
});
