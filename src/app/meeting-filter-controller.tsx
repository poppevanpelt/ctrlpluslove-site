"use client";

import { useEffect } from "react";

export function MeetingFilterController() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (!window.location.hash) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
      });
    }

    const filter = document.querySelector<HTMLElement>("#meeting-filter");

    if (!filter) {
      return;
    }

    const filterElement = filter;

    function openFilter() {
      filterElement.classList.add("is-open");
      filterElement.setAttribute("aria-hidden", "false");
      filterElement.hidden = false;
      filterElement.scrollIntoView({ block: "start" });
    }

    function closeFilter() {
      filterElement.classList.remove("is-open");
      filterElement.setAttribute("aria-hidden", "true");
      filterElement.hidden = true;
    }

    function syncFromHash() {
      if (window.location.hash === "#meeting-filter") {
        openFilter();
      } else {
        closeFilter();
        if (!window.location.hash) {
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0 });
          });
        }
      }
    }

    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const trigger = target.closest<HTMLElement>(
        'a[href="#meeting-filter"], [data-meeting-filter-close]',
      );

      if (!trigger) {
        return;
      }

      event.preventDefault();

      if (trigger instanceof HTMLAnchorElement && trigger.hash === "#meeting-filter") {
        window.history.replaceState(null, "", "#meeting-filter");
        openFilter();
        return;
      }

      window.history.replaceState(null, "", window.location.pathname);
      closeFilter();
      window.scrollTo({ top: 0 });
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
      });
    }

    syncFromHash();
    document.addEventListener("click", handleClick);
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  return null;
}
