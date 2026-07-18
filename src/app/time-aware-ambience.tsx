"use client";

import { useEffect } from "react";

function getDayPart(hour: number) {
  if (hour < 6) {
    return "night";
  }

  if (hour < 11) {
    return "morning";
  }

  if (hour < 17) {
    return "day";
  }

  if (hour < 21) {
    return "evening";
  }

  return "night";
}

export function TimeAwareAmbience() {
  useEffect(() => {
    const root = document.documentElement;
    let timeout = 0;

    const syncDayPart = () => {
      root.dataset.daypart = getDayPart(new Date().getHours());
      timeout = window.setTimeout(syncDayPart, 15 * 60 * 1000);
    };

    syncDayPart();

    return () => {
      window.clearTimeout(timeout);
      delete root.dataset.daypart;
    };
  }, []);

  return null;
}
