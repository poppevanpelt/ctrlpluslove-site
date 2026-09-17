"use client";

import { Fragment, useEffect, type ReactNode } from "react";

const routeStyles = `
  body.website-002-active .project-navigation,
  body.website-002-active .steel-ball-cursor,
  body.website-002-active .steel-ball-stage-origin,
  body.website-002-active [data-steel-preview-owner="true"] {
    display: none !important;
  }
`;

export function Website002Shell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("website-002-active");

    return () => {
      document.body.classList.remove("website-002-active");
    };
  }, []);

  return (
    <Fragment>
      <style>{routeStyles}</style>
      {children}
    </Fragment>
  );
}
