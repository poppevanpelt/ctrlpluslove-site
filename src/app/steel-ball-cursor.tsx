"use client";

import { useEffect } from "react";

import { applyBallAppearance, clearBallAppearance } from "@/lib/steelBall/ballAppearance";
import { installSteelBallBrowserApi, steelBall } from "@/lib/steelBall/ballMemory";
import {
  createGravityState,
  getSettledEdge,
  normalizeDeviceMotion,
  normalizeDeviceOrientation,
  normalizeGravityVector,
  smoothGravityVector,
  stepGravitySimulation,
  type GravityBounds,
} from "@/lib/steelBall/ballGravity";
import { createSteelBallPresenceEngine } from "@/lib/steelBall/ballPresence";
import type { SteelBallState } from "@/lib/steelBall/ballState";
import type { BallGravityState, GravityVector } from "@/lib/steelBall/types";

const ACTIVE_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 760px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SETTLING_DURATION = 720;
const HANDOFF_DURATION = 560;
const BORROW_DURATION = 740;
const RETURN_DURATION = 820;
const CURSOR_IDLE_GRAVITY_DELAY = 520;
const CURSOR_GRAVITY_RADIUS = 34;
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

type CursorState = "resting" | "awakening" | "cursor-active" | "borrowed" | "skipped";
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
    let borrowFrame = 0;
    let returnFrame = 0;
    let gravityFrame = 0;
    let tiltFallbackFrame = 0;
    let followRepairTimeout = 0;
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
    let stageOriginCreatedByCursor = false;
    let currentBallState: SteelBallState = steelBall.getState();
    let unsubscribeSteelBall: (() => void) | null = null;
    let returnAudioContext: AudioContext | null = null;
    let gravityState: BallGravityState = createGravityState();
    let gravityVector: GravityVector = { x: 0, y: 0, confidence: 0 };
    let gravityLastTime = 0;
    let tiltFallbackLastTime = 0;
    let tiltFallbackDirection = 1;
    let gravityListening = false;
    let gravityActive = false;
    let gravityPermissionDismissed = false;
    let gravityStartedRecorded = false;
    let cursorGravityState: BallGravityState = createGravityState();
    let cursorGravityLastTime = 0;
    let lastPointerControlAt = performance.now();
    let lastGravityInput = "none";
    let debugGravityFrame = 0;
    let hasMousePointerControl = false;
    let rollRotation = 0;
    let motionLeanX = 0;
    let motionLeanY = 0;
    let lastImpactAt = 0;
    let lastPointerMoveAt = performance.now();
    let lastScrollAt = 0;
    let lastIntegrityTickAt = 0;
    const presence = createSteelBallPresenceEngine(currentBallState.identity.id);

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

    const isDebugGravityPreview = () => {
      try {
        const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
        return (
          process.env.NODE_ENV !== "production" &&
          isLocalPreview &&
          new URLSearchParams(window.location.search).has("steel-ball-debug-gravity")
        );
      } catch {
        return false;
      }
    };

    const isTiltGravityMode = () => {
      try {
        if (process.env.NODE_ENV === "production") {
          return false;
        }

        const params = new URLSearchParams(window.location.search);
        const viewMode = params.get("v") ?? params.get("view") ?? "";
        const explicitPreview = params.has("steel-ball-tilt") ||
          params.has("steel-ball-preview") ||
          params.has("preview") ||
          viewMode.includes("preview");
        const embeddedPreview = window.self !== window.top;
        const referrerPreview = document.referrer.includes("preview") || document.referrer.includes("codex");

        return explicitPreview || embeddedPreview || referrerPreview;
      } catch {
        return false;
      }
    };

    const canUseSteelCursor = () =>
      !isTiltGravityMode() &&
      (hasMousePointerControl || activeMedia.matches || isLocalReplay() || isDebugGravityPreview());
    const shouldReduceMotion = () => reducedMotionMedia.matches && !isLocalReplay();
    const canUseOrientationGravity = () => {
      if (shouldReduceMotion() || typeof window === "undefined") {
        return false;
      }

      return "DeviceOrientationEvent" in window;
    };
    const canUseMotionGravity = () => {
      if (shouldReduceMotion() || typeof window === "undefined") {
        return false;
      }

      return "DeviceMotionEvent" in window;
    };
    const canUseSensorGravity = () => canUseOrientationGravity() || canUseMotionGravity() || isDebugGravityPreview() || isTiltGravityMode();
    const canUseSteelBallExperience = () => canUseSteelCursor() || canUseSensorGravity();

    if (isTiltGravityMode()) {
      const previewBall = document.createElement("span");
      const previewShadow = document.createElement("span");
      const getPreviewFloorY = () => clamp(window.innerHeight * 0.68, 128, window.innerHeight - 150);
      const getPreviewStartSnapshot = () => {
        const existingBall = document.querySelector<HTMLElement>(".home-hero-section .steel-ball-stage-ball");
        const existingRect = existingBall?.getBoundingClientRect();

        if (existingRect && existingRect.width > 0 && existingRect.height > 0) {
          return {
            x: existingRect.left + existingRect.width / 2,
            y: getPreviewFloorY(),
            width: existingRect.width,
            height: existingRect.height,
          };
        }

        return {
          x: window.innerWidth / 2,
          y: getPreviewFloorY(),
          width: 28,
          height: 28,
        };
      };
      const previewSnapshot = getPreviewStartSnapshot();
      let previewPosition = { x: previewSnapshot.x, y: previewSnapshot.y };
      const previewDiameter = clamp(Math.max(previewSnapshot.width, previewSnapshot.height), 34, 48);
      const previewSize = { width: previewDiameter, height: previewDiameter };
      let previewFrame = 0;
      let previewLastTime = 0;
      let previewRoll = 0;
      let previewGravity: GravityVector = { x: 0, y: 0, confidence: 0 };
      let previewGravityInput = "none";
      let previewGravityState = createGravityState(previewPosition, previewGravity);
      let previewPointerActive = false;
      let previewPointerLast = { x: previewPosition.x, y: previewPosition.y };
      let previewPointerVelocity = { x: 0, y: 0 };
      let previewPointerLastSeenAt = 0;
      let previewPointerEventSeenAt = 0;
      let previewPointerKnown = false;
      let previewHasLanded = false;
      let previewLandedAt = 0;
      let previewLastTouchAt = 0;
      let previewTouchInfluenceX = 0;
      let previewFallbackDirection = 1;
      let previewFallbackLastFlipAt = 0;
      let previewFallbackRollStartedAt = 0;
      let previewSensorSeenAt = 0;
      let previewSensorListening = false;
      let previewSensorStatus = "starting";
      let previewSensorNoDataTimeout = 0;
      const previewGenericSensors: Array<{ stop?: () => void }> = [];
      const previousPreviewWindowMouseMove = window.onmousemove;
      const previousPreviewDocumentMouseMove = document.onmousemove;
      const previousPreviewWindowPointerMove = window.onpointermove;
      const previousPreviewDocumentPointerMove = document.onpointermove;

      const updatePreviewSensorLabel = () => {
        previewBall.setAttribute("data-steel-preview-version", "visible-roll-v48");
        previewBall.setAttribute("data-steel-sensor-status", previewSensorStatus);
      };

      const getPreviewScreenAngle = () => {
        const orientation = window.screen?.orientation;

        if (typeof orientation?.angle === "number") {
          return orientation.angle;
        }

        return typeof window.orientation === "number" ? window.orientation : 0;
      };

      const usePreviewSensorGravity = (nextGravity: GravityVector, input: string) => {
        if (nextGravity.confidence <= 0) {
          return;
        }

        previewGravity = smoothGravityVector(previewGravity, nextGravity);
        previewGravityInput = input;
        previewSensorStatus = input;
        previewSensorSeenAt = performance.now();
        updatePreviewSensorLabel();
      };

      const handlePreviewOrientation = (event: DeviceOrientationEvent) => {
        usePreviewSensorGravity(
          normalizeDeviceOrientation({
            beta: event.beta,
            gamma: event.gamma,
            screenAngle: getPreviewScreenAngle(),
          }),
          "sensor-tilt",
        );
      };

      const handlePreviewMotion = (event: DeviceMotionEvent) => {
        const acceleration = event.accelerationIncludingGravity;

        if (!acceleration) {
          return;
        }

        usePreviewSensorGravity(
          normalizeDeviceMotion({
            x: acceleration.x,
            y: acceleration.y,
            screenAngle: getPreviewScreenAngle(),
          }),
          "sensor-motion",
        );
      };

      const startPreviewGravityListening = () => {
        if (previewSensorListening) {
          return;
        }

        previewSensorListening = true;
        let installedListener = false;
        if ("DeviceOrientationEvent" in window) {
          window.addEventListener("deviceorientation", handlePreviewOrientation, { passive: true });
          window.addEventListener("deviceorientationabsolute", handlePreviewOrientation, { passive: true });
          installedListener = true;
        }
        if ("DeviceMotionEvent" in window) {
          window.addEventListener("devicemotion", handlePreviewMotion, { passive: true });
          installedListener = true;
        }

        type PreviewGenericSensor = {
          x?: number | null;
          y?: number | null;
          quaternion?: [number, number, number, number] | Float32Array | null;
          start: () => void;
          stop?: () => void;
          addEventListener: (type: "reading" | "error", listener: EventListener) => void;
        };
        type PreviewSensorConstructor = new (options?: { frequency?: number }) => PreviewGenericSensor;
        const sensorWindow = window as Window & {
          GravitySensor?: PreviewSensorConstructor;
          Accelerometer?: PreviewSensorConstructor;
          AbsoluteOrientationSensor?: PreviewSensorConstructor;
          RelativeOrientationSensor?: PreviewSensorConstructor;
        };
        const gravityFromQuaternion = (quaternion: PreviewGenericSensor["quaternion"]): GravityVector => {
          if (!quaternion || quaternion.length < 4) {
            return { x: 0, y: 0, confidence: 0 };
          }

          const [qx, qy, qz, qw] = Array.from(quaternion);
          if (![qx, qy, qz, qw].every(Number.isFinite)) {
            return { x: 0, y: 0, confidence: 0 };
          }

          return normalizeGravityVector({
            x: clamp(2 * (qx * qz - qw * qy), -1, 1),
            y: clamp(2 * (qy * qz + qw * qx), -1, 1),
            confidence: 0.74,
          });
        };
        const startGenericSensor = (SensorConstructor: PreviewSensorConstructor | undefined, input: string) => {
          if (!SensorConstructor) {
            return;
          }

          try {
            const sensor = new SensorConstructor({ frequency: 30 });
            sensor.addEventListener("reading", () => {
              usePreviewSensorGravity(
                sensor.quaternion
                  ? gravityFromQuaternion(sensor.quaternion)
                  : normalizeDeviceMotion({
                      x: sensor.x,
                      y: sensor.y,
                      screenAngle: getPreviewScreenAngle(),
                    }),
                input,
              );
            });
            sensor.addEventListener("error", () => {
              previewSensorStatus = "sensor-blocked";
              updatePreviewSensorLabel();
            });
            sensor.start();
            previewGenericSensors.push(sensor);
            installedListener = true;
          } catch {
            previewSensorStatus = "sensor-blocked";
          }
        };

        startGenericSensor(sensorWindow.GravitySensor, "gravity-sensor");
        startGenericSensor(sensorWindow.Accelerometer, "accelerometer");
        startGenericSensor(sensorWindow.AbsoluteOrientationSensor, "absolute-orientation");
        startGenericSensor(sensorWindow.RelativeOrientationSensor, "relative-orientation");

        if (!installedListener) {
          previewSensorStatus = "sensor-unavailable";
        } else if (!previewSensorSeenAt) {
          previewSensorStatus = "listening";
          window.clearTimeout(previewSensorNoDataTimeout);
          previewSensorNoDataTimeout = window.setTimeout(() => {
            if (!previewSensorSeenAt && previewSensorStatus === "listening") {
              previewSensorStatus = "no-live-tilt";
              updatePreviewSensorLabel();
            }
          }, 1600);
        }

        updatePreviewSensorLabel();
      };

      const requestPreviewGravityPermission = async () => {
        const orientationEvent = window.DeviceOrientationEvent as
          | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<PermissionState> })
          | undefined;
        const motionEvent = window.DeviceMotionEvent as
          | (typeof DeviceMotionEvent & { requestPermission?: () => Promise<PermissionState> })
          | undefined;

        try {
          const orientationResult = typeof orientationEvent?.requestPermission === "function"
            ? await orientationEvent.requestPermission()
            : "granted";
          const motionResult = typeof motionEvent?.requestPermission === "function"
            ? await motionEvent.requestPermission()
            : "granted";

          if (orientationResult === "granted" || motionResult === "granted") {
            startPreviewGravityListening();
          }
        } catch {
          startPreviewGravityListening();
        }
      };

      const removePreviewCursorArtifacts = () => {
        document.querySelectorAll<HTMLElement>(".steel-ball-cursor")
          .forEach((element) => {
            if (element !== previewBall) {
              element.remove();
            }
          });
        document.querySelectorAll<HTMLElement>(".steel-ball-stage-origin")
          .forEach((element) => element.remove());
      };

      const renderPreviewBall = () => {
        removePreviewCursorArtifacts();
        previewBall.style.transform = `translate(-50%, -50%) rotate(${previewRoll.toFixed(3)}rad)`;
        previewBall.style.setProperty("--steel-ball-roll-angle", `${previewRoll.toFixed(3)}rad`);
        previewBall.style.width = `${previewSize.width.toFixed(2)}px`;
        previewBall.style.height = `${previewSize.height.toFixed(2)}px`;
        previewBall.style.left = `${previewPosition.x.toFixed(2)}px`;
        previewBall.style.top = `${previewPosition.y.toFixed(2)}px`;
        previewShadow.style.left = `${previewPosition.x.toFixed(2)}px`;
        previewShadow.style.top = `${(previewPosition.y + previewSize.height * 0.46).toFixed(2)}px`;
      };

      const getPreviewGravityBounds = (): GravityBounds => {
        const radius = Math.max(previewSize.width, previewSize.height) / 2;
        const floorY = clamp(getPreviewFloorY(), 96 + radius, window.innerHeight - 24 - radius);

        return {
          width: window.innerWidth,
          height: window.innerHeight,
          radius,
          safeTop: 24,
          safeRight: 0,
          safeBottom: Math.max(24, window.innerHeight - floorY - radius),
          safeLeft: 0,
        };
      };

      const stepPreviewGravity = (time: number) => {
        const delta = previewLastTime ? time - previewLastTime : 16;
        previewLastTime = time;
        const dt = clamp(delta / 1000, 0, 0.05);
        const bounds = getPreviewGravityBounds();
        const minX = (bounds.safeLeft ?? 0) + bounds.radius;
        const maxX = bounds.width - (bounds.safeRight ?? 0) - bounds.radius;
        const minY = (bounds.safeTop ?? 0) + bounds.radius;
        const maxY = bounds.height - (bounds.safeBottom ?? 0) - bounds.radius;
        const now = performance.now();
        const touchAge = previewLastTouchAt ? now - previewLastTouchAt : Number.POSITIVE_INFINITY;
        const sensorAge = previewSensorSeenAt ? now - previewSensorSeenAt : Number.POSITIVE_INFINITY;
        const hasLiveSensor = sensorAge < 900 && previewGravity.confidence > 0.02;
        const hasUsefulLiveTilt = hasLiveSensor && Math.abs(previewGravity.x) > 0.045;
        if (!previewHasLanded && previewGravityState.position.y >= maxY - 1) {
          previewHasLanded = true;
          previewLandedAt = now - 160;
          previewFallbackLastFlipAt = now;
          previewFallbackRollStartedAt = now;
        }

        const isDropping = !previewHasLanded;
        const postLandingAge = previewHasLanded && previewLandedAt ? now - previewLandedAt : 0;
        const hasFallbackDeskRoll = previewHasLanded && !hasUsefulLiveTilt && postLandingAge > 80;

        if (hasFallbackDeskRoll) {
          const edgeMargin = Math.max(34, bounds.radius * 0.9);
          const flipAge = previewFallbackLastFlipAt ? now - previewFallbackLastFlipAt : Number.POSITIVE_INFINITY;

          if (previewGravityState.position.x >= maxX - edgeMargin) {
            previewFallbackDirection = -1;
            previewFallbackLastFlipAt = now;
          } else if (previewGravityState.position.x <= minX + edgeMargin) {
            previewFallbackDirection = 1;
            previewFallbackLastFlipAt = now;
          } else if (flipAge > 6800) {
            previewFallbackDirection *= -1;
            previewFallbackLastFlipAt = now;
          }
        }

        const fallbackDeskSlope = hasFallbackDeskRoll ? previewFallbackDirection * 0.34 : 0;
        const touchBias = !previewPointerActive && Math.abs(previewTouchInfluenceX) > 0.002
          ? previewTouchInfluenceX * Math.exp(-touchAge / 1800)
          : 0;
        const effectiveGravity: GravityVector = {
          x: clamp(previewGravity.x + touchBias + fallbackDeskSlope, -1, 1),
          y: clamp(previewGravity.y + (isDropping ? 1 : 0.46), -1, 1),
          confidence: clamp(Math.max(previewGravity.confidence, isDropping ? 0.9 : hasUsefulLiveTilt ? 0.62 : 0.38), 0, 1),
        };
        const force = effectiveGravity.confidence;
        const horizontalAcceleration = previewPointerActive ? 0 : (isDropping ? 210 : 430) * force;
        const verticalAcceleration = previewPointerActive ? 0 : (isDropping ? 1850 : 430) * force;
        const recentlyTouched = touchAge < 1400;
        const damping = Math.pow(previewPointerActive ? 0.12 : isDropping ? 0.996 : hasFallbackDeskRoll ? 0.992 : recentlyTouched ? 0.68 : 0.42, dt);
        const previousX = previewGravityState.position.x;
        const previousY = previewGravityState.position.y;
        let vx = (previewGravityState.velocity.x + effectiveGravity.x * horizontalAcceleration * dt) * damping;
        let vy = (previewGravityState.velocity.y + effectiveGravity.y * verticalAcceleration * dt) * damping;
        const pointerAge = previewPointerLastSeenAt ? now - previewPointerLastSeenAt : Number.POSITIVE_INFINITY;
        const pointerContact = previewPointerKnown && !previewPointerActive && pointerAge < 120
          ? getPreviewContact(previewPointerLast.x, previewPointerLast.y)
          : null;

        if (pointerContact?.isTouching && Math.hypot(previewPointerVelocity.x, previewPointerVelocity.y) > 0.08) {
          const pointerSpeed = Math.hypot(previewPointerVelocity.x, previewPointerVelocity.y);
          const directionX = previewPointerVelocity.x / pointerSpeed;
          const directionY = previewPointerVelocity.y / pointerSpeed;
          const impulse = clamp(pointerSpeed * 190, 70, 290);

          vx = clamp(vx + directionX * impulse, -340, 340);
          vy = clamp(vy + directionY * impulse * 0.22, -210, 210);
          previewLastTouchAt = now;
          previewGravityInput = "touch";
        }

        if (hasFallbackDeskRoll && !previewPointerActive) {
          const targetVx = previewFallbackDirection * (recentlyTouched ? 112 : 218);
          const blend = Math.min(1, dt * 3.2);

          vx += (targetVx - vx) * blend;
          vy *= Math.pow(0.08, dt);
          previewGravityInput = "desk-slope";
        }

        const maxVelocity = previewPointerActive ? 180 : isDropping ? 620 : recentlyTouched ? 270 : hasFallbackDeskRoll ? 170 : 210;
        const speed = Math.hypot(vx, vy);

        if (speed > maxVelocity) {
          vx = (vx / speed) * maxVelocity;
          vy = (vy / speed) * maxVelocity;
        }

        if (!previewPointerActive) {
          previewTouchInfluenceX *= Math.pow(0.16, dt);
        }

        let nextX = previewGravityState.position.x + vx * dt;
        let nextY = previewGravityState.position.y + vy * dt;

        if (nextX < minX) {
          nextX = minX;
          vx = Math.max(0, vx * -0.24);
        } else if (nextX > maxX) {
          nextX = maxX;
          vx = Math.min(0, vx * -0.24);
        }

        if (nextY < minY) {
          nextY = minY;
          vy = effectiveGravity.y < 0 ? 0 : vy * -0.18;
        } else if (nextY > maxY) {
          nextY = maxY;
          vy = effectiveGravity.y > 0 ? 0 : vy * -0.22;
          if (!previewHasLanded) {
            previewLandedAt = now;
            previewFallbackLastFlipAt = now;
            previewFallbackRollStartedAt = now;
          }
          previewHasLanded = true;
        }

        if (!previewHasLanded && nextY >= maxY - 0.5 && effectiveGravity.y >= 0) {
          previewHasLanded = true;
          previewLandedAt = now - 160;
          previewFallbackLastFlipAt = now;
          previewFallbackRollStartedAt = now;
        }

        const verticalSettled = (nextY === maxY && effectiveGravity.y >= 0) || (nextY === minY && effectiveGravity.y <= 0);
        const horizontalSettled = Math.abs(vx) < 0.45;
        const settled = verticalSettled && horizontalSettled && Math.abs(vy) < 2 && !previewPointerActive && !recentlyTouched && !hasFallbackDeskRoll;
        previewGravityState = {
          ...previewGravityState,
          gravity: effectiveGravity,
          isSettled: settled,
          position: { x: nextX, y: nextY },
          velocity: settled ? { x: 0, y: 0 } : { x: vx, y: vy },
        };
        previewPosition = { ...previewGravityState.position };
        previewRoll += Math.hypot(previewPosition.x - previousX, previewPosition.y - previousY) / Math.max(1, previewSize.width / 2) *
          Math.sign((previewPosition.x - previousX) || 1);
        const roomGravityInput = Math.abs(effectiveGravity.x) > 0.008
          ? hasUsefulLiveTilt ? previewGravityInput : "desk-slope"
          : "room-gravity";
        document.documentElement.dataset.steelGravityInput = previewGravityInput === "none" || previewGravityInput === "level"
          ? roomGravityInput
          : `${previewGravityInput}+room`;
        document.documentElement.dataset.steelGravityConfidence = effectiveGravity.confidence.toFixed(3);
        document.documentElement.dataset.steelGravityX = effectiveGravity.x.toFixed(3);
        document.documentElement.dataset.steelGravityY = effectiveGravity.y.toFixed(3);
        renderPreviewBall();
        previewFrame = window.requestAnimationFrame(stepPreviewGravity);
      };

      const handlePreviewResize = () => {
        previewGravityState = {
          ...previewGravityState,
          position: {
            x: clamp(previewGravityState.position.x, 40, window.innerWidth - 40),
            y: clamp(previewGravityState.position.y, 40, window.innerHeight - 40),
          },
        };
        previewPosition = {
          ...previewGravityState.position,
        };
        renderPreviewBall();
      };

      const applyPreviewImpulse = (impulseX: number, impulseY: number, input = "touch") => {
        const currentVelocity = previewGravityState.velocity;
        const now = performance.now();

        previewGravityState = {
          ...previewGravityState,
          velocity: {
            x: previewPointerActive
              ? clamp(impulseX, -240, 240)
              : clamp(currentVelocity.x + impulseX, -620, 620),
            y: previewPointerActive
              ? clamp(impulseY, -220, 220)
              : clamp(currentVelocity.y + impulseY, -460, 460),
          },
          isSettled: false,
        };
        previewLastTouchAt = now;
        if (!previewPointerActive && Math.abs(impulseX) > 8) {
          previewTouchInfluenceX = clamp(previewTouchInfluenceX + impulseX / 1800, -0.26, 0.26);
        }
        previewGravityInput = input;
      };

      const applyPreviewStrike = (movementX: number, movementY: number, contact: {
        dx: number;
        dy: number;
        distance: number;
      }) => {
        const movementSpeed = Math.hypot(movementX, movementY);
        const movementDirectionX = movementSpeed > 0.001 ? movementX / movementSpeed : 0;
        const movementDirectionY = movementSpeed > 0.001 ? movementY / movementSpeed : 0;
        const fallbackDistance = Math.hypot(contact.dx, contact.dy);
        const fallbackX = fallbackDistance > 0.001 ? contact.dx / fallbackDistance : 1;
        const fallbackY = fallbackDistance > 0.001 ? contact.dy / fallbackDistance : 0;
        const directionX = movementSpeed > 0.001 ? movementDirectionX : fallbackX;
        const directionY = movementSpeed > 0.001 ? movementDirectionY : fallbackY;
        const strikeSpeed = clamp(movementSpeed * 38, 150, 430);

        previewGravityState = {
          ...previewGravityState,
          velocity: {
            x: clamp(previewGravityState.velocity.x + directionX * strikeSpeed, -430, 430),
            y: clamp(previewGravityState.velocity.y + directionY * strikeSpeed * 0.32, -280, 280),
          },
          isSettled: false,
        };
        previewLastTouchAt = performance.now();
        previewTouchInfluenceX = clamp(previewTouchInfluenceX + directionX * 0.08, -0.22, 0.22);
        previewGravityInput = "touch";
      };

      const applyPreviewVisibleShove = (movementX: number, movementY: number, contact: {
        dx: number;
        dy: number;
        distance: number;
      }) => {
        const movementSpeed = Math.hypot(movementX, movementY);
        const fallbackDistance = Math.hypot(contact.dx, contact.dy);
        const fallbackX = fallbackDistance > 0.001 ? contact.dx / fallbackDistance : 1;
        const fallbackY = fallbackDistance > 0.001 ? contact.dy / fallbackDistance : 0;
        const shoveX = movementSpeed > 0.001 ? movementX * 0.58 : fallbackX * 12;
        const shoveY = movementSpeed > 0.001 ? movementY * 0.28 : fallbackY * 5;
        const bounds = getPreviewGravityBounds();
        const minX = (bounds.safeLeft ?? 0) + bounds.radius;
        const maxX = bounds.width - (bounds.safeRight ?? 0) - bounds.radius;
        const minY = (bounds.safeTop ?? 0) + bounds.radius;
        const maxY = bounds.height - (bounds.safeBottom ?? 0) - bounds.radius;

        previewGravityState = {
          ...previewGravityState,
          position: {
            x: clamp(previewGravityState.position.x + shoveX, minX, maxX),
            y: clamp(previewGravityState.position.y + shoveY, minY, maxY),
          },
          velocity: {
            x: clamp(previewGravityState.velocity.x + shoveX * 24, -430, 430),
            y: clamp(previewGravityState.velocity.y + shoveY * 14, -280, 280),
          },
          isSettled: false,
        };
        previewPosition = { ...previewGravityState.position };
        previewRoll += shoveX / Math.max(1, previewSize.width / 2);
        previewLastTouchAt = performance.now();
        previewGravityInput = "touch";
        renderPreviewBall();
      };

      const applyPreviewContactPressure = (contact: {
        dx: number;
        dy: number;
        distance: number;
        radius: number;
        isTouching: boolean;
      }, movementX = 0, movementY = 0) => {
        const contactHalo = previewPointerActive ? 92 : 68;
        if (contact.distance > contact.radius + contactHalo) {
          return;
        }

        const overlap = contact.radius + contactHalo - contact.distance;
        const pressure = clamp(overlap / contactHalo, 0, 1);
        const easedPressure = pressure * pressure * (3 - 2 * pressure);
        const movementDistance = Math.hypot(movementX, movementY);
        const pushX = contact.distance > 0.001
          ? contact.dx / contact.distance
          : movementDistance > 0.001
            ? movementX / movementDistance
            : 1;
        const pushY = contact.distance > 0.001
          ? contact.dy / contact.distance
          : movementDistance > 0.001
            ? movementY / movementDistance
            : 0;
        const bounds = getPreviewGravityBounds();
        const minX = (bounds.safeLeft ?? 0) + bounds.radius;
        const maxX = bounds.width - (bounds.safeRight ?? 0) - bounds.radius;
        const minY = (bounds.safeTop ?? 0) + bounds.radius;
        const maxY = bounds.height - (bounds.safeBottom ?? 0) - bounds.radius;
        const displacement = overlap * (previewPointerActive ? 0.18 : 0.42);

        previewGravityState = {
          ...previewGravityState,
          position: {
            x: clamp(previewGravityState.position.x + pushX * displacement, minX, maxX),
            y: clamp(previewGravityState.position.y + pushY * displacement, minY, maxY),
          },
          velocity: {
            x: previewPointerActive
              ? previewGravityState.velocity.x
              : clamp(previewGravityState.velocity.x + pushX * Math.max(easedPressure, 0.28) * 340, -680, 680),
            y: previewPointerActive
              ? previewGravityState.velocity.y
              : clamp(previewGravityState.velocity.y + pushY * Math.max(easedPressure, 0.18) * 150, -480, 480),
          },
          isSettled: false,
        };
        previewRoll += (pushX * displacement) / Math.max(1, previewSize.width / 2);
        previewPosition = { ...previewGravityState.position };
        previewLastTouchAt = performance.now();
        if (!previewPointerActive) {
          previewTouchInfluenceX = clamp(previewTouchInfluenceX + pushX * Math.max(easedPressure, 0.22) * 0.09, -0.28, 0.28);
        }
        previewGravityInput = "touch";
        renderPreviewBall();
      };

      const getPreviewContact = (clientX: number, clientY: number) => {
        const radius = Math.max(previewSize.width, previewSize.height) / 2;
        const dx = previewGravityState.position.x - clientX;
        const dy = previewGravityState.position.y - clientY;
        const distance = Math.hypot(dx, dy);

        return {
          dx,
          dy,
          distance,
          radius,
          isTouching: distance <= radius + 104,
        };
      };

      const applyPreviewNearShove = (clientX: number, clientY: number, movementX: number, movementY: number) => {
        const radius = Math.max(previewSize.width, previewSize.height) / 2;
        const dx = previewGravityState.position.x - clientX;
        const dy = previewGravityState.position.y - clientY;
        const distance = Math.hypot(dx, dy);
        const halo = radius + 168;
        const movement = Math.hypot(movementX, movementY);

        if (distance > halo || movement < 0.08) {
          return false;
        }

        const influence = Math.pow(1 - distance / halo, 1.35);
        const bounds = getPreviewGravityBounds();
        const minX = (bounds.safeLeft ?? 0) + bounds.radius;
        const maxX = bounds.width - (bounds.safeRight ?? 0) - bounds.radius;
        const minY = (bounds.safeTop ?? 0) + bounds.radius;
        const maxY = bounds.height - (bounds.safeBottom ?? 0) - bounds.radius;
        const shoveX = movementX * influence * 2.4;
        const shoveY = movementY * influence * 0.72;

        previewGravityState = {
          ...previewGravityState,
          position: {
            x: clamp(previewGravityState.position.x + shoveX, minX, maxX),
            y: clamp(previewGravityState.position.y + shoveY, minY, maxY),
          },
          velocity: {
            x: clamp(previewGravityState.velocity.x + movementX * influence * 92, -820, 820),
            y: clamp(previewGravityState.velocity.y + movementY * influence * 32, -520, 520),
          },
          isSettled: false,
        };
        previewPosition = { ...previewGravityState.position };
        previewRoll += shoveX / Math.max(1, previewSize.width / 2);
        previewLastTouchAt = performance.now();
        previewTouchInfluenceX = clamp(previewTouchInfluenceX + Math.sign(movementX || dx || 1) * influence * 0.18, -0.36, 0.36);
        previewGravityInput = "touch";
        renderPreviewBall();
        return true;
      };

      const getPreviewSweepContact = (fromX: number, fromY: number, toX: number, toY: number) => {
        const radius = Math.max(previewSize.width, previewSize.height) / 2;
        const segmentX = toX - fromX;
        const segmentY = toY - fromY;
        const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

        if (segmentLengthSquared <= 0.001) {
          return getPreviewContact(toX, toY);
        }

        const ballX = previewGravityState.position.x;
        const ballY = previewGravityState.position.y;
        const projection = clamp(((ballX - fromX) * segmentX + (ballY - fromY) * segmentY) / segmentLengthSquared, 0, 1);
        const closestX = fromX + segmentX * projection;
        const closestY = fromY + segmentY * projection;
        const dx = ballX - closestX;
        const dy = ballY - closestY;
        const distance = Math.hypot(dx, dy);

        return {
          dx,
          dy,
          distance,
          radius,
          isTouching: distance <= radius + 96,
        };
      };

      const handlePreviewPointerDown = (event: PointerEvent) => {
        previewPointerEventSeenAt = performance.now();
        previewPointerKnown = true;
        previewPointerVelocity = { x: 0, y: 0 };
        previewPointerLastSeenAt = performance.now();
        void requestPreviewGravityPermission();
        const contact = getPreviewContact(event.clientX, event.clientY);

        if (!contact.isTouching) {
          return;
        }

        event.stopPropagation();
        event.preventDefault();
        previewPointerActive = false;
        previewPointerLast = { x: event.clientX, y: event.clientY };
        applyPreviewStrike(0, 0, contact);
        applyPreviewVisibleShove(0, 0, contact);
        applyPreviewContactPressure(contact);
      };

      const handlePreviewMouseDown = (event: MouseEvent) => {
        if (performance.now() - previewPointerEventSeenAt < 80) {
          return;
        }
        previewPointerKnown = true;
        previewPointerVelocity = { x: 0, y: 0 };
        previewPointerLastSeenAt = performance.now();
        void requestPreviewGravityPermission();
        const contact = getPreviewContact(event.clientX, event.clientY);

        if (!contact.isTouching) {
          return;
        }

        event.stopPropagation();
        event.preventDefault();
        previewPointerActive = false;
        previewPointerLast = { x: event.clientX, y: event.clientY };
        applyPreviewStrike(0, 0, contact);
        applyPreviewVisibleShove(0, 0, contact);
        applyPreviewContactPressure(contact);
      };

      const handlePreviewPointerMove = (event: PointerEvent) => {
        previewPointerEventSeenAt = performance.now();
        previewPointerKnown = true;
        const previousX = previewPointerLast.x;
        const previousY = previewPointerLast.y;
        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;
        const elapsed = Math.max(1, (event.timeStamp || performance.now()) - previewPointerLastSeenAt);
        previewPointerVelocity = { x: deltaX / elapsed, y: deltaY / elapsed };
        previewPointerLastSeenAt = performance.now();
        previewPointerLast = { x: event.clientX, y: event.clientY };
        if (previewPointerActive) {
          event.stopPropagation();
          event.preventDefault();
          return;
        }
        const contact = getPreviewContact(event.clientX, event.clientY);
        const sweepContact = getPreviewSweepContact(previousX, previousY, event.clientX, event.clientY);
        const activeContact = contact.isTouching ? contact : sweepContact;
        applyPreviewNearShove(event.clientX, event.clientY, deltaX, deltaY);

        if (!previewPointerActive && !activeContact.isTouching) {
          return;
        }

        if (activeContact.isTouching || previewPointerActive) {
          if (previewPointerActive) {
            return;
          }
          applyPreviewStrike(deltaX, deltaY, activeContact);
          applyPreviewVisibleShove(deltaX, deltaY, activeContact);
          applyPreviewImpulse(deltaX * 34, deltaY * 16, "touch");
          applyPreviewContactPressure(activeContact, deltaX, deltaY);
        }
      };

      const handlePreviewMouseMove = (event: MouseEvent) => {
        if (performance.now() - previewPointerEventSeenAt < 80) {
          return;
        }
        previewPointerKnown = true;
        const previousX = previewPointerLast.x;
        const previousY = previewPointerLast.y;
        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;
        const elapsed = Math.max(1, (event.timeStamp || performance.now()) - previewPointerLastSeenAt);
        previewPointerVelocity = { x: deltaX / elapsed, y: deltaY / elapsed };
        previewPointerLastSeenAt = performance.now();
        previewPointerLast = { x: event.clientX, y: event.clientY };
        if (previewPointerActive) {
          event.stopPropagation();
          event.preventDefault();
          return;
        }
        const contact = getPreviewContact(event.clientX, event.clientY);
        const sweepContact = getPreviewSweepContact(previousX, previousY, event.clientX, event.clientY);
        const activeContact = contact.isTouching ? contact : sweepContact;
        applyPreviewNearShove(event.clientX, event.clientY, deltaX, deltaY);

        if (activeContact.isTouching || previewPointerActive) {
          if (previewPointerActive) {
            return;
          }
          applyPreviewStrike(deltaX, deltaY, activeContact);
          applyPreviewVisibleShove(deltaX, deltaY, activeContact);
          applyPreviewImpulse(deltaX * 34, deltaY * 16, "touch");
          applyPreviewContactPressure(activeContact, deltaX, deltaY);
        }
      };

      const handlePreviewPointerUp = () => {
        previewPointerEventSeenAt = performance.now();
        previewPointerActive = false;
      };

      document.documentElement.classList.remove("steel-ball-cursor-active");
      document.documentElement.dataset.steelCursorState = "resting";
      document.documentElement.dataset.steelBallApi = "preview";
      document.documentElement.dataset.steelTiltPreview = "true";
      document.documentElement.dataset.steelPreviewVersion = "visible-roll-v48";
      document.documentElement.dataset.steelGravityInput = "office-floor";
      document.documentElement.dataset.steelGravityConfidence = "0.000";
      if (process.env.NODE_ENV !== "production" && !document.title.includes("visible-roll-v48")) {
        document.title = `${document.title} [visible-roll-v48]`;
      }
      window.onmousemove = null;
      document.onmousemove = null;
      window.onpointermove = null;
      document.onpointermove = null;
      previewBall.className = "steel-ball-cursor steel-ball-tilt-ball";
      previewBall.setAttribute("aria-hidden", "true");
      previewBall.setAttribute("data-visible", "true");
      previewBall.setAttribute("data-origin-resting", "true");
      previewBall.setAttribute("data-steel-preview-owner", "true");
      updatePreviewSensorLabel();
      previewShadow.className = "steel-ball-tilt-contact-shadow";
      previewShadow.setAttribute("aria-hidden", "true");
      applyBallAppearance(previewBall, currentBallState.trace, currentBallState.integrity);
      removePreviewCursorArtifacts();
      document.body.append(previewShadow);
      document.body.append(previewBall);
      renderPreviewBall();
      previewBall.addEventListener("pointerdown", handlePreviewPointerDown);
      previewBall.addEventListener("mousedown", handlePreviewMouseDown);
      const previewPointerListenerOptions: AddEventListenerOptions = { capture: true, passive: false };
      window.addEventListener("pointerdown", handlePreviewPointerDown, previewPointerListenerOptions);
      window.addEventListener("pointermove", handlePreviewPointerMove, previewPointerListenerOptions);
      window.addEventListener("mousemove", handlePreviewMouseMove, previewPointerListenerOptions);
      window.addEventListener("pointerup", handlePreviewPointerUp, previewPointerListenerOptions);
      window.addEventListener("mouseup", handlePreviewPointerUp, previewPointerListenerOptions);
      window.addEventListener("pointercancel", handlePreviewPointerUp, previewPointerListenerOptions);
      window.addEventListener("resize", handlePreviewResize, { passive: true });
      startPreviewGravityListening();
      previewFrame = window.requestAnimationFrame(stepPreviewGravity);

      return () => {
        window.cancelAnimationFrame(previewFrame);
        previewBall.removeEventListener("pointerdown", handlePreviewPointerDown);
        previewBall.removeEventListener("mousedown", handlePreviewMouseDown);
        window.removeEventListener("pointerdown", handlePreviewPointerDown, previewPointerListenerOptions);
        window.removeEventListener("pointermove", handlePreviewPointerMove, previewPointerListenerOptions);
        window.removeEventListener("mousemove", handlePreviewMouseMove, previewPointerListenerOptions);
        window.removeEventListener("pointerup", handlePreviewPointerUp, previewPointerListenerOptions);
        window.removeEventListener("mouseup", handlePreviewPointerUp, previewPointerListenerOptions);
        window.removeEventListener("pointercancel", handlePreviewPointerUp, previewPointerListenerOptions);
        window.removeEventListener("resize", handlePreviewResize);
        window.removeEventListener("deviceorientation", handlePreviewOrientation);
        window.removeEventListener("deviceorientationabsolute", handlePreviewOrientation);
        window.removeEventListener("devicemotion", handlePreviewMotion);
        window.clearTimeout(previewSensorNoDataTimeout);
        previewGenericSensors.forEach((sensor) => sensor.stop?.());
        if (!isTiltGravityMode()) {
          window.onmousemove = previousPreviewWindowMouseMove;
          document.onmousemove = previousPreviewDocumentMouseMove;
          window.onpointermove = previousPreviewWindowPointerMove;
          document.onpointermove = previousPreviewDocumentPointerMove;
        }
        previewShadow.remove();
        previewBall.remove();
        delete document.documentElement.dataset.steelBallApi;
        delete document.documentElement.dataset.steelTiltPreview;
        delete document.documentElement.dataset.steelPreviewVersion;
        document.documentElement.removeAttribute("data-steel-cursor-state");
      };
    }

    const setState = (nextState: CursorState) => {
      state = nextState;
      document.documentElement.dataset.steelCursorState = nextState;
    };

    const ensureCursor = () => {
      if (cursor) {
        return cursor;
      }

      cursor = document.createElement("div");
      cursor.className = "steel-ball-cursor";
      cursor.setAttribute("aria-hidden", "true");
      document.body.append(cursor);
      return cursor;
    };

    const moveCursorDirectly = (
      clientX: number,
      clientY: number,
      target: EventTarget | null,
    ) => {
      if (state === "borrowed" || isTiltGravityMode()) {
        return;
      }

      hasMousePointerControl = true;
      enabled = true;
      const deltaX = clientX - pointerX;
      const deltaY = clientY - pointerY;
      const travel = Math.hypot(deltaX, deltaY);
      const moveTime = performance.now();
      const elapsedSeconds = Math.max(0.008, (moveTime - lastPointerMoveAt) / 1000);
      const velocity = travel / elapsedSeconds;
      lastPointerMoveAt = moveTime;

      maybeRecordImpact(velocity, clientX, clientY);

      if (travel > 0.2 && !shouldReduceMotion()) {
        const direction = deltaX || deltaY;
        rollRotation += clamp(travel / 16, 0, 0.42) * Math.sign(direction || 1);
        motionLeanX = clamp(deltaX * 0.035, -3.5, 3.5);
        motionLeanY = clamp(deltaY * 0.035, -3.5, 3.5);
      }
      pointerX = clientX;
      pointerY = clientY;
      const shouldSnapToPointer = !visible || Math.hypot(clientX - renderX, clientY - renderY) > 520 || shouldReduceMotion();
      if (shouldSnapToPointer) {
        renderX = clientX;
        renderY = clientY;
      }
      visible = true;
      state = "cursor-active";
      setState("cursor-active");

      const directCursor = ensureCursor();
      applyMemoryToElement(directCursor);
      document.documentElement.classList.add("steel-ball-cursor-active");
      directCursor.setAttribute("data-visible", "true");
      directCursor.removeAttribute("data-origin-resting");
      directCursor.removeAttribute("data-origin-awakening");
      directCursor.removeAttribute("data-origin-settling");
      removeStageOrigin(true);
      window.cancelAnimationFrame(handoffFrame);
      window.cancelAnimationFrame(settlingFrame);
      window.clearTimeout(armingTimeout);
      stopGravity(true);
      updateTarget(target);
      directCursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%) translate(${motionLeanX.toFixed(2)}px, ${motionLeanY.toFixed(2)}px) rotate(${rollRotation.toFixed(3)}rad) scale(${scale}) scale(${pressScale})`;
      previousFrameTime = performance.now();
      slowFrameCount = 0;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(render);
      steelBall.markCursorState({ active: true, resting: false, gravityOffset: { x: 0, y: 0 } });
    };

    const applyMemoryToElement = (element: HTMLElement | null) => {
      if (element) {
        applyBallAppearance(element, currentBallState.trace, currentBallState.integrity);
      }
    };

    const applyMemoryToVisibleBall = () => {
      applyMemoryToElement(cursor);
      applyMemoryToElement(stageBall);
      applyBallAppearance(document.documentElement, currentBallState.trace, currentBallState.integrity);
      document.documentElement.toggleAttribute("data-steel-ball-borrowed", currentBallState.borrowed);
      document.documentElement.dataset.steelBallStatus = currentBallState.status;
      document.documentElement.dataset.steelBallLocation = currentBallState.location;
    };

    const getImpactSurface = (x: number, y: number) => {
      const hero = document.querySelector<HTMLElement>(".home-hero-section");

      if (x < 10 || x > window.innerWidth - 10 || y < 10 || y > window.innerHeight - 10) {
        return "viewport-edge" as const;
      }

      if (hero) {
        const rect = hero.getBoundingClientRect();

        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          return "hero-stage" as const;
        }
      }

      return "unknown" as const;
    };

    const maybeRecordImpact = (
      velocity: number,
      x: number,
      y: number,
      surface = getImpactSurface(x, y),
    ) => {
      const now = performance.now();

      if (
        shouldReduceMotion() ||
        currentBallState.borrowed ||
        now - lastImpactAt < 900 ||
        velocity < 1040
      ) {
        return;
      }

      lastImpactAt = now;
      steelBall.addImpact({
        energy: Math.min(1.8, velocity / 1800),
        velocity,
        surface,
        location: { x, y },
      });
    };

    const exposeGravityState = () => {
      document.documentElement.dataset.steelGravityInput = lastGravityInput;
      document.documentElement.dataset.steelGravityConfidence = gravityVector.confidence.toFixed(3);
      document.documentElement.dataset.steelGravityX = gravityVector.x.toFixed(3);
      document.documentElement.dataset.steelGravityY = gravityVector.y.toFixed(3);
      document.documentElement.toggleAttribute("data-steel-gravity-listening", gravityListening);
    };

    const getTiltModeMaxCenterY = () => {
      const viewportTop = Math.max(0, window.visualViewport?.offsetTop ?? 0);
      const visibleTop = 58 + viewportTop;
      const logoSafeFloor = window.innerHeight * 0.74;
      const viewportSafeFloor = window.innerHeight - 148;

      return clamp(
        Math.min(logoSafeFloor, viewportSafeFloor),
        visibleTop + 72,
        window.innerHeight - 96,
      );
    };

    const getGravityBounds = (): GravityBounds | null => {
      if (isTiltGravityMode() && stageBall) {
        const ballRect = stageBall.getBoundingClientRect();
        const radius = Math.max(16, ballRect.width / 2);
        const safeTop = 18 + Math.max(0, window.visualViewport?.offsetTop ?? 0);
        const safeRight = 18;
        const safeBottom = 18;
        const safeLeft = 18;

        return {
          width: window.innerWidth,
          height: window.innerHeight,
          radius,
          minX: safeLeft + radius - restX,
          maxX: window.innerWidth - safeRight - radius - restX,
          minY: safeTop + radius - restY,
          maxY: getTiltModeMaxCenterY() - restY,
          safeTop,
          safeRight,
          safeBottom,
          safeLeft,
        };
      }

      const hero = stageBall?.closest<HTMLElement>(".home-hero-section");

      if (!hero || !stageBall) {
        return null;
      }

      const heroRect = hero.getBoundingClientRect();
      const ballRect = stageBall.getBoundingClientRect();
      const originX = ballRect.left + ballRect.width / 2;
      const originY = ballRect.top + ballRect.height / 2;
      const safeTop = 24;
      const safeRight = 28;
      const safeBottom = 34;
      const safeLeft = 28;
      const radius = Math.max(12, ballRect.width / 2);

      return {
        width: heroRect.width,
        height: Math.min(heroRect.height, window.innerHeight - Math.max(0, heroRect.top)),
        radius,
        minX: heroRect.left + safeLeft + radius - originX,
        maxX: heroRect.right - safeRight - radius - originX,
        minY: heroRect.top + safeTop + radius - originY,
        maxY: Math.min(heroRect.bottom, window.innerHeight) - safeBottom - radius - originY,
        safeTop,
        safeRight,
        safeBottom,
        safeLeft,
      };
    };

    const getCursorGravityBounds = (): GravityBounds => ({
      width: window.innerWidth,
      height: window.innerHeight,
      radius: 8,
      minX: Math.max(-CURSOR_GRAVITY_RADIUS, 8 - pointerX),
      maxX: Math.min(CURSOR_GRAVITY_RADIUS, window.innerWidth - 8 - pointerX),
      minY: Math.max(-CURSOR_GRAVITY_RADIUS, 8 + Math.max(0, window.visualViewport?.offsetTop ?? 0) - pointerY),
      maxY: Math.min(CURSOR_GRAVITY_RADIUS, window.innerHeight - 8 - pointerY),
    });

    const renderRestingGravity = () => {
      if (!stageBall) {
        return;
      }

      const offsetX = gravityState.position.x;
      const offsetY = gravityState.position.y;
      const roll = isTiltGravityMode()
        ? offsetX / 18
        : gravityVector.confidence > 0
          ? (offsetX + offsetY) / 52
          : 0;
      stageBall.style.transform = `translate(calc(-50% + ${offsetX.toFixed(2)}px), calc(-50% + ${offsetY.toFixed(2)}px)) rotate(${roll.toFixed(3)}rad)`;
      steelBall.markCursorState({
        active: false,
        resting: true,
        gravityOffset: { x: offsetX, y: offsetY },
      });
    };

    const stopTiltFallback = () => {
      window.cancelAnimationFrame(tiltFallbackFrame);
      tiltFallbackFrame = 0;
      tiltFallbackLastTime = 0;
    };

    const stopGravity = (clearOffset = false) => {
      window.cancelAnimationFrame(gravityFrame);
      gravityFrame = 0;
      gravityActive = false;

      if (clearOffset) {
        window.cancelAnimationFrame(debugGravityFrame);
        stopTiltFallback();
        debugGravityFrame = 0;
        gravityState = createGravityState();
        cursorGravityState = createGravityState();
        cursorGravityLastTime = 0;
        gravityVector = { x: 0, y: 0, confidence: 0 };
        lastGravityInput = "none";
        document.documentElement.dataset.steelCursorGravityX = "0.00";
        document.documentElement.dataset.steelCursorGravityY = "0.00";
        exposeGravityState();
      }
    };

    const dampCursorGravity = (amount = 0.82) => {
      const nextPosition = {
        x: cursorGravityState.position.x * amount,
        y: cursorGravityState.position.y * amount,
      };
      const nextVelocity = {
        x: cursorGravityState.velocity.x * amount * 0.45,
        y: cursorGravityState.velocity.y * amount * 0.45,
      };

      cursorGravityState = {
        ...cursorGravityState,
        position: Math.hypot(nextPosition.x, nextPosition.y) < 0.35
          ? { x: 0, y: 0 }
          : nextPosition,
        velocity: Math.hypot(nextVelocity.x, nextVelocity.y) < 0.35
          ? { x: 0, y: 0 }
          : nextVelocity,
        isSettled: Math.hypot(nextPosition.x, nextPosition.y) < 0.35 && Math.hypot(nextVelocity.x, nextVelocity.y) < 0.35,
      };
      cursorGravityLastTime = 0;
      document.documentElement.dataset.steelCursorGravityX = cursorGravityState.position.x.toFixed(2);
      document.documentElement.dataset.steelCursorGravityY = cursorGravityState.position.y.toFixed(2);
      return cursorGravityState.position;
    };

    const getCursorGravityOffset = (
      time: number,
      reducedMotion: boolean,
      isInteractive: boolean,
    ) => {
      const pointerIsActive = time - lastPointerControlAt < CURSOR_IDLE_GRAVITY_DELAY;

      if (
        reducedMotion ||
        pointerIsActive ||
        isInteractive ||
        isPressed ||
        state === "borrowed" ||
        state === "awakening"
      ) {
        return dampCursorGravity(isPressed || isInteractive ? 0.58 : 0.86);
      }

      if (gravityVector.confidence === 0 && cursorGravityState.isSettled) {
        return { x: 0, y: 0 };
      }

      const delta = cursorGravityLastTime ? time - cursorGravityLastTime : 16;
      cursorGravityLastTime = time;
      cursorGravityState = stepGravitySimulation(
        {
          ...cursorGravityState,
          gravity: gravityVector,
        },
        getCursorGravityBounds(),
        delta,
      );

      steelBall.markCursorState({
        active: true,
        resting: false,
        gravityOffset: cursorGravityState.position,
      });
      document.documentElement.dataset.steelCursorGravityX = cursorGravityState.position.x.toFixed(2);
      document.documentElement.dataset.steelCursorGravityY = cursorGravityState.position.y.toFixed(2);

      return cursorGravityState.position;
    };

    const gravityStep = (time: number) => {
      if (!enabled || state !== "resting" || !stageBall || shouldReduceMotion()) {
        stopGravity();
        return;
      }

      const bounds = getGravityBounds();

      if (!bounds) {
        stopGravity();
        return;
      }

      const delta = gravityLastTime ? time - gravityLastTime : 16;
      gravityLastTime = time;
      const previousGravitySpeed = Math.hypot(gravityState.velocity.x, gravityState.velocity.y);
      gravityState = {
        ...gravityState,
        gravity: gravityVector,
      };
      gravityState = stepGravitySimulation(gravityState, bounds, delta);
      renderRestingGravity();

      if (gravityState.isSettled && gravityVector.confidence === 0) {
        if (gravityStartedRecorded) {
          const settledEdge = getSettledEdge(gravityState, bounds);
          steelBall.recordGravitySettled(settledEdge);

          if (settledEdge && previousGravitySpeed > 580) {
            maybeRecordImpact(
              previousGravitySpeed,
              restX + gravityState.position.x,
              restY + gravityState.position.y,
              "viewport-edge",
            );
          }
          gravityStartedRecorded = false;
        }
        stopGravity();
        return;
      }

      gravityFrame = window.requestAnimationFrame(gravityStep);
    };

    const tiltFallbackStep = (time: number) => {
      if (
        !enabled ||
        state !== "resting" ||
        !stageBall?.classList.contains("steel-ball-tilt-ball") ||
        shouldReduceMotion()
      ) {
        stopTiltFallback();
        return;
      }

      if (gravityVector.confidence > 0.02) {
        stageBall.setAttribute("data-live-gravity", "true");
        stopTiltFallback();
        startGravity();
        return;
      }

      const bounds = getGravityBounds();

      if (!bounds) {
        stopTiltFallback();
        return;
      }

      const delta = tiltFallbackLastTime ? time - tiltFallbackLastTime : 16;
      tiltFallbackLastTime = time;
      const dt = clamp(delta / 1000, 0, 0.05);
      const minX = bounds.minX ?? (bounds.safeLeft ?? 0) + bounds.radius;
      const maxX = bounds.maxX ?? bounds.width - (bounds.safeRight ?? 0) - bounds.radius;
      const velocity = 132 * tiltFallbackDirection;
      let nextX = gravityState.position.x + velocity * dt;

      if (nextX <= minX) {
        nextX = minX;
        tiltFallbackDirection = 1;
      } else if (nextX >= maxX) {
        nextX = maxX;
        tiltFallbackDirection = -1;
      }

      gravityState = {
        ...gravityState,
        gravity: { x: tiltFallbackDirection * 0.32, y: 0.46, confidence: 0.38 },
        isSettled: false,
        position: { x: nextX, y: 0 },
        velocity: { x: 132 * tiltFallbackDirection, y: 0 },
      };
      lastGravityInput = "desk-slope";
      exposeGravityState();
      renderRestingGravity();
      tiltFallbackFrame = window.requestAnimationFrame(tiltFallbackStep);
    };

    const startTiltFallback = () => {
      if (tiltFallbackFrame || !isTiltGravityMode() || shouldReduceMotion()) {
        return;
      }

      const bounds = getGravityBounds();

      if (!bounds) {
        return;
      }

      stageBall?.removeAttribute("data-live-gravity");
      const minX = bounds.minX ?? (bounds.safeLeft ?? 0) + bounds.radius;
      const maxX = bounds.maxX ?? bounds.width - (bounds.safeRight ?? 0) - bounds.radius;
      const currentX = gravityState.position.x;
      gravityState = {
        ...gravityState,
        isSettled: false,
        position: { x: clamp(currentX, minX, maxX), y: 0 },
        velocity: { x: 132 * tiltFallbackDirection, y: 0 },
      };
      tiltFallbackLastTime = 0;
      tiltFallbackFrame = window.requestAnimationFrame(tiltFallbackStep);
    };

    const startGravity = () => {
      if (gravityActive || !stageBall || state !== "resting" || shouldReduceMotion()) {
        return;
      }

      const bounds = getGravityBounds();

      if (!bounds) {
        return;
      }

      stopTiltFallback();
      stageBall?.setAttribute("data-live-gravity", "true");
      gravityActive = true;
      gravityLastTime = 0;
      gravityState = {
        ...gravityState,
        isSettled: false,
      };

      if (!gravityStartedRecorded) {
        steelBall.recordGravityStarted();
        gravityStartedRecorded = true;
      }

      gravityFrame = window.requestAnimationFrame(gravityStep);
    };

    const enableTiltGravityMode = () => {
      enabled = true;
      visible = false;
      setNativeCursor(false);
      document.documentElement.classList.remove("steel-ball-cursor-active");
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(handoffFrame);
      window.cancelAnimationFrame(settlingFrame);
      window.clearTimeout(armingTimeout);
      removeStageOrigin(true);
      cursor?.remove();
      cursor = null;

      if (!stageBall || !stageBall.classList.contains("steel-ball-tilt-ball")) {
        stageBall?.remove();
        stageBall = document.createElement("span");
        stageBall.className = "steel-ball-cursor steel-ball-stage-ball steel-ball-tilt-ball";
        stageBall.setAttribute("aria-hidden", "true");
        document.body.append(stageBall);
      }

      restX = window.innerWidth / 2;
      restY = getTiltModeMaxCenterY();
      stageBall.style.left = `${restX}px`;
      stageBall.style.top = `${restY}px`;
      stageBall.setAttribute("data-visible", "true");
      stageBall.setAttribute("data-origin-resting", "true");
      stageBall.setAttribute("data-tilt-fallback", "css-margin-roll");
      stageBall.removeAttribute("data-live-gravity");
      applyMemoryToElement(stageBall);
      gravityState = createGravityState({ x: 0, y: 0 }, gravityVector);
      setState("resting");
      renderRestingGravity();
      startGravityListening();
      startDebugGravityPreview();
      startTiltFallback();
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (
        !canUseOrientationGravity() ||
        (state !== "resting" && state !== "cursor-active" && state !== "skipped")
      ) {
        return;
      }

      const screenOrientation = window.screen.orientation as ScreenOrientation | undefined;
      gravityVector = smoothGravityVector(
        gravityVector,
        normalizeDeviceOrientation({
          beta: event.beta,
          gamma: event.gamma,
          screenAngle: screenOrientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0,
        }),
      );
      lastGravityInput = "orientation";
      exposeGravityState();

      if (
        state === "resting" &&
        (gravityVector.confidence > 0 || Math.hypot(gravityState.velocity.x, gravityState.velocity.y) > 0)
      ) {
        stageBall?.setAttribute("data-live-gravity", "true");
        stopTiltFallback();
        startGravity();
      }
    };

    const handleMotion = (event: DeviceMotionEvent) => {
      if (
        !canUseMotionGravity() ||
        (state !== "resting" && state !== "cursor-active" && state !== "skipped")
      ) {
        return;
      }

      const acceleration = event.accelerationIncludingGravity;

      if (!acceleration) {
        return;
      }

      const screenOrientation = window.screen.orientation as ScreenOrientation | undefined;
      gravityVector = smoothGravityVector(
        gravityVector,
        normalizeDeviceMotion({
          x: acceleration.x,
          y: acceleration.y,
          screenAngle: screenOrientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0,
        }),
      );
      lastGravityInput = "motion";
      exposeGravityState();

      if (
        state === "resting" &&
        (gravityVector.confidence > 0 || Math.hypot(gravityState.velocity.x, gravityState.velocity.y) > 0)
      ) {
        stageBall?.setAttribute("data-live-gravity", "true");
        stopTiltFallback();
        startGravity();
      }
    };

    const startGravityListening = () => {
      if (gravityListening || gravityPermissionDismissed || !canUseSensorGravity()) {
        return;
      }

      gravityListening = true;
      if (canUseOrientationGravity()) {
        window.addEventListener("deviceorientation", handleOrientation, { passive: true });
      }
      if (canUseMotionGravity()) {
        window.addEventListener("devicemotion", handleMotion, { passive: true });
      }
      exposeGravityState();
    };

    const requestGravityPermission = async () => {
      if (gravityPermissionDismissed || !canUseSensorGravity()) {
        return;
      }

      const orientationEvent = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<PermissionState>;
      };
      const motionEvent = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<PermissionState>;
      };

      if (
        typeof orientationEvent.requestPermission !== "function" &&
        typeof motionEvent.requestPermission !== "function"
      ) {
        startGravityListening();
        return;
      }

      try {
        const orientationResult = typeof orientationEvent.requestPermission === "function"
          ? await orientationEvent.requestPermission()
          : "granted";
        const motionResult = typeof motionEvent.requestPermission === "function"
          ? await motionEvent.requestPermission()
          : "granted";

        if (orientationResult === "granted" || motionResult === "granted") {
          startGravityListening();
        } else {
          gravityPermissionDismissed = true;
        }
      } catch {
        gravityPermissionDismissed = true;
      }
    };

    const handleDebugGravity = (event: Event) => {
      const detail = (event as CustomEvent<GravityVector>).detail;

      if (!detail || shouldReduceMotion()) {
        return;
      }

      gravityVector = smoothGravityVector(gravityVector, detail);
      lastGravityInput = "debug";
      exposeGravityState();
      startGravity();
    };

    const startDebugGravityPreview = () => {
      if (!isDebugGravityPreview() || shouldReduceMotion()) {
        return;
      }

      const startedAt = performance.now();

      const tick = (time: number) => {
        if (!enabled || shouldReduceMotion()) {
          return;
        }

        const elapsed = (time - startedAt) / 1000;
        gravityVector = smoothGravityVector(gravityVector, {
          x: Math.cos(elapsed * 0.3) * 0.18,
          y: Math.sin(elapsed * 0.24) * 0.08,
          confidence: 0.28,
        });
        lastGravityInput = "debug";
        exposeGravityState();

        if (state === "resting") {
          startGravity();
        }

        debugGravityFrame = window.requestAnimationFrame(tick);
      };

      window.cancelAnimationFrame(debugGravityFrame);
      debugGravityFrame = window.requestAnimationFrame(tick);
    };

    document.documentElement.toggleAttribute("data-steel-extreme-stage", isExtremeStagePrototype());
    document.documentElement.toggleAttribute("data-steel-gravity-supported", canUseSensorGravity());
    exposeGravityState();

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

    const removeStageOrigin = (force = false) => {
      const stage = stageBall?.closest(".steel-ball-stage-origin") ?? document.querySelector(".home-hero-section .steel-ball-stage-origin");
      const isTemporaryStage = stage instanceof HTMLElement && stage.dataset.stageOriginSource === "cursor";

      if (force || stageOriginCreatedByCursor || isTemporaryStage) {
        stage?.remove();
      }

      stageBall = null;
      stageOriginCreatedByCursor = false;
    };

    const setNativeCursor = (isNative: boolean) => {
      document.documentElement.toggleAttribute("data-steel-cursor-native", isNative);
    };

    const playRollingReturnSound = () => {
      if (shouldReduceMotion()) {
        return;
      }

      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        returnAudioContext ??= new AudioContextClass();
        const context = returnAudioContext;
        const now = context.currentTime;
        const noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.55), context.sampleRate);
        const data = noiseBuffer.getChannelData(0);

        for (let index = 0; index < data.length; index += 1) {
          const progress = index / data.length;
          const grain =
            Math.sin(index * 0.37) * 0.52 +
            Math.sin(index * 0.071) * 0.31 +
            Math.sin(index * 0.017) * 0.17;
          data[index] = grain * Math.pow(1 - progress, 1.8);
        }

        const noise = context.createBufferSource();
        const lowPass = context.createBiquadFilter();
        const gain = context.createGain();
        noise.buffer = noiseBuffer;
        lowPass.type = "lowpass";
        lowPass.frequency.setValueAtTime(460, now);
        lowPass.frequency.exponentialRampToValueAtTime(1160, now + 0.5);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.028, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
        noise.connect(lowPass);
        lowPass.connect(gain);
        gain.connect(context.destination);
        noise.start(now);
        noise.stop(now + 0.6);
      } catch {}
    };

    const playIntegrityTick = () => {
      if (shouldReduceMotion()) {
        return;
      }

      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        returnAudioContext ??= new AudioContextClass();
        const context = returnAudioContext;
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(1820, now);
        oscillator.frequency.exponentialRampToValueAtTime(1240, now + 0.055);
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1680, now);
        filter.Q.setValueAtTime(8, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.018, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
      } catch {}
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
        slowFrameCount = 0;
      }

      const reducedMotion = shouldReduceMotion();
      let nextX = pointerX;
      let nextY = pointerY;
      const isInteractive = Boolean(activeTarget) && !document.documentElement.hasAttribute("data-steel-cursor-native");

      if (isInteractive && activeTarget !== previousInteractiveTarget) {
        triggerGlint();
      }

      previousInteractiveTarget = isInteractive ? activeTarget : null;

      const gravityOffset = getCursorGravityOffset(time, reducedMotion, isInteractive);
      nextX += gravityOffset.x;
      nextY += gravityOffset.y;
      const presenceOffset = presence.step({
        now: time,
        pointerX,
        pointerY,
        lastPointerMoveAt,
        lastScrollAt,
        activeTarget,
        isPressed,
        isInteractive,
        reducedMotion,
        enabled,
        desktop: activeMedia.matches || hasMousePointerControl,
        borrowed: currentBallState.borrowed,
      });
      nextX += presenceOffset.x;
      nextY += presenceOffset.y;

      targetScale = 1;
      const targetPressScale = 1;

      if (reducedMotion) {
        renderX = nextX;
        renderY = nextY;
        scale = targetScale;
        pressScale = targetPressScale;
        motionLeanX = 0;
        motionLeanY = 0;
      } else {
        const follow = Math.max(0.09, 0.16 - presenceOffset.slowdown);
        renderX += (nextX - renderX) * follow;
        renderY += (nextY - renderY) * follow;
        scale += (targetScale - scale) * 0.22;
        pressScale += (targetPressScale - pressScale) * 0.5;
        motionLeanX *= 0.82;
        motionLeanY *= 0.82;
      }

      cursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%) translate(${motionLeanX.toFixed(2)}px, ${motionLeanY.toFixed(2)}px) rotate(${(rollRotation + presenceOffset.rotation).toFixed(3)}rad) scale(${scale * presenceOffset.scale}) scale(${pressScale})`;
      cursor.toggleAttribute("data-interactive", isInteractive);
      cursor.toggleAttribute("data-clicking", isPressed);
      frame = window.requestAnimationFrame(render);
    };

    const animateBorrowAway = () => {
      if (!enabled || !cursor || shouldReduceMotion()) {
        cursor?.removeAttribute("data-visible");
        document.documentElement.classList.remove("steel-ball-cursor-active");
        setNativeCursor(false);
        setState("borrowed");
        return;
      }

      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(borrowFrame);
      setState("borrowed");
      const startX = renderX;
      const startY = renderY;
      const exitRight = startX > window.innerWidth * 0.5;
      const endX = exitRight ? window.innerWidth + 42 : -42;
      const endY = clamp(startY + (pointerY > window.innerHeight * 0.5 ? 18 : -18), 24, window.innerHeight - 24);
      const startedAt = performance.now();

      const rollAway = (time: number) => {
        if (!cursor || state !== "borrowed") {
          return;
        }

        const progress = clamp((time - startedAt) / BORROW_DURATION, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const x = startX + (endX - startX) * eased;
        const y = startY + (endY - startY) * eased + Math.sin(progress * Math.PI) * -3;
        const rotation = (exitRight ? 1 : -1) * progress * 1.8;
        renderX = x;
        renderY = y;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotation}turn) scale(${scale})`;

        if (progress >= 1) {
          cursor.removeAttribute("data-visible");
          document.documentElement.classList.remove("steel-ball-cursor-active");
          setNativeCursor(false);
          return;
        }

        borrowFrame = window.requestAnimationFrame(rollAway);
      };

      borrowFrame = window.requestAnimationFrame(rollAway);
    };

    const animateReturn = () => {
      if (!enabled) {
        return;
      }

      window.cancelAnimationFrame(borrowFrame);
      window.cancelAnimationFrame(returnFrame);

      if (!cursor) {
        cursor = document.createElement("div");
        cursor.className = "steel-ball-cursor";
        cursor.setAttribute("aria-hidden", "true");
        document.body.append(cursor);
      }

      applyMemoryToVisibleBall();

      if (shouldReduceMotion()) {
        renderX = pointerX;
        renderY = pointerY;
        cursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%)`;
        beginCursorLoop("skipped", true);
        return;
      }

      playRollingReturnSound();
      const startX = pointerX > window.innerWidth * 0.5 ? window.innerWidth + 42 : -42;
      const startY = clamp(pointerY + 16, 24, window.innerHeight - 24);
      const endX = pointerX;
      const endY = pointerY;
      const rollDirection = startX > window.innerWidth * 0.5 ? -1 : 1;
      const startedAt = performance.now();
      cursor.setAttribute("data-visible", "true");
      document.documentElement.classList.add("steel-ball-cursor-active");

      const rollBack = (time: number) => {
        if (!cursor) {
          return;
        }

        const progress = clamp((time - startedAt) / RETURN_DURATION, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const x = startX + (endX - startX) * eased;
        const y = startY + (endY - startY) * eased + Math.sin(progress * Math.PI) * -4;
        const rotation = rollDirection * (1 - progress) * -1.9;
        renderX = x;
        renderY = y;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotation}turn) scale(1)`;

        if (progress >= 1) {
          renderX = endX;
          renderY = endY;
          cursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%)`;
          beginCursorLoop("skipped", true);
          return;
        }

        returnFrame = window.requestAnimationFrame(rollBack);
      };

      returnFrame = window.requestAnimationFrame(rollBack);
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
      gravityState = createGravityState({ x: 0, y: 0 }, gravityVector);

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
          startGravityListening();
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
      applyMemoryToVisibleBall();
      visible = showImmediately;
      previousFrameTime = performance.now();
      slowFrameCount = 0;
      startGravityListening();
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(render);
    };

    const scheduleFollowRepair = () => {
      window.clearTimeout(followRepairTimeout);
      followRepairTimeout = window.setTimeout(() => {
        if (!enabled || !cursor || (state !== "cursor-active" && state !== "skipped")) {
          return;
        }

        visible = true;
        cursor.setAttribute("data-visible", "true");
        document.documentElement.classList.add("steel-ball-cursor-active");
        renderX = pointerX;
        renderY = pointerY;
        cursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%) scale(${scale}) scale(${pressScale})`;
        previousFrameTime = performance.now();
        slowFrameCount = 0;
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(render);
      }, 96);
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
      beginCursorLoop("cursor-active", true);
    };

    const cancelOriginAndUseNativeCursor = () => {
      if (state === "cursor-active" || state === "skipped") {
        return;
      }

      window.cancelAnimationFrame(handoffFrame);
      window.cancelAnimationFrame(settlingFrame);
      window.clearTimeout(armingTimeout);
      stopGravity(true);
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
      if (!enabled || !stageBall || state !== "resting") {
        return;
      }

      stopGravity();
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
      applyMemoryToElement(cursor);
      cursor.style.transform = `translate3d(${startX}px, ${startY}px, 0) translate(-50%, -50%) scale(${startScale})`;
      cursor.setAttribute("data-origin-awakening", "true");
      cursor.setAttribute("data-visible", "true");
      document.body.append(cursor);

      removeStageOrigin(true);

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
      if (enabled || !canUseSteelBallExperience()) {
        return;
      }

      enabled = true;
      applyMemoryToVisibleBall();

      if (isTiltGravityMode()) {
        enableTiltGravityMode();
        return;
      }

      startDebugGravityPreview();

      if (currentBallState.borrowed) {
        setState("borrowed");
        document.documentElement.classList.remove("steel-ball-cursor-active");
        setNativeCursor(false);
        return;
      }

      const restingPosition = getRestingPosition();
      const shouldSkipOrigin = shouldReduceMotion() || !restingPosition;

      if (shouldSkipOrigin) {
        removeStageOrigin(true);
        if (canUseSteelCursor()) {
          cursor = document.createElement("div");
          cursor.className = "steel-ball-cursor";
          cursor.setAttribute("aria-hidden", "true");
          applyMemoryToElement(cursor);
          document.body.append(cursor);
          beginCursorLoop("skipped");
        } else {
          setState("skipped");
          steelBall.markCursorState({ active: false, resting: false, gravityOffset: { x: 0, y: 0 } });
        }
        return;
      }

      restX = restingPosition.x;
      restY = restingPosition.y;
      stageBall = getStageOrigin();

      if (!stageBall) {
        const stage = document.createElement("span");
        stage.className = "steel-ball-stage-origin";
        stage.dataset.stageOriginSource = "cursor";
        stage.style.left = `${restingPosition.localX}px`;
        stage.style.top = `${restingPosition.localY}px`;
        stageBall = document.createElement("span");
        stageBall.className = "steel-ball-cursor steel-ball-stage-ball";
        stageBall.setAttribute("aria-hidden", "true");
        applyMemoryToElement(stageBall);
        stage.append(stageBall);
        restingPosition.hero.append(stage);
        stageOriginCreatedByCursor = true;
      } else {
        const stage = stageBall.closest<HTMLElement>(".steel-ball-stage-origin");
        stageOriginCreatedByCursor = stage?.dataset.stageOriginSource === "cursor";
      }

      applyMemoryToElement(stageBall);

      const stageRect = stageBall.getBoundingClientRect();
      restX = stageRect.left + stageRect.width / 2;
      restY = stageRect.top + stageRect.height / 2;
      setState("resting");
      renderRestingBall();
      armingTimeout = window.setTimeout(() => {
        originArmed = true;
        stageBall?.removeAttribute("data-origin-settling");
        startGravityListening();
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
      window.cancelAnimationFrame(borrowFrame);
      window.cancelAnimationFrame(returnFrame);
      stopGravity(true);
      setNativeCursor(false);
      setState("skipped");
      document.documentElement.removeAttribute("data-steel-cursor-state");
      document.documentElement.removeAttribute("data-steel-extreme-stage");
      document.documentElement.removeAttribute("data-steel-gravity-supported");
      document.documentElement.removeAttribute("data-steel-ball-borrowed");
      document.documentElement.removeAttribute("data-steel-ball-status");
      document.documentElement.removeAttribute("data-steel-ball-location");
      document.documentElement.classList.remove("steel-ball-cursor-active");
      window.cancelAnimationFrame(frame);
      removeStageOrigin();
      cursor?.remove();
      cursor = null;
      steelBall.markCursorState({ active: false, resting: false, gravityOffset: { x: 0, y: 0 } });
    };

    const skipOriginAndEnableCursor = () => {
      if (state === "cursor-active" || state === "skipped") {
        return;
      }

      window.cancelAnimationFrame(handoffFrame);
      window.cancelAnimationFrame(settlingFrame);
      window.clearTimeout(armingTimeout);
      stopGravity(true);
      removeStageOrigin(true);
      cursor?.remove();
      cursor = null;
      enabled = false;
      visible = false;
      setNativeCursor(false);
      setState("skipped");
      enable();
    };

    const syncEnabled = () => {
      document.documentElement.toggleAttribute("data-steel-gravity-supported", canUseSensorGravity());

      if (enabled && isTiltGravityMode()) {
        enableTiltGravityMode();
        return;
      }

      if (!canUseSteelBallExperience()) {
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
      if (isTiltGravityMode()) {
        if (!enabled || state !== "resting" || !stageBall?.classList.contains("steel-ball-tilt-ball")) {
          enableTiltGravityMode();
        }
        return;
      }

      hasMousePointerControl = true;
      enabled = true;
      pointerX = clientX;
      pointerY = clientY;
      lastPointerControlAt = performance.now();

      if (state === "borrowed") {
        return;
      }

      if (canUseSteelCursor()) {
        if (!cursor) {
          cursor = document.createElement("div");
          cursor.className = "steel-ball-cursor";
          cursor.setAttribute("aria-hidden", "true");
          document.body.append(cursor);
        }

        if (state === "resting" || state === "awakening" || state === "skipped") {
          window.cancelAnimationFrame(handoffFrame);
          window.cancelAnimationFrame(settlingFrame);
          window.clearTimeout(armingTimeout);
          stopGravity(true);
          removeStageOrigin(true);
          setState("cursor-active");
        }

        renderX = clientX;
        renderY = clientY;
        visible = true;
        document.documentElement.classList.add("steel-ball-cursor-active");
        cursor.setAttribute("data-visible", "true");
        cursor.removeAttribute("data-origin-resting");
        cursor.removeAttribute("data-origin-awakening");
        cursor.removeAttribute("data-origin-settling");
        applyMemoryToElement(cursor);
        updateTarget(target);
        cursor.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) translate(-50%, -50%) scale(${scale}) scale(${pressScale})`;
        previousFrameTime = performance.now();
        slowFrameCount = 0;
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(render);
        steelBall.markCursorState({ active: true, resting: false, gravityOffset: { x: 0, y: 0 } });
        scheduleFollowRepair();
        return;
      }

      if (state === "resting") {
        if (!isExtremeStagePrototype()) {
          startHandoff(target);
          return;
        }

        if (isExtremeStagePrototype()) {
          updateTarget(target);
          return;
        }

        startHandoff(target);
        return;
      }

      visible = true;
      cursor?.toggleAttribute("data-visible", visible);
      updateTarget(target);
      scheduleFollowRepair();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isTiltGravityMode()) {
        return;
      }

      moveCursorDirectly(event.clientX, event.clientY, event.target);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (isTiltGravityMode()) {
        requestGravityPermission();
        isPressed = false;
        return;
      }

      requestGravityPermission();

      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      isPressed = true;
      updateCursorPosition(event.clientX, event.clientY, event.target);

      if (state === "resting") {
        if (!isExtremeStagePrototype()) {
          startHandoff(event.target);
        }
      }
    };

    const handlePointerUp = () => {
      isPressed = false;
    };

    const handleGestureForGravity = () => {
      requestGravityPermission();
    };

    const handleKeyboardGestureForGravity = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      requestGravityPermission();
    };

    const handleGravityOptIn = () => {
      requestGravityPermission();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isTiltGravityMode()) {
        return;
      }

      moveCursorDirectly(event.clientX, event.clientY, event.target);
    };

    const handlePointerRawUpdate = (event: Event) => {
      if (isTiltGravityMode()) {
        return;
      }

      if (!(event instanceof PointerEvent)) {
        return;
      }

      moveCursorDirectly(event.clientX, event.clientY, event.target);
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

      if (document.visibilityState === "hidden") {
        stopGravity();
      }
    };

    const handleScroll = () => {
      lastScrollAt = performance.now();
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

    const handleSteelBallState = (nextState: SteelBallState) => {
      const wasBorrowed = currentBallState.borrowed;
      currentBallState = nextState;
      applyMemoryToVisibleBall();

      if (nextState.borrowed && !wasBorrowed) {
        animateBorrowAway();
        return;
      }

      if (!nextState.borrowed && wasBorrowed) {
        animateReturn();
      }

      if (
        nextState.integrity.fatigue >= 0.18 &&
        Date.now() - lastIntegrityTickAt > 32_000 &&
        Math.random() < 0.32
      ) {
        lastIntegrityTickAt = Date.now();
        playIntegrityTick();
      }
    };

    const steelBallApi = installSteelBallBrowserApi();
    steelBallApi.debugPresence = presence.debugPresence;
    steelBallApi.disablePresence = presence.disablePresence;
    steelBallApi.enablePresence = presence.enablePresence;
    steelBallApi.forceIdle = presence.forceIdle;
    steelBallApi.attentionTargets = presence.attentionTargets;
    window.steelBall = steelBallApi;
    window.SB = steelBallApi;
    document.documentElement.dataset.steelBallApi = "ready";
    unsubscribeSteelBall = steelBall.subscribe(handleSteelBallState);
    const pointerListenerOptions: AddEventListenerOptions = { passive: true, capture: true };
    const previousWindowMouseMove = window.onmousemove;
    const previousDocumentMouseMove = document.onmousemove;
    const previousWindowPointerMove = window.onpointermove;
    const previousDocumentPointerMove = document.onpointermove;
    const handleAssignedMouseMove = (event: MouseEvent) => {
      if (isTiltGravityMode()) {
        return;
      }

      moveCursorDirectly(event.clientX, event.clientY, event.target);
      previousWindowMouseMove?.call(window, event);
    };
    const handleAssignedDocumentMouseMove = (event: MouseEvent) => {
      if (isTiltGravityMode()) {
        return;
      }

      moveCursorDirectly(event.clientX, event.clientY, event.target);
      previousDocumentMouseMove?.call(document, event);
    };
    const handleAssignedPointerMove = (event: PointerEvent) => {
      if (isTiltGravityMode()) {
        return;
      }

      moveCursorDirectly(event.clientX, event.clientY, event.target);
      previousWindowPointerMove?.call(window, event);
    };
    const handleAssignedDocumentPointerMove = (event: PointerEvent) => {
      if (isTiltGravityMode()) {
        return;
      }

      moveCursorDirectly(event.clientX, event.clientY, event.target);
      previousDocumentPointerMove?.call(document, event);
    };
    syncEnabled();
    routeObserver = new MutationObserver(handleRouteMutation);
    routeObserver.observe(document.body, { childList: true, subtree: true });
    activeMedia.addEventListener("change", syncEnabled);
    reducedMotionMedia.addEventListener("change", syncEnabled);
    document.addEventListener("pointermove", handlePointerMove, pointerListenerOptions);
    document.addEventListener("pointerrawupdate", handlePointerRawUpdate, pointerListenerOptions);
    document.addEventListener("pointerdown", handlePointerDown, pointerListenerOptions);
    document.addEventListener("pointerup", handlePointerUp, pointerListenerOptions);
    document.addEventListener("pointercancel", handlePointerUp, pointerListenerOptions);
    document.addEventListener("mousemove", handleMouseMove, pointerListenerOptions);
    window.addEventListener("pointermove", handlePointerMove, pointerListenerOptions);
    window.addEventListener("pointerrawupdate", handlePointerRawUpdate, pointerListenerOptions);
    window.addEventListener("mousemove", handleMouseMove, pointerListenerOptions);
    window.onmousemove = handleAssignedMouseMove;
    document.onmousemove = handleAssignedDocumentMouseMove;
    window.onpointermove = handleAssignedPointerMove;
    document.onpointermove = handleAssignedDocumentPointerMove;
    window.addEventListener("blur", handleBlurOrVisibilityChange);
    document.addEventListener("visibilitychange", handleBlurOrVisibilityChange);
    document.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleGestureForGravity, { passive: true });
    window.addEventListener("touchstart", handleGestureForGravity, { passive: true });
    window.addEventListener("keydown", handleKeyboardGestureForGravity, { passive: true });
    window.addEventListener("ctrl-love-steel-ball-enable-gravity", handleGravityOptIn);
    window.addEventListener("ctrl-love-steel-ball-debug-gravity", handleDebugGravity as EventListener);

    return () => {
      activeMedia.removeEventListener("change", syncEnabled);
      reducedMotionMedia.removeEventListener("change", syncEnabled);
      document.removeEventListener("pointermove", handlePointerMove, pointerListenerOptions);
      document.removeEventListener("pointerrawupdate", handlePointerRawUpdate, pointerListenerOptions);
      document.removeEventListener("pointerdown", handlePointerDown, pointerListenerOptions);
      document.removeEventListener("pointerup", handlePointerUp, pointerListenerOptions);
      document.removeEventListener("pointercancel", handlePointerUp, pointerListenerOptions);
      document.removeEventListener("mousemove", handleMouseMove, pointerListenerOptions);
      window.removeEventListener("pointermove", handlePointerMove, pointerListenerOptions);
      window.removeEventListener("pointerrawupdate", handlePointerRawUpdate, pointerListenerOptions);
      window.removeEventListener("mousemove", handleMouseMove, pointerListenerOptions);
      window.onmousemove = previousWindowMouseMove;
      document.onmousemove = previousDocumentMouseMove;
      window.onpointermove = previousWindowPointerMove;
      document.onpointermove = previousDocumentPointerMove;
      window.removeEventListener("blur", handleBlurOrVisibilityChange);
      document.removeEventListener("visibilitychange", handleBlurOrVisibilityChange);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleGestureForGravity);
      window.removeEventListener("touchstart", handleGestureForGravity);
      window.removeEventListener("keydown", handleKeyboardGestureForGravity);
      window.removeEventListener("ctrl-love-steel-ball-enable-gravity", handleGravityOptIn);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("ctrl-love-steel-ball-debug-gravity", handleDebugGravity as EventListener);
      window.clearTimeout(followRepairTimeout);
      unsubscribeSteelBall?.();
      returnAudioContext?.close().catch(() => {});
      clearBallAppearance(document.documentElement);
      delete document.documentElement.dataset.steelBallApi;
      if (window.SB === steelBallApi) {
        delete window.SB;
      }
      routeObserver?.disconnect();
      cancelOriginAndUseNativeCursor();
      disable();
    };
  }, []);

  return null;
}
