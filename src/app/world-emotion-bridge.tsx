"use client";

import { useEffect, useState } from "react";

import {
  calculateWorldEmotionState,
  dispatchWorldEmotionState,
  SOUNDTRACK_STATUS_EVENT,
} from "./world-emotion-engine";
import { globalMoodEntries } from "@/content/global-mood";

export function WorldEmotionBridge() {
  const [soundtrackActive, setSoundtrackActive] = useState(false);

  useEffect(() => {
    dispatchWorldEmotionState(calculateWorldEmotionState(globalMoodEntries));

    function syncSoundtrackStatus(event: Event) {
      const customEvent = event as CustomEvent<{ isPlaying?: boolean }>;
      setSoundtrackActive(customEvent.detail?.isPlaying === true);
    }

    window.addEventListener(SOUNDTRACK_STATUS_EVENT, syncSoundtrackStatus);

    return () => {
      window.removeEventListener(SOUNDTRACK_STATUS_EVENT, syncSoundtrackStatus);
    };
  }, []);

  return (
    <p className="global-mood-soundtrack" data-active={soundtrackActive}>
      <span aria-hidden="true" />
      {soundtrackActive ? "Soundtrack responding live" : "Soundtrack paused"}
    </p>
  );
}
