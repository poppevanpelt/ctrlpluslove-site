"use client";

import { useEffect, useState } from "react";

import { pristineSteelBallState, type SteelBallState } from "@/lib/steelBall/ballState";

const fallbackState: SteelBallState = pristineSteelBallState;

function getSurfaceLabel(state: SteelBallState) {
  if (!state.trace) {
    return "Baseline scratches";
  }

  if (state.trace.condition === "dusty") {
    return state.trace.source === "tokyo"
      ? "Microscopic cool residue"
      : state.trace.source === "valencia"
        ? "Microscopic warm residue"
        : "Microscopic residue";
  }

  return state.trace.condition[0].toUpperCase() + state.trace.condition.slice(1);
}

export function SteelBallMemoryPanel() {
  const [state, setState] = useState<SteelBallState>(fallbackState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!window.steelBall) {
      return;
    }

    return window.steelBall.subscribe((nextState) => {
      setState(nextState);
      setIsReady(true);
    });
  }, []);

  const borrowBall = () => {
    window.steelBall?.borrow({
      by: "ctrl-love-office",
      destination: "calibration-range",
      note: "The office borrowed the steel ball for a quiet calibration check.",
    });
  };

  const returnBall = () => {
    window.steelBall?.return({
      actor: "The office",
      note: "The steel ball returned with a small trace of handling.",
      condition: {
        condition: "polished",
        source: "maintenance.polished",
        intensity: 0.24,
        durationMs: 75_000,
      },
    });
  };

  const addSurfaceTrace = () => {
    window.steelBall?.setCondition({
      condition: "dusty",
      source: "tokyo",
      intensity: 0.16,
      durationMs: 90_000,
    });
  };

  const clearTrace = () => {
    window.steelBall?.clearCondition({
      note: "The steel ball appears pristine again.",
    });
  };

  return (
    <aside className="steel-ball-memory-panel" aria-label="Steel Ball object status">
      <div>
        <p className="section-kicker">Object status</p>
        <h2>Shared office object</h2>
        <p>
          The cursor is now treated as one persistent steel ball. It can leave,
          return, and carry temporary traces of where it has been.
        </p>
      </div>

      <dl>
        <div>
          <dt>Custody</dt>
          <dd>{state.borrowed ? "In the office" : "With the visitor"}</dd>
        </div>
        <div>
          <dt>Surface</dt>
          <dd>{getSurfaceLabel(state)}</dd>
        </div>
      </dl>

      <div className="steel-ball-memory-actions" aria-label="Manual Steel Ball handling">
        <button type="button" onClick={borrowBall} disabled={!isReady || state.borrowed}>
          Borrow
        </button>
        <button type="button" onClick={returnBall} disabled={!isReady || !state.borrowed}>
          Return
        </button>
        <button type="button" onClick={addSurfaceTrace} disabled={!isReady}>
          Add trace
        </button>
        {process.env.NODE_ENV !== "production" ? (
          <button
            type="button"
            onClick={() => window.steelBall?.debug?.setGravity({ x: 0.42, y: 0.22 })}
            disabled={!isReady}
          >
            Tilt
          </button>
        ) : null}
        <button type="button" onClick={clearTrace} disabled={!isReady || !state.trace}>
          Clear
        </button>
      </div>
    </aside>
  );
}
