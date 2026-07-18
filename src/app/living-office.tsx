"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import {
  createOfficeBellActivity,
  selectOfficeActivity,
  type OfficeActivity,
  type VisitorMemorySummary,
} from "@/lib/livingOffice/activityGenerator";
import {
  createLivingOfficeState,
  type LivingOfficeState,
} from "@/lib/livingOffice/officeState";
import { useCtrlLayer } from "./ctrl-layer";

const MEMORY_KEY = "ctrl-love-living-office-memory";
const OFFICE_SOUNDTRACK_EVENT = "ctrl-love-office-soundtrack-shift";
const MIN_FEED_DELAY_MS = 45_000;
const MAX_FEED_DELAY_MS = 120_000;
const BELL_MIN_INTERVAL_MS = 2.5 * 60 * 60 * 1000;

type StoredOfficeMemory = {
  firstVisitAt: string;
  lastVisitAt: string;
  visits: number;
  totalSeconds: number;
  pages: Record<string, number>;
  lastBellAt?: string;
};

const fallbackMemory: StoredOfficeMemory = {
  firstVisitAt: "",
  lastVisitAt: "",
  visits: 1,
  totalSeconds: 0,
  pages: {},
};

function readMemory(now: Date): StoredOfficeMemory {
  try {
    const parsed = JSON.parse(localStorage.getItem(MEMORY_KEY) ?? "null") as
      | StoredOfficeMemory
      | null;

    if (!parsed?.firstVisitAt) {
      return {
        ...fallbackMemory,
        firstVisitAt: now.toISOString(),
        lastVisitAt: now.toISOString(),
      };
    }

    return parsed;
  } catch {
    return {
      ...fallbackMemory,
      firstVisitAt: now.toISOString(),
      lastVisitAt: now.toISOString(),
    };
  }
}

function writeMemory(memory: StoredOfficeMemory) {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch {}
}

function summarizeMemory(memory: StoredOfficeMemory): VisitorMemorySummary {
  const favoritePage = Object.entries(memory.pages).sort(
    (left, right) => right[1] - left[1],
  )[0]?.[0];

  return {
    isReturning: memory.visits > 1,
    isFamiliar: memory.totalSeconds > 300 || Object.keys(memory.pages).length > 3,
    favoritePage,
  };
}

function getDelay(state: LivingOfficeState) {
  const seed =
    state.generatedAt.length +
    state.activeCount * 7919 +
    state.globalMood.length * 101;

  return MIN_FEED_DELAY_MS + (seed % (MAX_FEED_DELAY_MS - MIN_FEED_DELAY_MS));
}

function getReadableTimeBand(timeBand: LivingOfficeState["timeBand"]) {
  if (timeBand === "late-night") {
    return "LATE NIGHT";
  }

  return timeBand.toUpperCase();
}

function getRootPageName(pathname: string) {
  return pathname === "/" ? "home" : pathname.split("/").filter(Boolean)[0] ?? "home";
}

function hashText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function maybeTriggerMicroIntervention(seed: string) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const chance = (hashText(seed) % 10_000) / 10_000;

  if (chance > 0.008) {
    return;
  }

  const interventions = ["pause-ball", "annotation", "pencil-line", "paperclip", "stolen-key"];
  const type = interventions[Math.floor(chance * 10000) % interventions.length];
  const root = document.documentElement;
  root.dataset.officeIntervention = type;

  if (type === "stolen-key") {
    root.dataset.officeStolenKey = "E";
  }

  window.setTimeout(() => {
    delete root.dataset.officeIntervention;
    delete root.dataset.officeStolenKey;
  }, type === "stolen-key" ? 3000 : 4200);
}

