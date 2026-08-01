"use client";

import { createContext, useContext, useMemo } from "react";
import type React from "react";

type CtrlLayerContextValue = {
  active: boolean;
  keyLabel: "CTRL" | "⌘ / CTRL";
  setTouchActive: (active: boolean) => void;
  toggleTouchActive: () => void;
};

const CtrlLayerContext = createContext<CtrlLayerContextValue | null>(null);

export function CtrlLayerProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<CtrlLayerContextValue>(
    () => ({
      active: false,
      keyLabel: "CTRL",
      setTouchActive: () => {},
      toggleTouchActive: () => {},
    }),
    [],
  );

  return (
    <CtrlLayerContext.Provider value={value}>{children}</CtrlLayerContext.Provider>
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
  return <div className="ctrl-layer-logo-trigger">{children}</div>;
}
