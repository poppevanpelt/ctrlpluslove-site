import assert from "node:assert/strict";
import test from "node:test";

import {
  HOMEPAGE_PORTRAIT_REVISION,
  getRoomPersonaPortraitSrc,
  homepagePersonaIds,
  homepageRoomPersonas,
} from "../src/app/room-personas-data.ts";

const expectedPortraits = [
  ["lexi-arden", "/room/personas/lexi-arden-20260920.svg"],
  ["wade-ellison", "/room/personas/wade-ellison.jpg"],
  ["nick-deckman", "/room/personas/nick-deckman-20260920.jpg"],
  ["vera-elise-hartmann", "/room/personas/vera-elise-hartmann.jpg"],
  ["akiko-hayashi", "/room/personas/akiko-hayashi.webp"],
  ["adrian-mbeki", "/room/personas/adrian-mbeki-20260920.svg"],
  ["maya-elise-harper", "/room/personas/maya-elise-harper.webp"],
  ["dr-lila-voss", "/room/personas/dr-lila-voss-20260920.svg"],
  ["simon-cross", "/room/personas/simon-cross.webp"],
  ["the-customer", "/room/personas/the-customer.webp"],
] as const;

test("homepage persona cast stays canonical and ordered", () => {
  assert.deepEqual(
    [...homepagePersonaIds],
    expectedPortraits.map(([id]) => id),
  );
});

test("homepage persona portraits stay pinned to approved assets", () => {
  assert.equal(homepageRoomPersonas.length, expectedPortraits.length);

  assert.deepEqual(
    homepageRoomPersonas.map((persona) => [persona.id, persona.portrait]),
    expectedPortraits.map(([id, portrait]) => [id, portrait]),
  );
});

test("homepage portrait urls are revisioned to prevent stale transformed images", () => {
  for (const persona of homepageRoomPersonas) {
    const src = getRoomPersonaPortraitSrc(persona);
    assert.ok(src);
    assert.ok(src.includes(`v=${HOMEPAGE_PORTRAIT_REVISION}`));
  }
});
