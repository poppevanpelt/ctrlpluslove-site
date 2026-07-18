"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type React from "react";
import { usePathname } from "next/navigation";

const DISCOVERED_STORAGE_KEY = "ctrl-love-ctrl-layer-discovered";
const TYPING_SELECTOR = [
  "input",
  "textarea",
  "select",
  "[contenteditable='true']",
  "[contenteditable='']",
  "[role='textbox']",
  "[aria-multiline='true']",
  ".cm-editor",
  ".monaco-editor",
  "[data-gramm]",
].join(",");
const TOUCH_POINTER_QUERY = "(hover: none), (pointer: coarse)";
const HINT_DELAY_MS = 4200;
const LONG_PRESS_MS = 700;
const ACTIVE_CLASS = "ctrl-layer-active";
const ACTIVE_ATTRIBUTE = "data-ctrl-layer-active";
const SYSTEM_READOUTS = [
  "HUMAN SIGNAL DETECTED",
  "MACHINE-ASSISTED, HUMAN-LED",
  "LISTENING FOR CONTRADICTIONS",
  "NOT EVERYTHING HERE IS OPTIMIZED",
  "VERSION 0.∞",
];
const MUTATED_READOUTS = [
  "HUMAN SIGNAL DISAGREES",
  "CONFIDENCE HAS NOT SETTLED",
  "THE BRIEF IS WATCHING BACK",
  "OPTIMIZATION PAUSED ITSELF",
  "A BETTER QUESTION IS FORMING",
  "THE ROOM KEPT ONE DOUBT",
  "THE ANSWER ARRIVED TOO CLEAN",
  "REALITY DID NOT SIGN OFF",
];
const CONTRADICTION_READOUTS = [
  "RECOMMENDATION: PROCEED / DO NOT PROCEED",
  "CONSENSUS DETECTED, TRUST REDUCED",
  "ANSWER ACCEPTED, QUESTION REOPENED",
  "THE SYSTEM AGREES WITH ITS OBJECTION",
];
const STRAY_DETAILS = [
  "UNLABELED CONSEQUENCE",
  "EDGE OF THE DECISION",
  "THIS NOTE MOVED",
  "QUIET EXCEPTION",
  "SIGNAL WITHOUT OWNER",
  "PARTIAL TRUTH HELD HERE",
];
const LEAKAGE_LINES = [
  "The visible site is a negotiated version.",
  "Some decisions arrive before anyone admits they are decisions.",
  "The system is not confused. It is withholding premature certainty.",
  "A contradiction has been preserved for later use.",
  "The page is presenting confidence as a courtesy.",
];
const QUIET_FOOTERS = [
  "HOLD TO KEEP SIGNAL OPEN",
  "SIGNAL STABLE, NOT SETTLED",
  "ROOM INTERFACE LISTENING",
  "OBSERVATION HELD IN PLACE",
];
const CONTRADICTION_FOOTERS = [
  "HOLDING TWO TRUE THINGS",
  "ANSWER DELAYED BY CONTEXT",
  "DISAGREEMENT REMAINS USEFUL",
];
const LEAK_FOOTERS = [
  "SIGNAL REMAINS AFTER RELEASE",
  "VISIBLE SITE PARTIALLY OVERRIDDEN",
  "SECONDARY LAYER DID NOT CLOSE",
];

type CtrlLayerDepth = "quiet" | "contradictory" | "leak";
type CtrlLayerVariant = "anchored" | "drift" | "displaced";

type CtrlLayerStrayDetail = {
  text: string;
  position: "upper" | "middle" | "lower";
};

type CtrlLayerActivation = {
  id: number;
  depth: CtrlLayerDepth;
  variant: CtrlLayerVariant;
  header: string;
  readouts: string[];
  footer: string;
  strays: CtrlLayerStrayDetail[];
  leakLines: string[];
};

type CtrlLayerContextValue = {
  active: boolean;
  keyLabel: "CTRL" | "⌘ / CTRL";
  setTouchActive: (active: boolean) => void;
  toggleTouchActive: () => void;
};

