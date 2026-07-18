"use client";

import { useEffect } from "react";

const ACTIVE_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 760px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SESSION_KEY = "ctrl-love-steel-ball-awakened";
const MEANINGFUL_MOTION_THRESHOLD = 8;
const SETTLING_DURATION = 720;
const HANDOFF_DURATION = 560;
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "[role='button']",
  "summary",
  ".persona-card",
  ".persona-portrait",
  ".product-card",
  ".ambassador-face",
  ".embassy-card",
  ".embassy-home-link",
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
  ".embassy-card",
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

type CursorState = "resting" | "awakening" | "cursor-active" | "skipped";
type RestingPosition = {
  hero: HTMLElement;
  x: number;
  y: number;
  localX: number;
  localY: number;
};

export function SteelBallCursor() {
  useEffect(() => {
    const activeMedia = window.matchMedia(ACTIVE_QUERY);
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    let stageBall: HTMLElement | null = null;
    let cursor: HTMLDivElement | null = null;
    let frame = 0;
    let armingTimeout = 0;
    let settlingFrame = 0;
    let handoffFrame = 0;
    let enabled = false;
    let visible = false;
    let originArmed = false;
    let state: CursorState = "skipped";
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let renderX = pointerX;
    let renderY = pointerY;
    let restX = pointerX;
    let restY = pointerY;
    let initialPointerX: number | null = null;
    let initialPointerY: number | null = null;
    let targetScale = 1;
    let scale = 1;
    let pressScale = 1;
    let isPressed = false;
    let activeTarget: Element | null = null;
    let previousInteractiveTarget: Element | null = null;
    let glintTimeout = 0;
    let previousFrameTime = performance.now();
    let slowFrameCount = 0;
    let routeObserver: MutationObserver | null = null;

    const isLocalReplay = () => {
      try {
        const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
        return isLocalPreview && new URLSearchParams(window.location.search).has("steel-ball-replay");
      } catch {
        return false;
      }
    };

    const isExtremeStagePrototype = () => {
      try {
        const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
        return isLocalPreview && new URLSearchParams(window.location.search).has("extreme-stage");
      } catch {
        return false;
      }
    };

    const canUseSteelCursor = () => activeMedia.matches || isLocalReplay();
    const shouldReduceMotion = () => reducedMotionMedia.matches && !isLocalReplay();

    const setState = (nextState: CursorState) => {
      state = nextState;
      document.documentElement.dataset.steelCursorState = nextState;
    };

    document.documentElement.toggleAttribute("data-steel-extreme-stage", isExtremeStagePrototype());

    const hasAwakenedThisSession = () => {
      try {
        if (isLocalReplay()) {
          window.sessionStorage.removeItem(SESSION_KEY);
          return false;
        }

        return window.sessionStorage.getItem(SESSION_KEY) === "true";
      } catch {
        return true;
      }
    };

    const markAwakened = () => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // Keep the native cursor available if session storage is unavailable.
      }
    };

    const getRestingPosition = (): RestingPosition | null => {
      const hero = document.querySelector<HTMLElement>(".home-hero-section");

      if (!hero) {
        return null;
      }

      const rect = hero.getBoundingClientRect();

      if (rect.bottom <= 0 || rect.top >= window.innerHeight || rect.width < 320 || rect.height < 260) {
        return null;
      }

      const x = clamp(rect.left + rect.width * 0.68, rect.left + 96, rect.right - 116);
      const y = clamp(rect.top + rect.height * 0.72, rect.top + 148, rect.bottom - 92);

      return {
        hero,
        x,
        y,
        localX: x - rect.left,
        localY: y - rect.top,
      };
    };

    const getStageOrigin = () => (
      document.querySelector<HTMLElement>(".home-hero-section .steel-ball-stage-ball")
    );

    const canActivateOriginFromTarget = (target: EventTarget | null) => {
      const element = closestElement(target);

      if (!element) {
        return false;
      }

      return Boolean(element.closest(".chapter-arrival-message"));
    };

    const removeStageOrigin = () => {
      const stage = stageBall?.closest(".steel-ball-stage-origin") ?? document.querySelector(".home-hero-section .steel-ball-stage-origin");
      stage?.remove();
      stageBall = null;
    };

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
      if (!cursor || shouldReduceMotion()) {
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

    const render = (time: number) => {
      if (!enabled || !cursor) {
        return;
      }

      if (state !== "cursor-active" && state !== "skipped") {
        frame = window.requestAnimationFrame(render);
        return;
      }

      const frameDelta = time - previousFrameTime;
      previousFrameTime = time;
      slowFrameCount = frameDelta > 80 ? slowFrameCount + 1 : Math.max(0, slowFrameCount - 1);

      if (slowFrameCount > 24) {
        disable();
        return;
      }

      const reducedMotion = shouldReduceMotion();
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

      targetScale = isInteractive ? 1.32 : 1;
      const targetPressScale = isPressed ? 0.72 : 1;

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

    const renderRestingBall = () => {
      if (!stageBall) {
        return;
      }

      originArmed = false;
      renderX = restX;
      renderY = restY;
      scale = 1;
      pressScale = 1;
      stageBall.setAttribute("data-visible", "true");
      stageBall.setAttribute("data-origin-resting", "true");

      if (shouldReduceMotion()) {
        stageBall.style.transform = "translate(-50%, -50%)";
        originArmed = true;
        return;
      }

      stageBall.setAttribute("data-origin-settling", "true");
      const startedAt = performance.now();

      const settle = (time: number) => {
        if (!enabled || !stageBall || state !== "resting") {
          return;
        }

        const progress = clamp((time - startedAt) / SETTLING_DURATION, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const rollX = (1 - eased) * -7;
        const settleY = Math.sin(progress * Math.PI) * -2.4 + (1 - eased) * -1.5;
        const rotation = (1 - eased) * -0.18;

        renderX = restX + rollX;
        renderY = restY + settleY;
        stageBall.style.transform = `translate(calc(-50% + ${rollX}px), calc(-50% + ${settleY}px)) rotate(${rotation}turn)`;

        if (progress >= 1) {
          stageBall.removeAttribute("data-origin-settling");
          stageBall.style.transform = "translate(-50%, -50%)";
          renderX = restX;
          renderY = restY;
          originArmed = true;
          return;
        }

        settlingFrame = window.requestAnimationFrame(settle);
      };

      settlingFrame = window.requestAnimationFrame(settle);
    };

    const beginCursorLoop = (nextState: CursorState, showImmediately = false) => {
      setState(nextState);
      document.documentElement.classList.add("steel-ball-cursor-active");
      cursor?.removeAttribute("data-origin-resting");
      cursor?.removeAttribute("data-origin-awakening");
      cursor?.removeAttribute("data-origin-settling");
      cursor?.toggleAttribute("data-visible", showImmediately);
      visible = showImmediately;
      previousFrameTime = performance.now();
      slowFrameCount = 0;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(render);
    };

    const completeHandoff = () => {
      if (!enabled || !cursor || state === "cursor-active" || state === "skipped") {
        return;
      }

      window.cancelAnimationFrame(handoffFrame);
      window.cancelAnimationFrame(settlingFrame);
      window.clearTimeout(armingTimeout);
      renderX = pointerX;
      renderY = pointerY;
      scale = 1;
      pressScale = 1;
      cursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%)`;
      markAwakened();
      beginCursorLoop("cursor-active", true);
    };

    const cancelOriginAndUseNativeCursor = () => {
      if (state === "cursor-active" || state === "skipped") {
        return;
      }

      window.cancelAnimationFrame(handoffFrame);
      window.cancelAnimationFrame(settlingFrame);
      window.clearTimeout(armingTimeout);
      removeStageOrigin();
      cursor?.remove();
      cursor = null;
      enabled = false;
      visible = false;
      setState("skipped");
      document.documentElement.classList.remove("steel-ball-cursor-active");
      setNativeCursor(false);
    };

    const startHandoff = (target: EventTarget | null) => {
      if (!enabled || !stageBall || state !== "resting" || !originArmed) {
        return;
      }

      setState("awakening");
      window.cancelAnimationFrame(settlingFrame);
      window.clearTimeout(armingTimeout);
      updateTarget(target);

      const rect = stageBall.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      const startScale = Math.max(1, rect.width / 16);
      restX = startX;
      restY = startY;
      renderX = startX;
      renderY = startY;

      cursor = document.createElement("div");
      cursor.className = "steel-ball-cursor";
      cursor.setAttribute("aria-hidden", "true");
      cursor.style.transform = `translate3d(${startX}px, ${startY}px, 0) translate(-50%, -50%) scale(${startScale})`;
      cursor.setAttribute("data-origin-awakening", "true");
      cursor.setAttribute("data-visible", "true");
      document.body.append(cursor);

      removeStageOrigin();

      const liftX = clamp(pointerX - startX, -20, 20);
      const liftY = clamp(pointerY - startY, -18, 10) - 18;
      const startedAt = performance.now();

      const animateHandoff = (time: number) => {
        if (!enabled || !cursor || state !== "awakening") {
          return;
        }

        const progress = clamp((time - startedAt) / HANDOFF_DURATION, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const lift = Math.sin(progress * Math.PI);
        const x = startX + (pointerX - startX) * eased + liftX * lift * 0.36;
        const y = startY + (pointerY - startY) * eased + liftY * lift * 0.34;
        const rotation = progress * 0.72;
        const handoffScale = startScale + (1 - startScale) * eased;

        renderX = x;
        renderY = y;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotation}turn) scale(${handoffScale})`;

        if (progress >= 1) {
          completeHandoff();
          return;
        }

        handoffFrame = window.requestAnimationFrame(animateHandoff);
      };

      handoffFrame = window.requestAnimationFrame(animateHandoff);
    };

    const enable = () => {
      if (enabled || !canUseSteelCursor()) {
        return;
      }

      enabled = true;
      initialPointerX = null;
      initialPointerY = null;

      const restingPosition = getRestingPosition();
      const shouldSkipOrigin = shouldReduceMotion() || hasAwakenedThisSession() || !restingPosition;

      if (shouldSkipOrigin) {
        removeStageOrigin();
        cursor = document.createElement("div");
        cursor.className = "steel-ball-cursor";
        cursor.setAttribute("aria-hidden", "true");
        document.body.append(cursor);
        beginCursorLoop("skipped");
        return;
      }

      restX = restingPosition.x;
      restY = restingPosition.y;
      stageBall = getStageOrigin();

      if (!stageBall) {
        const stage = document.createElement("span");
        stage.className = "steel-ball-stage-origin";
        stage.style.left = `${restingPosition.localX}px`;
        stage.style.top = `${restingPosition.localY}px`;
        stageBall = document.createElement("span");
        stageBall.className = "steel-ball-cursor steel-ball-stage-ball";
        stageBall.setAttribute("aria-hidden", "true");
        stage.append(stageBall);
        restingPosition.hero.append(stage);
      }

      const stageRect = stageBall.getBoundingClientRect();
      restX = stageRect.left + stageRect.width / 2;
      restY = stageRect.top + stageRect.height / 2;
      setState("resting");
      renderRestingBall();
      armingTimeout = window.setTimeout(() => {
        originArmed = true;
        stageBall?.removeAttribute("data-origin-settling");
      }, SETTLING_DURATION + 120);
    };

    const disable = () => {
      enabled = false;
      visible = false;
      isPressed = false;
      activeTarget = null;
      previousInteractiveTarget = null;
      window.clearTimeout(glintTimeout);
      window.clearTimeout(armingTimeout);
      window.cancelAnimationFrame(settlingFrame);
      window.cancelAnimationFrame(handoffFrame);
      setNativeCursor(false);
      setState("skipped");
      document.documentElement.removeAttribute("data-steel-cursor-state");
      document.documentElement.removeAttribute("data-steel-extreme-stage");
      document.documentElement.classList.remove("steel-ball-cursor-active");
      window.cancelAnimationFrame(frame);
      removeStageOrigin();
      cursor?.remove();
      cursor = null;
    };

    const skipOriginAndEnableCursor = () => {
      if (state === "cursor-active" || state === "skipped") {
        return;
      }

      window.cancelAnimationFrame(handoffFrame);
      window.cancelAnimationFrame(settlingFrame);
      window.clearTimeout(armingTimeout);
      removeStageOrigin();
      cursor?.remove();
      cursor = null;
      enabled = false;
      visible = false;
      setNativeCursor(false);
      setState("skipped");
      enable();
    };

    const syncEnabled = () => {
      if (!canUseSteelCursor()) {
        disable();
        return;
      }

      if (enabled && shouldReduceMotion() && state === "resting") {
        disable();
      }

      enable();
    };

    const updateCursorPosition = (
      clientX: number,
      clientY: number,
      target: EventTarget | null,
    ) => {
      pointerX = clientX;
      pointerY = clientY;

      if (state === "awakening") {
        updateTarget(target);
        return;
      }

      if (state === "resting") {
        if (!originArmed) {
          initialPointerX = clientX;
          initialPointerY = clientY;
          updateTarget(target);
          return;
        }

        if (initialPointerX === null || initialPointerY === null) {
          initialPointerX = clientX;
          initialPointerY = clientY;
          updateTarget(target);
          return;
        }

        const deltaX = clientX - initialPointerX;
        const deltaY = clientY - initialPointerY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < MEANINGFUL_MOTION_THRESHOLD) {
          updateTarget(target);
          return;
        }

        if (!canActivateOriginFromTarget(target)) {
          initialPointerX = clientX;
          initialPointerY = clientY;
          updateTarget(target);
          return;
        }

        if (isExtremeStagePrototype()) {
          initialPointerX = clientX;
          initialPointerY = clientY;
          updateTarget(target);
          return;
        }

        startHandoff(target);
        return;
      }

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

      if (state === "resting") {
        if (canActivateOriginFromTarget(event.target)) {
          startHandoff(event.target);
        }
      }
    };

    const handlePointerUp = () => {
      isPressed = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      updateCursorPosition(event.clientX, event.clientY, event.target);
    };

    const handlePointerLeave = () => {
      if (state === "awakening") {
        completeHandoff();
      }

      visible = false;
      isPressed = false;
      activeTarget = null;
      previousInteractiveTarget = null;
      cursor?.removeAttribute("data-visible");
      cursor?.removeAttribute("data-glint");
    };

    const handleBlurOrVisibilityChange = () => {
      if (state === "awakening") {
        completeHandoff();
      }
    };

    const handleRouteMutation = () => {
      if ((state === "resting" || state === "awakening") && !document.querySelector(".home-hero-section")) {
        if (state === "awakening") {
          completeHandoff();
          return;
        }

        skipOriginAndEnableCursor();
      }
    };

    syncEnabled();
    routeObserver = new MutationObserver(handleRouteMutation);
    routeObserver.observe(document.body, { childList: true, subtree: true });
    activeMedia.addEventListener("change", syncEnabled);
    reducedMotionMedia.addEventListener("change", syncEnabled);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("blur", handleBlurOrVisibilityChange);
    document.addEventListener("visibilitychange", handleBlurOrVisibilityChange);
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      activeMedia.removeEventListener("change", syncEnabled);
      reducedMotionMedia.removeEventListener("change", syncEnabled);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleBlurOrVisibilityChange);
      document.removeEventListener("visibilitychange", handleBlurOrVisibilityChange);
      document.removeEventListener("pointerleave", handlePointerLeave);
      routeObserver?.disconnect();
      cancelOriginAndUseNativeCursor();
      disable();
    };
  }, []);

  return null;
}
