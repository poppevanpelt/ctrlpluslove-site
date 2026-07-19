export type SeededRandom = () => number;

export type IdlePresenceAction = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  label: "idle-roll" | "idle-wobble" | "idle-settle";
};

type IdleState = {
  action: IdlePresenceAction | null;
  startedAt: number;
  duration: number;
  nextCheckAt: number;
};

export function createIdleState(now: number, random: SeededRandom): IdleState {
  return {
    action: null,
    startedAt: 0,
    duration: 0,
    nextCheckAt: now + nextIdleDelay(random),
  };
}

export function nextIdleDelay(random: SeededRandom) {
  return 8_000 + random() * 7_000;
}

export function chooseIdlePresence(random: SeededRandom, moodScale = 1): IdlePresenceAction {
  const direction = random() > 0.5 ? 1 : -1;
  const distance = (1 + random() * 2) * moodScale;
  const wobble = (random() - 0.5) * 0.7 * moodScale;
  const roll = direction * distance * 0.018;
  const option = random();

  if (option < 0.42) {
    return {
      x: direction * distance,
      y: wobble,
      rotation: roll,
      scale: 1,
      label: "idle-roll",
    };
  }

  if (option < 0.78) {
    return {
      x: wobble,
      y: (random() - 0.5) * 0.8 * moodScale,
      rotation: direction * (0.006 + random() * 0.012),
      scale: 1 + random() * 0.006,
      label: "idle-wobble",
    };
  }

  return {
    x: direction * (0.35 + random() * 0.9) * moodScale,
    y: -0.7 * moodScale,
    rotation: roll * 0.45,
    scale: 1,
    label: "idle-settle",
  };
}

export function stepIdlePresence(options: {
  state: IdleState;
  now: number;
  idleFor: number;
  random: SeededRandom;
  probability: number;
  moodScale?: number;
}) {
  const { state, now, idleFor, random } = options;
  const moodScale = options.moodScale ?? 1;

  if (idleFor < 4_000) {
    state.action = null;
    state.nextCheckAt = now + nextIdleDelay(random);
    return { x: 0, y: 0, rotation: 0, scale: 1, active: false, label: null as IdlePresenceAction["label"] | null };
  }

  if (!state.action && now >= state.nextCheckAt) {
    if (idleFor >= 8_000 && random() < options.probability) {
      state.action = chooseIdlePresence(random, moodScale);
      state.startedAt = now;
      state.duration = 780 + random() * 920;
    } else {
      state.nextCheckAt = now + nextIdleDelay(random);
    }
  }

  if (!state.action) {
    return { x: 0, y: 0, rotation: 0, scale: 1, active: false, label: null as IdlePresenceAction["label"] | null };
  }

  const progress = Math.min(1, Math.max(0, (now - state.startedAt) / state.duration));
  const settle = Math.sin(progress * Math.PI);
  const action = state.action;
  const x = action.x * settle;
  const y = action.label === "idle-settle"
    ? action.y * settle + 0.45 * Math.sin(progress * Math.PI * 2) * (1 - progress)
    : action.y * settle;
  const rotation = action.rotation * settle;
  const scale = 1 + (action.scale - 1) * settle;

  if (progress >= 1) {
    const label = action.label;
    state.action = null;
    state.nextCheckAt = now + nextIdleDelay(random);
    return { x: 0, y: 0, rotation: 0, scale: 1, active: false, label };
  }

  return { x, y, rotation, scale, active: true, label: action.label };
}
