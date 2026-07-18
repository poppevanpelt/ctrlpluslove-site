"use client";

import { useEffect, useState } from "react";

function formatLocalTime(timezone?: string) {
  if (!timezone) {
    return "Local time unavailable";
  }

  try {
    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
      timeZoneName: "short",
    }).format(new Date());
  } catch {
    return timezone;
  }
}

export function EmbassyLocalTime({ timezone }: { timezone?: string }) {
  const [localTime, setLocalTime] = useState("Local time pending");

  useEffect(() => {
    let timer = 0;

    const sync = () => {
      setLocalTime(formatLocalTime(timezone));
      timer = window.setTimeout(sync, 60 * 1000);
    };

    sync();

    return () => {
      window.clearTimeout(timer);
    };
  }, [timezone]);

  return <>{localTime}</>;
}
