import {
  getAttentionTargets,
  getDominantMoodFromDom,
  getMoodInfluence,
  getOfficeActivityFromDom,
  getReadableElementAt,
  type BallAttentionTarget,
} from "./ballAwareness.ts";
import {
  createAttentionState,
  stepAttentionPresence,
} from "./ballAttention.ts";
import {
  createIdleState,
  stepIdlePresence,
  type SeededRandom,
} from "./ballIdle.ts";

export type SteelBallPresenceInput = {
  now: number;
  pointerX: number;
  pointerY: number;
  lastPointerMoveAt: number;
  lastScrollAt: number;
  activeTarget: Element | null;
  isPressed: boolean;
  isInteractive: boolean;
  reducedMotion: boolean;
  enabled: boolean;
  desktop: boolean;
  borrowed: boolean;
};

export type SteelBallPresenceOutput = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  slowdown: number;
  quietFactor: number;
};

type ReadingState = {
  element: Element | null;
  startedAt: number;
};

type SteelBallPresenceEngineState = {
  enabled: boolean;
  lastTargetScanAt: number;
  targets: BallAttentionTarget[];
  lastMoodScanAt: number;
  mood: ReturnType<typeof getDominantMoodFromDom>;
  officeActivity: string | null;
  reading: ReadingState;
  forcedIdleUntil: number;
  lastSharedAttentionAt: number;
  lastDebug: Record<string, unknown>;
};