export function LivingOffice() {
  const pathname = usePathname();
  const { active: ctrlLayerActive } = useCtrlLayer();
  const [memory, setMemory] = useState<StoredOfficeMemory | null>(null);
  const [state, setState] = useState<LivingOfficeState>(() =>
    createLivingOfficeState({ page: "/" }),
  );
  const [activity, setActivity] = useState<OfficeActivity>(() =>
    selectOfficeActivity(createLivingOfficeState({ page: "/" }).activities, "initial"),
  );
  const [feedKey, setFeedKey] = useState(0);
  const sessionStartedAtRef = useRef<number | null>(null);

  const visitor = useMemo(
    () => summarizeMemory(memory ?? fallbackMemory),
    [memory],
  );
  const feedDelay = getDelay(state);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const now = new Date();
      const nextMemory = readMemory(now);
      const lastVisitDate = Date.parse(nextMemory.lastVisitAt);
      const separatedVisit =
        Number.isFinite(lastVisitDate) && now.getTime() - lastVisitDate > 30 * 60 * 1000;
      const nextVisits = separatedVisit ? nextMemory.visits + 1 : nextMemory.visits;

      sessionStartedAtRef.current = now.getTime();
      nextMemory.visits = nextVisits;
      nextMemory.lastVisitAt = now.toISOString();
      writeMemory(nextMemory);
      setMemory(nextMemory);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const page = getRootPageName(pathname);
      setMemory((currentMemory) => {
        if (!currentMemory) {
          return currentMemory;
        }

        const now = new Date();
        const nextMemory = {
          ...currentMemory,
          lastVisitAt: now.toISOString(),
          pages: {
            ...currentMemory.pages,
            [page]: (currentMemory.pages[page] ?? 0) + 1,
          },
        };

        writeMemory(nextMemory);

        return nextMemory;
      });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMemory((currentMemory) => {
        if (!currentMemory) {
          return currentMemory;
        }

        const previousStartedAt = sessionStartedAtRef.current ?? Date.now();
        const totalSeconds =
          currentMemory.totalSeconds +
          Math.max(1, Math.round((Date.now() - previousStartedAt) / 1000));

        sessionStartedAtRef.current = Date.now();
        const nextMemory = {
          ...currentMemory,
          totalSeconds,
          lastVisitAt: new Date().toISOString(),
        };
        writeMemory(nextMemory);

        return nextMemory;
      });
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const visitorContext = {
        favoritePage: visitor.favoritePage,
        isFamiliar: visitor.isFamiliar,
        isReturning: visitor.isReturning,
      };
      const nextState = createLivingOfficeState({ page: pathname, visitor: visitorContext });
      setState(nextState);
      setActivity(selectOfficeActivity(nextState.activities, `${pathname}:${nextState.generatedAt}`));
      setFeedKey((current) => current + 1);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [pathname, visitor.isReturning, visitor.isFamiliar, visitor.favoritePage]);

  useEffect(() => {
    let timeout = 0;

    const rotateActivity = () => {
      setState((currentState) => {
        const visitorContext = {
          favoritePage: visitor.favoritePage,
          isFamiliar: visitor.isFamiliar,
          isReturning: visitor.isReturning,
        };
        const nextState = createLivingOfficeState({ page: pathname, visitor: visitorContext });
        const nextActivity = selectOfficeActivity(
          nextState.activities,
          `${pathname}:${Date.now()}:${currentState.activeCount}`,
        );

        setActivity(nextActivity);
        setFeedKey((current) => current + 1);
        maybeTriggerMicroIntervention(`${nextActivity.id}:${nextState.generatedAt}`);

        window.dispatchEvent(
          new CustomEvent(OFFICE_SOUNDTRACK_EVENT, {
            detail: {
              density:
                nextState.timeBand === "late-night"
                  ? 0.45
                  : nextState.timeBand === "night"
                    ? 0.68
                    : nextState.globalMood === "energetic" ||
                        nextState.globalMood === "building"
                      ? 1.12
                      : 1,
              timeBand: nextState.timeBand,
              mood: nextState.globalMood,
            },
          }),
        );

        timeout = window.setTimeout(rotateActivity, getDelay(nextState));

        return nextState;
      });
    };

    timeout = window.setTimeout(rotateActivity, feedDelay);

    return () => window.clearTimeout(timeout);
  }, [
    pathname,
    feedDelay,
    visitor.favoritePage,
    visitor.isFamiliar,
    visitor.isReturning,
  ]);

  const ringOfficeBell = () => {
    const now = new Date();
    const lastBellAt = memory?.lastBellAt ? Date.parse(memory.lastBellAt) : 0;

    if (lastBellAt && now.getTime() - lastBellAt < BELL_MIN_INTERVAL_MS) {
      return;
    }

    const bellActivity = createOfficeBellActivity(`${pathname}:${now.toISOString()}`);
    setActivity(bellActivity);
    setFeedKey((current) => current + 1);
    setMemory((currentMemory) => {
      if (!currentMemory) {
        return currentMemory;
      }

      const nextMemory = { ...currentMemory, lastBellAt: now.toISOString() };
      writeMemory(nextMemory);

      return nextMemory;
    });
  };

  const activePersonas = state.personas.filter((persona) => persona.visibility > 0.38);
  const visiblePersonas = activePersonas.slice(0, 4);

  return (
    <>
      <aside className="living-office" aria-label="CTRL+LOVE Office">
        <button
          className="living-office__indicator"
          type="button"
          aria-label="CTRL+LOVE Office status"
        >
          <span>CTRL+LOVE OFFICE</span>
          <strong>{state.activeCount} ACTIVE</strong>
          <em>GLOBAL MOOD: {state.globalMood.toUpperCase()}</em>
        </button>

        <div className="living-office__hover" aria-hidden="true">
          <span>Currently active</span>
          {visiblePersonas.map((persona) => (
            <p key={persona.id}>
              <strong>{persona.name.split(" ")[0]}</strong>
              <em>{persona.status}</em>
            </p>
          ))}
        </div>
      </aside>

      <div className="living-office-feed" aria-live="polite" aria-atomic="true">
        <span key={feedKey}>{activity.text}</span>
      </div>

      <button
        className="office-bell"
        type="button"
        aria-label="Ring the office bell"
        onClick={ringOfficeBell}
        title="Office bell"
      >
        <span aria-hidden="true" />
      </button>

      {ctrlLayerActive ? (
        <aside className="living-office-backstage" aria-hidden="true">
          <div className="living-office-backstage__header">
            <span>OFFICE STATE</span>
            <span>{getReadableTimeBand(state.timeBand)}</span>
          </div>
          <div className="living-office-backstage__body">
            <section>
              <h2>ACTIVE</h2>
              {activePersonas.slice(0, 5).map((persona) => (
                <p key={persona.id}>{persona.name.split(" ")[0]}</p>
              ))}
            </section>
            <section>
              <h2>EMBASSIES CONTRIBUTING</h2>
              {state.contributingEmbassies.map((embassy) => (
                <p key={embassy}>{embassy}</p>
              ))}
            </section>
            <section>
              <h2>CURRENT INTERNAL QUESTION</h2>
              <p>&quot;{state.currentQuestion}&quot;</p>
            </section>
          </div>
        </aside>
      ) : null}
    </>
  );
}