const CtrlLayerContext = createContext<CtrlLayerContextValue | null>(null);

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createCtrlLayerActivation(): CtrlLayerActivation {
  const chance = Math.random();
  const depth: CtrlLayerDepth =
    chance > 0.9 ? "leak" : chance > 0.56 ? "contradictory" : "quiet";
  const variantChance = Math.random();
  const variant: CtrlLayerVariant =
    depth === "leak"
      ? "displaced"
      : variantChance > 0.58
        ? "drift"
        : "anchored";
  const readouts = shuffled(SYSTEM_READOUTS);
  const strays: CtrlLayerStrayDetail[] = [
    { text: randomItem(STRAY_DETAILS), position: "upper" },
  ];

  if (depth !== "quiet" || Math.random() > 0.45) {
    readouts.splice(1, 0, randomItem(MUTATED_READOUTS));
  }

  if (depth === "quiet" && Math.random() > 0.62) {
    strays.push({ text: randomItem(STRAY_DETAILS), position: "middle" });
  }

  if (depth !== "quiet") {
    readouts.splice(2, 0, randomItem(CONTRADICTION_READOUTS));
    strays.push({ text: randomItem(STRAY_DETAILS), position: "middle" });
  }

  if (depth === "leak") {
    readouts.splice(0, 0, "SECONDARY SITE BLEEDING THROUGH");
    strays.push({ text: "INTERFACE DETAIL DETACHED", position: "lower" });
  }

  return {
    id: Date.now(),
    depth,
    variant,
    header:
      depth === "leak"
        ? "ROOM INTERFACE / UNSUPERVISED"
        : depth === "contradictory"
          ? "ROOM INTERFACE / DISAGREEMENT"
          : "ROOM INTERFACE",
    readouts: readouts.slice(0, depth === "quiet" ? 5 : 6),
    footer:
      depth === "leak"
        ? randomItem(LEAK_FOOTERS)
        : depth === "contradictory"
          ? randomItem(CONTRADICTION_FOOTERS)
          : randomItem(QUIET_FOOTERS),
    strays,
    leakLines: depth === "leak" ? shuffled(LEAKAGE_LINES).slice(0, 2) : [],
  };
}

function isMacLike() {
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";

  return (
    /Mac|iPhone|iPad|iPod/.test(platform) ||
    /Mac|iPhone|iPad|iPod/.test(userAgent)
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest(TYPING_SELECTOR));
}

