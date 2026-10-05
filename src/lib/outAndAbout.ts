export type OutAndAboutProfileId =
  | "bali"
  | "airport"
  | "haarlem"
  | "amsterdam"
  | "netherlands"
  | "default";

export type OutAndAboutContext = {
  city?: string;
  region?: string;
  country?: string;
  areaOverride?: string;
  now?: Date;
};

export type OutAndAboutMessage = {
  subject: string;
  body: string;
  note: string;
  profile: OutAndAboutProfileId;
  publicArea: string;
};

type Profile = {
  id: OutAndAboutProfileId;
  publicArea: string;
  notes: string[];
};

const PROFILES: Record<OutAndAboutProfileId, Profile> = {
  bali: {
    id: "bali",
    publicArea: "Bali",
    notes: [
      "Wanna know what monkeys find so fascinating about infinity pools? Apparently, looking at their own reflections. Proper Goodall-style field research.",
      "Field note: monkeys appear to understand infinity pools perfectly well. The edge is scenery. The reflection is the actual programme.",
      "Current research question: self-recognition, vanity, or simply excellent monkey UX? Findings remain inconclusive.",
    ],
  },
  airport: {
    id: "airport",
    publicArea: "Airport",
    notes: [
      "Field note: airports are what happens when waiting gets an architecture budget.",
      "Current experiment: whether leaving the country counts as a legitimate meeting-avoidance strategy. Early results are encouraging.",
      "Field note: everybody at an airport is between two versions of their day. Quite a good place to think.",
    ],
  },
  haarlem: {
    id: "haarlem",
    publicArea: "Haarlem",
    notes: [
      "Field note: the useful bit of a working day often happens somewhere between the desk and wherever you were supposedly going.",
      "Out in the field. Admittedly the field currently has very good coffee and a bicycle lane through it.",
      "Field note: proximity and availability turn out to be completely different things.",
    ],
  },
  amsterdam: {
    id: "amsterdam",
    publicArea: "Amsterdam",
    notes: [
      "Field note: Amsterdam remains excellent proof that being nearby and being available are not the same thing.",
      "Current observation: moving through a city is surprisingly good at removing sentences that should never have become meetings.",
      "Field note: a walk still beats a status call more often than anyone in software would like to admit.",
    ],
  },
  netherlands: {
    id: "netherlands",
    publicArea: "The Netherlands",
    notes: [
      "Field note: nearby enough to answer later, far enough away not to be in the meeting.",
      "Out in the field. The field is flat, highly organised and probably has a bicycle lane through it.",
      "Current test: how much work improves when the calendar loses track of you for a while.",
    ],
  },
  default: {
    id: "default",
    publicArea: "Out and about",
    notes: [
      "Current field note: the interesting part usually starts just after you stop calling it work.",
      "Out in the field. No coordinates. That would rather spoil the point.",
      "Current experiment: whether fewer meetings produce more reality. So far, yes.",
    ],
  },
};

const BALI_CITIES = [
  "denpasar",
  "ubud",
  "singaraja",
  "kuta",
  "canggu",
  "seminyak",
  "sanur",
  "gianyar",
  "badung",
  "buleleng",
  "pemuteran",
  "lovina",
  "sumberkima",
];

const AIRPORT_CITIES = [
  "schiphol",
  "schiphol-rijk",
  "hoofddorp",
];

function normalise(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function profileFromOverride(value?: string): OutAndAboutProfileId | null {
  const area = normalise(value);

  if (!area) return null;
  if (["bali", "sumberkima", "ubud", "pemuteran"].includes(area)) return "bali";
  if (["airport", "schiphol"].includes(area)) return "airport";
  if (area === "haarlem") return "haarlem";
  if (area === "amsterdam") return "amsterdam";
  if (["nl", "netherlands", "the-netherlands"].includes(area)) return "netherlands";
  if (["default", "unknown", "elsewhere"].includes(area)) return "default";

  return null;
}

export function resolveOutAndAboutProfile(
  context: OutAndAboutContext,
): OutAndAboutProfileId {
  const override = profileFromOverride(context.areaOverride);
  if (override) return override;

  const city = normalise(context.city);
  const country = normalise(context.country);

  if (AIRPORT_CITIES.some((candidate) => city.includes(candidate))) {
    return "airport";
  }

  if (city.includes("haarlem")) return "haarlem";
  if (city.includes("amsterdam")) return "amsterdam";

  if (
    country === "id" &&
    BALI_CITIES.some((candidate) => city.includes(candidate))
  ) {
    return "bali";
  }

  if (country === "nl") return "netherlands";

  return "default";
}

function dailyIndex(profile: OutAndAboutProfileId, now: Date, length: number) {
  const dateKey = now.toISOString().slice(0, 10);
  const seed = `${profile}:${dateKey}`;
  let hash = 0;

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash % length;
}

export function buildOutAndAboutMessage(
  context: OutAndAboutContext,
): OutAndAboutMessage {
  const profileId = resolveOutAndAboutProfile(context);
  const profile = PROFILES[profileId];
  const now = context.now ?? new Date();
  const note = profile.notes[dailyIndex(profileId, now, profile.notes.length)];

  const body = [
    "Hi,",
    "",
    "I'm out and about.",
    "",
    "One of the reasons I built ctrl+love was to spend less time in meetings and more time where things actually happen. So I'm testing the product.",
    "",
    note,
    "",
    "If it can wait, I'll get back to you when I'm back.",
    "",
    "If it can't, Savannah is around at ctrlpluslove.com. She knows far too much.",
    "",
    "Poppe",
  ].join("\n");

  return {
    subject: "Out and about",
    body,
    note,
    profile: profile.id,
    publicArea: profile.publicArea,
  };
}