function hashText(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRandom(seed: string): SeededRandom {
  let value = hashText(seed) || 1;

  return () => {
    value += 0x6D2B79F5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getEdgeCorrection(x: number, y: number, quietFactor: number) {
  const edge = 28;
  let outputX = 0;
  let outputY = 0;

  if (x < edge) outputX = (1 - x / edge) * 1.7;
  if (x > window.innerWidth - edge) outputX = -((1 - (window.innerWidth - x) / edge) * 1.7);
  if (y < edge) outputY = (1 - y / edge) * 1.3;
  if (y > window.innerHeight - edge) outputY = -((1 - (window.innerHeight - y) / edge) * 1.3);

  return {
    x: outputX * quietFactor,
    y: outputY * quietFactor,
    rotation: outputX * 0.006 * quietFactor,
  };
}

export function createSteelBallPresenceEngine(seed = "SB-01") {
  const random = createSeededRandom(`${seed}:${new Date().toISOString().slice(0, 10)}`);
  const startedAt = typeof performance === "undefined" ? 0 : performance.now();
  const idle = createIdleState(startedAt, random);
  const attention = createAttentionState();
  const state: SteelBallPresenceEngineState = {
    enabled: true,
    lastTargetScanAt: 0,
    targets: [],
    lastMoodScanAt: 0,
    mood: "unknown",
    officeActivity: null,
    reading: { element: null, startedAt: 0 },
    forcedIdleUntil: 0,
    lastSharedAttentionAt: 0,
    lastDebug: {},
  };

  const refreshSlowContext = (now: number) => {
    if (now - state.lastTargetScanAt > 1_200) {
      state.targets = getAttentionTargets();
      state.lastTargetScanAt = now;
    }

    if (now - state.lastMoodScanAt > 900) {
      state.mood = getDominantMoodFromDom();
      state.officeActivity = getOfficeActivityFromDom();
      state.lastMoodScanAt = now;
    }
  };

  const getReadingQuietFactor = (input: SteelBallPresenceInput) => {
    const readable = getReadableElementAt(input.pointerX, input.pointerY);

    if (readable !== state.reading.element) {
      state.reading = {
        element: readable,
        startedAt: readable ? input.now : 0,
      };
    }

    if (!readable || input.now - state.reading.startedAt < 4_000) {
      return 1;
    }

    return 0.08;
  };

  const step = (input: SteelBallPresenceInput): SteelBallPresenceOutput => {
    if (
      !state.enabled ||
      !input.enabled ||
      !input.desktop ||
      input.reducedMotion ||
      input.borrowed ||
      document.visibilityState === "hidden"
    ) {
      state.lastDebug = { enabled: state.enabled, suppressed: true };
      return { x: 0, y: 0, rotation: 0, scale: 1, slowdown: 0, quietFactor: 0 };
    }

    refreshSlowContext(input.now);
    const mood = getMoodInfluence(state.mood);
    const idleFor = input.now - input.lastPointerMoveAt;
    const scrolling = input.now - input.lastScrollAt < 260;
    const activelyControlled = input.isPressed || input.isInteractive || Boolean(input.activeTarget) || scrolling;
    const effectiveIdleFor = activelyControlled ? 0 : idleFor;
    const quietFactor = activelyControlled
      ? 0
      : getReadingQuietFactor(input);
    const forceIdle = input.now < state.forcedIdleUntil;
    const idlePresence = stepIdlePresence({
      state: idle,
      now: input.now,
      idleFor: forceIdle ? Math.max(effectiveIdleFor, 12_000) : effectiveIdleFor,
      random,
      probability: clamp(0.2 * mood.probabilityScale, 0.08, 0.3),
      moodScale: mood.motionScale,
    });
    const attentionPresence = quietFactor > 0.1
      ? stepAttentionPresence({
        state: attention,
        now: input.now,
        x: input.pointerX,
        y: input.pointerY,
        targets: state.targets,
        random,
        probability: clamp(0.018 * mood.probabilityScale, 0.006, 0.028),
        motionScale: mood.motionScale,
        quietFactor,
      })
      : { x: 0, y: 0, rotation: 0, slowdown: 0, label: null, kind: null, active: false };
    const edge = effectiveIdleFor > 900 && quietFactor > 0 ? getEdgeCorrection(input.pointerX, input.pointerY, quietFactor) : { x: 0, y: 0, rotation: 0 };
    let sharedX = 0;
    let sharedY = 0;
    let sharedRotation = 0;

    if (
      state.officeActivity &&
      input.now - state.lastSharedAttentionAt > 12_000 &&
      effectiveIdleFor > 2_800 &&
      quietFactor > 0.1 &&
      random() < 0.0035 * mood.probabilityScale
    ) {
      const office = state.targets.find((target) => target.kind === "living-office");

      if (office) {
        const rect = office.element.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - input.pointerX;
        const dy = rect.top + rect.height / 2 - input.pointerY;
        const distance = Math.max(1, Math.hypot(dx, dy));
        sharedX = (dx / distance) * 0.9 * mood.motionScale * quietFactor;
        sharedY = (dy / distance) * 0.6 * mood.motionScale * quietFactor;
        sharedRotation = (dx / distance) * 0.006 * quietFactor;
        state.lastSharedAttentionAt = input.now;
      }
    }

    const scale = 1 + (idlePresence.scale - 1) * quietFactor;
    const output = {
      x: (idlePresence.x + attentionPresence.x + edge.x + sharedX) * quietFactor,
      y: (idlePresence.y + attentionPresence.y + edge.y + sharedY) * quietFactor,
      rotation: (idlePresence.rotation + attentionPresence.rotation + edge.rotation + sharedRotation) * quietFactor,
      scale,
      slowdown: clamp(attentionPresence.slowdown * mood.precision, 0, 0.08),
      quietFactor,
    };

    state.lastDebug = {
      enabled: state.enabled,
      mood: state.mood,
      officeActivity: state.officeActivity,
      targetCount: state.targets.length,
      readingQuiet: quietFactor,
      idle: idlePresence.label,
      attention: attentionPresence.label,
      output,
    };

    return output;
  };

  return {
    step,
    debugPresence: () => ({ ...state.lastDebug, targets: state.targets.map((target) => ({
      kind: target.kind,
      label: target.label,
      selector: target.selector,
      weight: target.weight,
    })) }),
    disablePresence: () => {
      state.enabled = false;
      return false;
    },
    enablePresence: () => {
      state.enabled = true;
      return true;
    },
    forceIdle: () => {
      state.forcedIdleUntil = (typeof performance === "undefined" ? 0 : performance.now()) + 2_200;
      idle.nextCheckAt = 0;
      return true;
    },
    attentionTargets: () => getAttentionTargets().map((target) => ({
      kind: target.kind,
      label: target.label,
      selector: target.selector,
      weight: target.weight,
    })),
  };
}

export type SteelBallPresenceEngine = ReturnType<typeof createSteelBallPresenceEngine>;