function readDiscovered() {
  try {
    return localStorage.getItem(DISCOVERED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeDiscovered() {
  try {
    localStorage.setItem(DISCOVERED_STORAGE_KEY, "true");
  } catch {}
}

export function CtrlLayerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [touchActive, setTouchActiveState] = useState(false);
  const [keyLabel, setKeyLabel] = useState<"CTRL" | "⌘ / CTRL">("CTRL");
  const [hintReady, setHintReady] = useState(false);
  const [discovered, setDiscovered] = useState(true);
  const [touchCapable, setTouchCapable] = useState(false);
  const [activation, setActivation] = useState<CtrlLayerActivation | null>(null);
  const isMacRef = useRef(false);
  const discoveredRef = useRef(true);
  const activeRef = useRef(false);
  const active = keyboardActive || touchActive;

  const writeRootState = useCallback((nextActive: boolean) => {
    document.documentElement.classList.toggle(ACTIVE_CLASS, nextActive);
    document.documentElement.toggleAttribute(ACTIVE_ATTRIBUTE, nextActive);
  }, []);

  const markDiscovered = useCallback(() => {
    if (discoveredRef.current) {
      return;
    }

    discoveredRef.current = true;
    writeDiscovered();
    setDiscovered(true);
  }, []);

  const beginActivation = useCallback(() => {
    if (!activeRef.current) {
      setActivation(createCtrlLayerActivation());
    }

    activeRef.current = true;
    writeRootState(true);
    markDiscovered();
  }, [markDiscovered, writeRootState]);

  const endActivation = useCallback(() => {
    activeRef.current = false;
    writeRootState(false);
    setActivation(null);
  }, [writeRootState]);

  useEffect(() => {
    isMacRef.current = isMacLike();
    const savedDiscovered = readDiscovered();
    discoveredRef.current = savedDiscovered;

    window.setTimeout(() => {
      setKeyLabel(isMacRef.current ? "⌘ / CTRL" : "CTRL");
      setDiscovered(savedDiscovered);
    }, 0);

    const touchMedia = window.matchMedia(TOUCH_POINTER_QUERY);
    const syncTouchCapable = () => {
      setTouchCapable(touchMedia.matches);
    };

    window.setTimeout(syncTouchCapable, 0);
    touchMedia.addEventListener("change", syncTouchCapable);

    const hintTimer = window.setTimeout(() => {
      setHintReady(true);
    }, HINT_DELAY_MS);

    return () => {
      window.clearTimeout(hintTimer);
      touchMedia.removeEventListener("change", syncTouchCapable);
    };
  }, [markDiscovered]);

  useEffect(() => {
    let resetTimer = 0;

    writeRootState(active);

    if (!active) {
      activeRef.current = false;
      resetTimer = window.setTimeout(() => {
        setActivation(null);
      }, 0);
    }

    return () => {
      window.clearTimeout(resetTimer);
      writeRootState(false);
    };
  }, [active, writeRootState]);

  useEffect(() => {
    const isActivationKey = (key: string) =>
      key === "Meta" || key === "Control";

    const deactivate = () => {
      setKeyboardActive(false);
      setTouchActiveState(false);
      endActivation();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActivationKey(event.key) || isTypingTarget(event.target)) {
        return;
      }

      beginActivation();
      setKeyboardActive(true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const modifierReleased =
        isActivationKey(event.key) || (!event.metaKey && !event.ctrlKey);

      if (modifierReleased) {
        setKeyboardActive(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        deactivate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", deactivate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", deactivate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      deactivate();
    };
  }, [beginActivation, endActivation]);

  useEffect(() => {
    window.setTimeout(() => {
      endActivation();
      setKeyboardActive(false);
      setTouchActiveState(false);
    }, 0);
  }, [pathname, endActivation]);

  useEffect(() => {
    if (!touchCapable || !touchActive) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;

      if (!target?.closest("[data-ctrl-layer-trigger]")) {
        setTouchActiveState(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [touchActive, touchCapable]);

  const value = useMemo<CtrlLayerContextValue>(
    () => ({
      active,
      keyLabel,
      setTouchActive: (nextActive) => {
        if (nextActive) {
          beginActivation();
        } else {
          endActivation();
        }

        setTouchActiveState(nextActive);
      },
      toggleTouchActive: () => {
        setTouchActiveState((current) => {
          const nextActive = !current;

          if (nextActive) {
            beginActivation();
          } else {
            endActivation();
          }

          return nextActive;
        });
      },
    }),
    [active, beginActivation, endActivation, keyLabel],
  );

  return (
    <CtrlLayerContext.Provider value={value}>
      {children}
      {active && activation ? (
        <>
          <CtrlLayerSystemPanel activation={activation} keyLabel={keyLabel} />
          <CtrlLayerStrayDetails activation={activation} />
        </>
      ) : null}
      {!discovered && hintReady ? (
        <div className="ctrl-layer-hint" aria-hidden="true">
          HOLD {keyLabel}
        </div>
      ) : null}
    </CtrlLayerContext.Provider>
  );
}

function CtrlLayerSystemPanel({
  activation,
  keyLabel,
}: {
  activation: CtrlLayerActivation;
  keyLabel: CtrlLayerContextValue["keyLabel"];
}) {
  return (
    <aside
      className="ctrl-layer-system-panel"
      data-ctrl-depth={activation.depth}
      data-ctrl-variant={activation.variant}
      aria-hidden="true"
    >
      <div className="ctrl-layer-system-panel-header">
        <span>CTRL LAYER</span>
        <span>{activation.header}</span>
      </div>
      <div className="ctrl-layer-system-panel-body">
        {activation.readouts.map((readout) => (
          <span key={readout}>{readout}</span>
        ))}
      </div>
      {activation.leakLines.length > 0 ? (
        <div className="ctrl-layer-leakage">
          {activation.leakLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}
      <div className="ctrl-layer-system-panel-footer">
        {activation.footer} / {keyLabel}
      </div>
    </aside>
  );
}

function CtrlLayerStrayDetails({
  activation,
}: {
  activation: CtrlLayerActivation;
}) {
  return (
    <>
      {activation.strays.map((detail, index) => (
        <span
          className="ctrl-layer-stray-detail"
          data-position={detail.position}
          aria-hidden="true"
          key={`${activation.id}-${detail.position}-${index}`}
        >
          {detail.text}
        </span>
      ))}
    </>
  );
}

export function useCtrlLayer() {
  const context = useContext(CtrlLayerContext);

  if (!context) {
    throw new Error("useCtrlLayer must be used within CtrlLayerProvider");
  }

  return context;
}

export function CtrlLayerLogoTrigger({ children }: { children: React.ReactNode }) {
  const { toggleTouchActive } = useCtrlLayer();
  const timeoutRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const clearPress = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handlePointerDown = () => {
    longPressTriggeredRef.current = false;
    clearPress();
    timeoutRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      toggleTouchActive();

      if ("vibrate" in navigator) {
        navigator.vibrate?.(12);
      }
    }, LONG_PRESS_MS);
  };

  const handlePointerEnd = () => {
    clearPress();
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!longPressTriggeredRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    longPressTriggeredRef.current = false;
  };

  useEffect(() => clearPress, []);

  return (
    <div
      className="ctrl-layer-logo-trigger"
      data-ctrl-layer-trigger
      onClickCapture={handleClickCapture}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerEnd}
      onPointerUp={handlePointerEnd}
    >
      {children}
    </div>
  );
}
