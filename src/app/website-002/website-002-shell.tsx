"use client";

import { useEffect, type ReactNode } from "react";

export function Website002Shell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("website-002-active");

    return () => {
      document.body.classList.remove("website-002-active");
    };
  }, []);

  return children;
}
