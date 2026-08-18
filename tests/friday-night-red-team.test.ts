import assert from "node:assert/strict";
import test from "node:test";

import { isFridayNightRedTeamActive } from "../src/lib/fridayNightRedTeam.ts";

test("Friday Night Red Team begins at Friday 17:00 local time", () => {
  assert.equal(isFridayNightRedTeamActive(new Date(2026, 7, 21, 16, 59)), false);
  assert.equal(isFridayNightRedTeamActive(new Date(2026, 7, 21, 17, 0)), true);
  assert.equal(isFridayNightRedTeamActive(new Date(2026, 7, 21, 23, 59)), true);
});

test("Friday Night Red Team continues until Saturday 05:00 local time", () => {
  assert.equal(isFridayNightRedTeamActive(new Date(2026, 7, 22, 0, 0)), true);
  assert.equal(isFridayNightRedTeamActive(new Date(2026, 7, 22, 4, 59)), true);
  assert.equal(isFridayNightRedTeamActive(new Date(2026, 7, 22, 5, 0)), false);
});

test("Friday Night Red Team stays quiet for the rest of the week", () => {
  assert.equal(isFridayNightRedTeamActive(new Date(2026, 7, 20, 22, 0)), false);
  assert.equal(isFridayNightRedTeamActive(new Date(2026, 7, 23, 2, 0)), false);
});
