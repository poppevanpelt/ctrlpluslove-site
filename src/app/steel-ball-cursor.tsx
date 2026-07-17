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
const CARD_EDGE_SELECTOR = [
  ".persona-card",
  ".product-card",
  ".ambassador-face",
  ".steel-ball-signature-card",
  ".steel-ball-home-card",
  ".museum-card",
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
    let pressScale = 1;
    let isPressed = false;
    let activeTarget: Element | null = null;
    let previousInteractiveTarget: Element | null = null;
    let glintTimeout = 0;

    const setNativeCursor = (isNative: boolean) => {
      document.documentElement.toggleAttribute("data-steel-cursor-native", isNative);
    };

    const updateTarget = (target: EventTarget | null) => {
      const element = closestElement(target);
      const nativeTarget = element?.closest(NATIVE_SELECTOR) ?? null;

      if (nativeTarget) {
        activeTarget = null;
        setNativeCursor(true);
        return;
      }

      setNativeCursor(false);
      activeTarget = element?.closest(INTERACTIVE_SELECTOR) ?? null;
    };

    const triggerGlint = () => {
      if (!cursor || reducedMotionMedia.matches) {
        return;
      }

      cursor.removeAttribute("data-glint");
      window.clearTimeout(glintTimeout);
      window.requestAnimationFrame(() => {
        cursor?.setAttribute("data-glint", "true");
        glintTimeout = window.setTimeout(() => {
          cursor?.removeAttribute("data-glint");
        }, 680);
      });
    };

    const getCardEdgeOffset = (target: Element | null) => {
      const edgeTarget = target?.closest(CARD_EDGE_SELECTOR);

      if (!edgeTarget) {
        return { x: 0, y: 0 };
      }

      const rect = edgeTarget.getBoundingClientRect();

      if (
        pointerX < rect.left ||
        pointerX > rect.right ||
        pointerY < rect.top ||
        pointerY > rect.bottom
      ) {
        return { x: 0, y: 0 };
      }

      const edgeZone = 26;
      const force = 2.8;
      const left = pointerX - rect.left;
      const right = rect.right - pointerX;
      const top = pointerY - rect.top;
      const bottom = rect.bottom - pointerY;
      let x = 0;
      let y = 0;

      if (left < edgeZone) {
        x += (1 - left / edgeZone) * force;
      } else if (right < edgeZone) {
        x -= (1 - right / edgeZone) * force;
      }

      if (top < edgeZone) {
        y += (1 - top / edgeZone) * force;
      } else if (bottom < edgeZone) {
        y -= (1 - bottom / edgeZone) * force;
      }

      return { x, y };
    };

    const render = () => {
      if (!enabled || !cursor) {
        return;
      }

      const reducedMotion = reducedMotionMedia.matches;
      let nextX = pointerX;
      let nextY = pointerY;
      const isInteractive = Boolean(activeTarget) && !document.documentElement.hasAttribute("data-steel-cursor-native");

      if (isInteractive && activeTarget !== previousInteractiveTarget) {
        triggerGlint();
      }

      previousInteractiveTarget = isInteractive ? activeTarget : null;

      if (isInteractive && activeTarget && !reducedMotion) {
        const rect = activeTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const edgeOffset = getCardEdgeOffset(activeTarget);
        nextX = pointerX + clamp((centerX - pointerX) * 0.07, -8, 8) + edgeOffset.x;
        nextY = pointerY + clamp((centerY - pointerY) * 0.07, -8, 8) + edgeOffset.y;
      }

      targetScale = isInteractive ? 1.14 : 1;
      const targetPressScale = isPressed ? 0.86 : 1;

      if (reducedMotion) {
        renderX = nextX;
        renderY = nextY;
        scale = targetScale;
        pressScale = targetPressScale;
      } else {
        renderX += (nextX - renderX) * 0.46;
        renderY += (nextY - renderY) * 0.46;
        scale += (targetScale - scale) * 0.22;
        pressScale += (targetPressScale - pressScale) * 0.5;
      }

      cursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%) scale(${scale}) scale(${pressScale})`;
      cursor.toggleAttribute("data-interactive", isInteractive);
      cursor.toggleAttribute("data-clicking", isPressed);
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
      isPressed = false;
      activeTarget = null;
      previousInteractiveTarget = null;
      window.clearTimeout(glintTimeout);
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

    const updateCursorPosition = (
      clientX: number,
      clientY: number,
      target: EventTarget | null,
    ) => {
      pointerX = clientX;
      pointerY = clientY;
      visible = true;
      cursor?.toggleAttribute("data-visible", visible);
      updateTarget(target);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      updateCursorPosition(event.clientX, event.clientY, event.target);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      isPressed = true;
      updateCursorPosition(event.clientX, event.clientY, event.target);
    };

    const handlePointerUp = () => {
      isPressed = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      updateCursorPosition(event.clientX, event.clientY, event.target);
    };

    const handlePointerLeave = () => {
      visible = false;
      isPressed = false;
      activeTarget = null;
      previousInteractiveTarget = null;
      cursor?.removeAttribute("data-visible");
      cursor?.removeAttribute("data-glint");
    };

    syncEnabled();
    activeMedia.addEventListener("change", syncEnabled);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      activeMedia.removeEventListener("change", syncEnabled);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      disable();
    };
  }, []);

  return null;
}
