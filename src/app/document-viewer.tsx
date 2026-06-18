"use client";

import Link from "next/link";
import { useState } from "react";
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
  const [step, setStep] = useState(0);

  const imageRatio = width / height;
  const progress = ZOOM_STEPS[step];
  const scale = 1 + (initialScale - 1) * progress;
  const x = initialX * progress;
  const y = initialY * progress;
  const transform = `translate(-50%, -50%) translate(${x}vw, ${y}vh) scale(${scale})`;

  return (
    <main className="document-page">
      <Link className="document-back" href="/">
        ctrl+love
      </Link>
      <div className="document-frame">
        {/* Plain img keeps the exported file:// preview self-contained. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="document-image"
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{
            "--document-ratio": imageRatio,
            transform,
          } as CSSProperties & Record<"--document-ratio", number>}
        />
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
