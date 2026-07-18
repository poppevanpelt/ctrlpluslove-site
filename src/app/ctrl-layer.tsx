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

type CtrlLayerContextValue = {
  active: boolean;
  keyLabel: "CTRL" | "⌘ / CTRL";
  setTouchActive: (active: boolean) => void;
  toggleTouchActive: () => void;
};

const CtrlLayerContext = createContext<CtrlLayerContextValue | null>(null);

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
  const isMacRef = useRef(false);
  const discoveredRef = useRef(true);
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
    writeRootState(active);

    return () => {
      writeRootState(false);
    };
  }, [active, writeRootState]);

  useEffect(() => {
    const isActivationKey = (key: string) =>
      key === "Meta" || key === "Control";

    const deactivate = () => {
      setKeyboardActive(false);
      setTouchActiveState(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActivationKey(event.key) || isTypingTarget(event.target)) {
        return;
      }

      writeRootState(true);
      setKeyboardActive(true);
      markDiscovered();
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
  }, [markDiscovered, writeRootState]);

  useEffect(() => {
    window.setTimeout(() => {
      writeRootState(false);
      setKeyboardActive(false);
      setTouchActiveState(false);
    }, 0);
  }, [pathname, writeRootState]);

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
          markDiscovered();
        }

        writeRootState(nextActive);
        setTouchActiveState(nextActive);
      },
      toggleTouchActive: () => {
        markDiscovered();
        setTouchActiveState((current) => {
          const nextActive = !current;
          writeRootState(nextActive);
          return nextActive;
        });
      },
    }),
    [active, keyLabel, markDiscovered, writeRootState],
  );

  return (
    <CtrlLayerContext.Provider value={value}>
      {children}
      {active ? <CtrlLayerSystemPanel keyLabel={keyLabel} /> : null}
      {!discovered && hintReady ? (
        <div className="ctrl-layer-hint" aria-hidden="true">
          HOLD {keyLabel}
        </div>
      ) : null}
    </CtrlLayerContext.Provider>
  );
}

function CtrlLayerSystemPanel({
  keyLabel,
}: {
  keyLabel: CtrlLayerContextValue["keyLabel"];
}) {
  return (
    <aside className="ctrl-layer-system-panel" aria-hidden="true">
      <div className="ctrl-layer-system-panel-header">
        <span>CTRL LAYER</span>
        <span>ROOM INTERFACE</span>
      </div>
      <div className="ctrl-layer-system-panel-body">
        {SYSTEM_READOUTS.map((readout) => (
          <span key={readout}>{readout}</span>
        ))}
      </div>
      <div className="ctrl-layer-system-panel-footer">
        HOLD {keyLabel} TO KEEP SIGNAL OPEN
      </div>
    </aside>
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
