import assert from "node:assert/strict";
import test from "node:test";

import {
  createOfficeActivities,
  selectOfficeActivity,
} from "../src/lib/livingOffice/activityGenerator.ts";
import { createLivingOfficeState } from "../src/lib/livingOffice/officeState.ts";
import { createPersonaPresence, getTimeBand } from "../src/lib/livingOffice/personaPresence.ts";

test("Living Office maps local time into the intended office rhythm", () => {
  assert.equal(getTimeBand(new Date("2026-07-18T03:00:00")), "late-night");
  assert.equal(getTimeBand(new Date("2026-07-18T09:00:00")), "morning");
  assert.equal(getTimeBand(new Date("2026-07-18T15:00:00")), "afternoon");
  assert.equal(getTimeBand(new Date("2026-07-18T22:00:00")), "night");
});

test("Living Office is quieter late at night than in the morning", () => {
  const morning = createLivingOfficeState({
    date: new Date("2026-07-18T09:00:00"),
    page: "/",
    mood: "curious",
  });
  const lateNight = createLivingOfficeState({
    date: new Date("2026-07-18T03:00:00"),
    page: "/",
    mood: "curious",
  });

  assert.ok(morning.activeCount > lateNight.activeCount);
});

test("Living Office activities remain editorial and local-only", () => {
  const date = new Date("2026-07-18T14:00:00");
  const personas = createPersonaPresence({
    date,
    mood: "focused",
    page: "/embassies/",
  });
  const activities = createOfficeActivities({
    date,
    mood: "focused",
    page: "/embassies/",
    personas,
    timeBand: "afternoon",
    visitor: { isReturning: true, isFamiliar: false },
  });

  assert.ok(activities.length >= 8);
  assert.ok(activities.some((activity) => activity.text.includes("Tokyo")));
  assert.ok(activities.some((activity) => activity.source === "memory"));
  assert.equal(activities.some((activity) => /http|fetch|network/i.test(activity.text)), false);
});

test("Living Office activity selection is stable for the same seed", () => {
  const state = createLivingOfficeState({
    date: new Date("2026-07-18T14:00:00"),
    page: "/room/",
    mood: "building",
  });

  assert.deepEqual(
    selectOfficeActivity(state.activities, "same-seed"),
    selectOfficeActivity(state.activities, "same-seed"),
  );
  assert.match(state.currentQuestion, /\?$/);
  assert.ok(state.contributingEmbassies.length > 0);
});
