"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, PointerEvent, WheelEvent } from "react";

type DocumentViewerProps = {
  alt: string;
  height: number;
  initialScale: number;
  initialX: number;
  initialY: number;
  src: string;
  width: number;
};

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
  const dragRef = useRef({
    pointerId: -1,
    startLeft: 0,
    startTop: 0,
    startX: 0,
    startY: 0,
  });
  const [scale, setScale] = useState(initialScale);
  const [isDragging, setIsDragging] = useState(false);

  const imageRatio = width / height;
  const documentOrientation = width >= height ? "landscape" : "portrait";

  const setInitialScroll = useCallback(() => {
    const frame = frameRef.current;
    const image = frame?.querySelector<HTMLImageElement>(".document-image");

    if (!frame || !image) {
      return;
    }

    const maxLeft = Math.max(0, frame.scrollWidth - frame.clientWidth);
    const maxTop = Math.max(0, frame.scrollHeight - frame.clientHeight);
    const centerLeft = image.offsetLeft + image.clientWidth / 2 - frame.clientWidth / 2;
    const centerTop = image.offsetTop + image.clientHeight / 2 - frame.clientHeight / 2;
    const initialLeft = centerLeft + (initialX / 100) * maxLeft;
    const initialTop = centerTop + (initialY / 100) * maxTop;

    frame.scrollTo({
      left: Math.min(maxLeft, Math.max(0, initialLeft)),
      top: Math.min(maxTop, Math.max(0, initialTop)),
      behavior: "auto",
    });
  }, [initialX, initialY]);

  const zoomFromPoint = useCallback((nextScale: number, x: number, y: number) => {
    const frame = frameRef.current;

    if (!frame) {
      setScale(nextScale);
      return;
    }

    const bounds = frame.getBoundingClientRect();
    const beforeLeft = frame.scrollLeft + x - bounds.left;
    const beforeTop = frame.scrollTop + y - bounds.top;
    const previousScale = scale;
    const ratio = nextScale / previousScale;

    setScale(nextScale);

    requestAnimationFrame(() => {
      frame.scrollTo({
        left: beforeLeft * ratio - (x - bounds.left),
        top: beforeTop * ratio - (y - bounds.top),
        behavior: "auto",
      });
    });
  }, [scale]);

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    event.preventDefault();

    const nextScale = Math.min(
      2.8,
      Math.max(1, scale * (event.deltaY > 0 ? 0.9 : 1.1)),
    );

    zoomFromPoint(nextScale, event.clientX, event.clientY);
  }, [scale, zoomFromPoint]);

  const handleDoubleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const nextScale = scale > 1.05 ? 1 : 1.85;
    zoomFromPoint(nextScale, event.clientX, event.clientY);
  }, [scale, zoomFromPoint]);

  const stopDragging = useCallback((event?: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;

    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (frame) {
      frame.classList.remove("is-dragging");
    }

    dragRef.current.pointerId = -1;
    setIsDragging(false);
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || event.ctrlKey || event.metaKey) {
      return;
    }

    const frame = frameRef.current;

    if (!frame || (frame.scrollWidth <= frame.clientWidth && frame.scrollHeight <= frame.clientHeight)) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startLeft: frame.scrollLeft,
      startTop: frame.scrollTop,
      startX: event.clientX,
      startY: event.clientY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    frame.classList.add("is-dragging");
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    const drag = dragRef.current;

    if (!frame || drag.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    frame.scrollLeft = drag.startLeft - (event.clientX - drag.startX);
    frame.scrollTop = drag.startTop - (event.clientY - drag.startY);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const image = frame?.querySelector<HTMLImageElement>(".document-image");

    if (!frame || !image) {
      return;
    }

    const place = () => requestAnimationFrame(setInitialScroll);

    if (image.complete) {
      place();
    } else {
      image.addEventListener("load", place, { once: true });
    }

    window.addEventListener("resize", place);

    return () => {
      image.removeEventListener("load", place);
      window.removeEventListener("resize", place);
    };
  }, [setInitialScroll]);

  return (
    <main className="document-page">
      <Link className="document-back" href="/">
        ctrl+love
      </Link>
      <div
        className={`document-frame${isDragging ? " is-dragging" : ""}`}
        ref={frameRef}
        onDoubleClick={handleDoubleClick}
        onLostPointerCapture={stopDragging}
        onPointerCancel={stopDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onWheel={handleWheel}
      >
        <div className="document-canvas" data-document-orientation={documentOrientation}>
          {/* Plain img keeps the exported file:// preview self-contained. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="document-image"
            src={src}
            alt={alt}
            width={width}
            height={height}
            draggable={false}
            data-initial-scale={initialScale}
            data-initial-x={initialX}
            data-initial-y={initialY}
            data-document-orientation={documentOrientation}
            style={{
              "--document-ratio": imageRatio,
              "--document-scale": scale,
              "--document-natural-width": width,
            } as CSSProperties &
              Record<
                | "--document-ratio"
                | "--document-scale"
                | "--document-natural-width",
                number
              >}
          />
        </div>
      </div>
    </main>
  );
}
