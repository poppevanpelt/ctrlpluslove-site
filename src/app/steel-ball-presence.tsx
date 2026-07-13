"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import type { PointerEvent } from "react";

export function SteelBallPresence() {
  const frame = useRef<number | null>(null);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    if (frame.current !== null) {
      window.cancelAnimationFrame(frame.current);
    }

    frame.current = window.requestAnimationFrame(() => {
      element.style.setProperty("--steel-tilt-x", `${(y * -8).toFixed(2)}deg`);
      element.style.setProperty("--steel-tilt-y", `${(x * 10).toFixed(2)}deg`);
      element.style.setProperty("--steel-shift-x", `${(x * 0.8).toFixed(2)}rem`);
      element.style.setProperty("--steel-shift-y", `${(y * 0.6).toFixed(2)}rem`);
    });
  }, []);

  const resetPointer = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    if (frame.current !== null) {
      window.cancelAnimationFrame(frame.current);
      frame.current = null;
    }

    event.currentTarget.style.removeProperty("--steel-tilt-x");
    event.currentTarget.style.removeProperty("--steel-tilt-y");
    event.currentTarget.style.removeProperty("--steel-shift-x");
    event.currentTarget.style.removeProperty("--steel-shift-y");
  }, []);

  return (
    <Link
      className="steel-ball-signature-card"
      href="/steel-ball/"
      onPointerLeave={resetPointer}
      onPointerMove={handlePointerMove}
    >
      <span className="steel-ball-signature-copy">
        <span className="section-kicker">Artifact 001</span>
        <strong>The Steel Ball</strong>
        <span>
          A physical reminder to test confidence before reality does. Useful on
          desks. Slightly rude in meetings. Exactly the point.
        </span>
        <em>View the object</em>
      </span>
      <span className="steel-ball-signature-stage" aria-hidden="true">
        <span className="steel-ball-object" />
      </span>
    </Link>
  );
}
