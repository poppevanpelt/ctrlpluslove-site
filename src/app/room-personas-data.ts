export type RoomPersona = {
  id: string;
  name: string;
  role: string;
  line: string;
  contribution?: string;
  portrait?: string;
  portraitPosition?: string;
};

export const coreRoomPersonas: RoomPersona[] = [
  {
    id: "maya-elise-harper",
    name: "Maya Elise Harper",
    role: "Emotional Truth",
    line: "Finds what people are buying beneath the brief.",
    contribution:
      "Reframes the decision around the human need underneath the stated brief.",
    portrait: "/room/personas/maya-elise-harper.webp",
    portraitPosition: "50% 43%",
  },
  {
    id: "simon-cross",
    name: "Simon Cross",
    role: "Contrarian Pressure",
    line: "Challenges the answer the room agreed on too early.",
    contribution:
      "Applies constructive skepticism before the market does it less politely.",
    portrait: "/room/personas/simon-cross.webp",
    portraitPosition: "50% 42%",
  },
  {
    id: "nick-deckman",
    name: "Nick Deckman",
    role: "Commercial Realism",
    line: "Sees the cost of being wrong.",
    contribution:
      "Tests whether the recommendation can survive budget, timing and commercial reality.",
    portrait: "/room/personas/nick-deckman.webp",
    portraitPosition: "50% 39%",
  },
  {
    id: "lexi-arden",
    name: "Lexi Arden",
    role: "Cultural Friction",
    line: "Spots what others miss.",
    contribution:
      "Reads the cultural risk, memory and meaning surrounding the decision.",
    portrait: "/room/personas/lexi-arden.jpg",
    portraitPosition: "50% 40%",
  },
  {
    id: "akiko-hayashi",
    name: "Akiko Hayashi",
    role: "Consequence",
    line: "Looks beyond the next decision.",
    contribution:
      "Keeps the room honest about second-order effects, unintended consequences and future regret.",
    portrait: "/room/personas/akiko-hayashi.webp",
    portraitPosition: "50% 40%",
  },
  {
    id: "adrian-mbeki",
    name: "Adrian Mbeki",
    role: "Reality Stress",
    line: "Tests what survives outside the room.",
    contribution:
      "Pushes the idea against operational pressure, customer behavior and messy reality.",
    portrait: "/room/personas/adrian-mbeki-20260920.svg",
    portraitPosition: "50% 38%",
  },
  {
    id: "the-customer",
    name: "The Customer",
    role: "The Missing Chair",
    line: "Would anyone outside this room care enough to act?",
    contribution:
      "Pulls the room back to the person who has to choose, pay for, use or ignore the thing.",
    portrait: "/room/personas/the-customer.webp",
    portraitPosition: "50% 42%",
  },
];

