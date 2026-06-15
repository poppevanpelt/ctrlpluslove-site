"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type DocumentViewerProps = {
  alt: string;
  height: number;
  initialScale: number;
  initialX: number;
  initialY: number;
  src: string;
  width: number;
};

const ZOOM_STEPS = [1, 0.82, 0.62, 0.42, 0] as const;

export function DocumentViewer({
  alt,
  height,
  initialScale,
  initialX,
  initialY,
  src,
  width,
}: DocumentViewerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const imageRatio = width / height;
  const progress = ZOOM_STEPS[step];
  const scale = 1 + (initialScale - 1) * progress;

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    requestAnimationFrame(() => {
      const maxLeft = frame.scrollWidth - frame.clientWidth;
      const maxTop = frame.scrollHeight - frame.clientHeight;
      const xOffset = frame.clientWidth * (initialX / 100) * progress;
      const yOffset = frame.clientHeight * (initialY / 100) * progress;

      frame.scrollLeft = Math.max(0, Math.min(maxLeft, maxLeft / 2 - xOffset));
      frame.scrollTop = Math.max(0, Math.min(maxTop, maxTop / 2 - yOffset));
    });
  }, [initialX, initialY, progress, scale]);

  return (
    <main className="document-page">
      <Link className="document-back" href="/">
        ctrl+love
      </Link>
      <div className="document-frame" ref={frameRef}>
        <div
          className="document-scroll-surface"
          style={{
            "--document-ratio": imageRatio,
            "--document-scale": scale,
            "--document-fit-width": `min(100vw, calc(100svh * ${imageRatio}))`,
          } as CSSProperties &
            Record<
              "--document-fit-width" | "--document-ratio" | "--document-scale",
              number | string
            >}
        >
          {/* Plain img keeps the exported file:// preview self-contained. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="document-image"
            src={src}
            alt={alt}
            width={width}
            height={height}
          />
        </div>
      </div>
      <div className="document-controls" aria-label="Document zoom controls">
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() =>
            setStep((current) => Math.min(current + 1, ZOOM_STEPS.length - 1))
          }
          disabled={step === ZOOM_STEPS.length - 1}
        >
          -
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          disabled={step === 0}
        >
          +
        </button>
      </div>
    </main>
  );
}
