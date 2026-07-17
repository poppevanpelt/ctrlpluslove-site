"use client";

import { useEffect } from "react";

const ACTIVE_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 760px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "[role='button']",
  "summary",
  ".persona-card",
  ".persona-portrait",
  ".product-card",
  ".ambassador-face",
  ".steel-ball-signature-card",
  ".steel-ball-home-card",
  ".museum-card",
  ".theme-toggle",
  ".home-hero-cta",
  ".home-hero-secondary",
  ".text-link",
].join(",");
const NATIVE_SELECTOR = "input, textarea, select, option, [contenteditable='true']";
const RESPONSIVE_SELECTOR = [
  ".home-hero-cta",
  ".home-hero-secondary",
  ".product-card",
  ".steel-ball-signature-card",
  ".steel-ball-home-card",
  ".theme-toggle",
].join(",");

function closestElement(target: EventTarget | null) {
  if (!(target instanceof Node)) {
    return null;
  }

  return target instanceof Element ? target : target.parentElement;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SteelBallCursor() {
  useEffect(() => {
    const activeMedia = window.matchMedia(ACTIVE_QUERY);
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    let cursor: HTMLDivElement | null = null;
    let frame = 0;
    let enabled = false;
    let visible = false;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let renderX = pointerX;
    let renderY = pointerY;
    let targetScale = 1;
    let scale = 1;
    let activeTarget: Element | null = null;
    let responsiveTarget: Element | null = null;

    const clearResponsiveTarget = () => {
      if (responsiveTarget) {
        responsiveTarget.removeAttribute("data-steel-cursor-near");
        responsiveTarget = null;
      }
    };

    const setResponsiveTarget = (nextTarget: Element | null) => {
      if (responsiveTarget === nextTarget) {
        return;
      }

      clearResponsiveTarget();

      if (nextTarget) {
        responsiveTarget = nextTarget;
        responsiveTarget.setAttribute("data-steel-cursor-near", "true");
      }
    };

    const setNativeCursor = (isNative: boolean) => {
      document.documentElement.toggleAttribute("data-steel-cursor-native", isNative);
    };

    const updateTarget = (target: EventTarget | null) => {
      const element = closestElement(target);
      const nativeTarget = element?.closest(NATIVE_SELECTOR) ?? null;

      if (nativeTarget) {
        activeTarget = null;
        setResponsiveTarget(null);
        setNativeCursor(true);
        return;
      }

      setNativeCursor(false);
      activeTarget = element?.closest(INTERACTIVE_SELECTOR) ?? null;
      setResponsiveTarget(activeTarget?.closest(RESPONSIVE_SELECTOR) ?? null);
    };

    const render = () => {
      if (!enabled || !cursor) {
        return;
      }

      const reducedMotion = reducedMotionMedia.matches;
      let nextX = pointerX;
      let nextY = pointerY;
      const isInteractive = Boolean(activeTarget) && !document.documentElement.hasAttribute("data-steel-cursor-native");

      if (isInteractive && activeTarget && !reducedMotion) {
        const rect = activeTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        nextX = pointerX + clamp((centerX - pointerX) * 0.18, -18, 18);
        nextY = pointerY + clamp((centerY - pointerY) * 0.18, -18, 18);
      }

      targetScale = isInteractive ? 1.2 : 1;

      if (reducedMotion) {
        renderX = nextX;
        renderY = nextY;
        scale = targetScale;
      } else {
        renderX += (nextX - renderX) * 0.36;
        renderY += (nextY - renderY) * 0.36;
        scale += (targetScale - scale) * 0.28;
      }

      cursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%) scale(${scale})`;
      cursor.toggleAttribute("data-interactive", isInteractive);
      frame = window.requestAnimationFrame(render);
    };

    const enable = () => {
      if (enabled || !activeMedia.matches) {
        return;
      }

      enabled = true;
      cursor = document.createElement("div");
      cursor.className = "steel-ball-cursor";
      cursor.setAttribute("aria-hidden", "true");
      document.body.append(cursor);
      document.documentElement.classList.add("steel-ball-cursor-active");
      frame = window.requestAnimationFrame(render);
    };

    const disable = () => {
      enabled = false;
      visible = false;
      activeTarget = null;
      clearResponsiveTarget();
      setNativeCursor(false);
      document.documentElement.classList.remove("steel-ball-cursor-active");
      window.cancelAnimationFrame(frame);
      cursor?.remove();
      cursor = null;
    };

    const syncEnabled = () => {
      if (activeMedia.matches) {
        enable();
      } else {
        disable();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      visible = true;
      cursor?.toggleAttribute("data-visible", visible);
      updateTarget(event.target);
    };

    const handlePointerLeave = () => {
      visible = false;
      activeTarget = null;
      setResponsiveTarget(null);
      cursor?.removeAttribute("data-visible");
    };

    syncEnabled();
    activeMedia.addEventListener("change", syncEnabled);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      activeMedia.removeEventListener("change", syncEnabled);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      disable();
    };
  }, []);

  return null;
}