export const supportingRoomPersonas: RoomPersona[] = [
  {
    id: "charles-whitmore",
    name: "Charles Whitmore",
    role: "Executive Judgment",
    line: "Clarifies the real decision, the stakes and what success must look like.",
    portrait: "/room/personas/charles-whitmore.webp",
    portraitPosition: "50% 42%",
  },
  {
    id: "clare-mercer",
    name: "Clare Mercer",
    role: "Synthesis & Governance",
    line: "Separates evidence from assumptions.",
    contribution:
      "Ensures the Room reaches a coherent recommendation rather than a collection of opinions.",
    portrait: "/room/personas/clare-mercer.webp",
    portraitPosition: "50% 42%",
  },
  {
    id: "judy-law",
    name: "Judy Law",
    role: "Legal Exposure",
    line: "Identifies legal, ethical and regulatory risks before they become expensive.",
    portrait: "/room/personas/judy-law.jpg",
    portraitPosition: "50% 39%",
  },
  {
    id: "grace-holloway",
    name: "Grace Holloway",
    role: "Reputation",
    line: "Watches trust move, and marks the moment credibility is being spent rather than earned.",
    contribution:
      "Tracks when confidence quietly leaves the room before anyone has named the loss.",
    portrait: "/room/personas/grace-holloway.webp",
    portraitPosition: "50% 40%",
  },
  {
    id: "brigitte-brussels",
    name: "Brigitte Brussels",
    role: "Institutional Systems",
    line: "Brings the perspective of governments, regulators and large institutions.",
    portrait: "/room/personas/brigitte-brussels.jpg",
    portraitPosition: "50% 39%",
  },
  {
    id: "sandra-soskic",
    name: "Sandra Soskic",
    role: "Execution Reality",
    line: "Asks whether the recommendation can be produced, delivered and maintained.",
    portrait: "/room/personas/sandra-soskic.webp",
    portraitPosition: "50% 42%",
  },
  {
    id: "vera-elise-hartmann",
    name: "Vera Elise Hartmann",
    role: "Historical Memory",
    line: "Recognizes patterns that have appeared before.",
    contribution:
      "Reminds the Room what history is trying to teach.",
    portrait: "/room/personas/vera-elise-hartmann.jpg",
    portraitPosition: "50% 39%",
  },
  {
    id: "dr-mara-veld",
    name: "Dr. Mara Veld",
    role: "Structural Depth",
    line: "What is this decision really sitting on?",
    contribution:
      "Looks past the argument to the system beneath it: incentives, history, dependencies and accumulated debt.",
    portrait: "/room/personas/dr-mara-veld.webp",
    portraitPosition: "50% 42%",
  },
  {
    id: "dr-lila-voss",
    name: "Dr. Lila Voss",
    role: "Institutional Ritual",
    line: "What ritual is being performed instead of a decision?",
    contribution:
      "Reads hierarchy, deference and ritual agreement as visible operating evidence.",
    portrait: "/room/personas/dr-lila-voss.webp",
    portraitPosition: "50% 42%",
  },
  {
    id: "wade-ellison",
    name: "Wade Ellison",
    role: "Unfinished Intent",
    line: "Detects the questions nobody has fully asked yet.",
    contribution:
      "Surfaces emotional signals and unfinished thinking before they disappear.",
    portrait: "/room/personas/wade-ellison.jpg",
    portraitPosition: "50% 39%",
  },
  {
    id: "johan-cruyff",
    name: "Johan Cruyff",
    role: "Simple Truth",
    line: "Leaves the Room with the observation that makes the pattern obvious.",
    portrait: "/room/personas/johan-cruyff-silhouette.jpg",
    portraitPosition: "50% 39%",
  },
];

// Fictional research associates, second intake.
export const researchAssociates: RoomPersona[] = [
  {
    "id": "ines-valera",
    "name": "Inés Valera",
    "role": "Anthropology",
    "line": "The unofficial rules explain more than the official ones.",
    "contribution": "Observes rituals, workarounds and discrepancies between stated values and everyday practice."
  },
  {
    "id": "otto-rehm",
    "name": "Otto Rehm",
    "role": "Maintenance Engineering",
    "line": "Everything works until someone stops maintaining it.",
    "contribution": "Identifies maintenance burdens, dependencies and neglected failure modes."
  },
  {
    "id": "nina-bell",
    "name": "Nina Bell",
    "role": "Musical Chemistry",
    "line": "The timing changed before the conversation did.",
    "contribution": "Notices coordination, listening, timing and recovery after mistakes."
  },
  {
    "id": "arthur-pike",
    "name": "Arthur Pike",
    "role": "Archival Science",
    "line": "The missing record is often the most interesting one.",
    "contribution": "Tracks lost context and distinguishes absent evidence from evidence of absence."
  },
  {
    "id": "miriam-finch",
    "name": "Miriam Finch",
    "role": "Attention Research",
    "line": "Interest left the room three minutes ago.",
    "contribution": "Observes repetition, disengagement and avoidable cognitive load."
  },
  {
    "id": "elias-stern",
    "name": "Elias Stern",
    "role": "Experimental Physics",
    "line": "The control condition is missing.",
    "contribution": "Proposes comparisons that separate effects from coincidence."
  },
  {
    "id": "noor-haddad",
    "name": "Noor Haddad",
    "role": "Cartography",
    "line": "The map ends before the territory does.",
    "contribution": "Maps unexplored alternatives and boundaries of current knowledge."
  },
  {
    "id": "greta-lund",
    "name": "Greta Lund",
    "role": "Industrial Design",
    "line": "The extra part is doing no useful work.",
    "contribution": "Finds unnecessary complexity and opportunities for simpler interfaces."
  },
  {
    "id": "mateo-rivas",
    "name": "Mateo Rivas",
    "role": "Ecology",
    "line": "Nothing changes in isolation.",
    "contribution": "Traces interdependence, feedback loops and downstream effects."
  },
  {
    "id": "celine-morin",
    "name": "Céline Morin",
    "role": "Linguistics",
    "line": "Everyone used the same word for a different thing.",
    "contribution": "Identifies semantic ambiguity and incompatible definitions."
  },
  {
    "id": "felix-owusu",
    "name": "Felix Owusu",
    "role": "Theatre Direction",
    "line": "The scene changed when the quiet person spoke.",
    "contribution": "Observes turn-taking, status and shifts in group dynamics."
  },
  {
    "id": "beatrice-shaw",
    "name": "Beatrice Shaw",
    "role": "Statistics",
    "line": "Precision is not the same as certainty.",
    "contribution": "Distinguishes measurement, uncertainty and unsupported inference."
  },
  {
    "id": "kenji-sato",
    "name": "Kenji Sato",
    "role": "Logistics",
    "line": "The delay is hiding between two successful steps.",
    "contribution": "Finds handoff friction, queues and bottlenecks."
  },
  {
    "id": "ada-kessler",
    "name": "Ada Kessler",
    "role": "Material Science",
    "line": "The stress concentrates at the joint.",
    "contribution": "Identifies weak interfaces and conditions under which systems fail."
  },
  {
    "id": "rosa-bakker",
    "name": "Rosa Bakker",
    "role": "Field Observation",
    "line": "The ordinary detail is the clue.",
    "contribution": "Records concrete anomalies before offering interpretations."
  },
  {
    "id": "samir-desai",
    "name": "Samir Desai",
    "role": "Economics",
    "line": "The incentive rewards the opposite behaviour.",
    "contribution": "Examines tradeoffs and unintended incentives."
  },
  {
    "id": "edith-cole",
    "name": "Edith Cole",
    "role": "Restoration",
    "line": "Not everything old needs replacing.",
    "contribution": "Distinguishes valuable inherited qualities from accumulated damage."
  },
  {
    "id": "hugo-march",
    "name": "Hugo March",
    "role": "Serendipity Research",
    "line": "The accident produced a better experiment.",
    "contribution": "Recognizes unexpected results worth investigating without mistaking coincidence for proof."
  }
];

export const roomPersonas = coreRoomPersonas;
export const allRoomPersonas = [...coreRoomPersonas, ...supportingRoomPersonas, ...researchAssociates];

export const homepagePersonaIds = [
  "lexi-arden",
  "wade-ellison",
  "nick-deckman",
  "vera-elise-hartmann",
  "akiko-hayashi",
  "adrian-mbeki",
  "maya-elise-harper",
  "dr-lila-voss",
  "simon-cross",
  "the-customer",
] as const;

export const HOMEPAGE_PORTRAIT_REVISION = "20260922-adrian-restored";

const homepagePersonaIdSet = new Set<string>(homepagePersonaIds);

export const homepageRoomPersonas = homepagePersonaIds
  .map((id) => allRoomPersonas.find((persona) => persona.id === id))
  .filter((persona): persona is RoomPersona => Boolean(persona));

export function getRoomPersonaPortraitSrc(persona: RoomPersona) {
  if (!persona.portrait) return undefined;
  if (!homepagePersonaIdSet.has(persona.id)) return persona.portrait;

  const separator = persona.portrait.includes("?") ? "&" : "?";
  return `${persona.portrait}${separator}v=${HOMEPAGE_PORTRAIT_REVISION}`;
}

export function getRoomPersona(id: string) {
  return allRoomPersonas.find((persona) => persona.id === id);
}

export function getRoomPersonaNeighbors(id: string) {
  const index = allRoomPersonas.findIndex((persona) => persona.id === id);

  if (index < 0) {
    return {
      previous: undefined,
      next: undefined,
    };
  }

  return {
    previous: allRoomPersonas[index - 1] ?? allRoomPersonas[allRoomPersonas.length - 1],
    next: allRoomPersonas[index + 1] ?? allRoomPersonas[0],
  };
}
