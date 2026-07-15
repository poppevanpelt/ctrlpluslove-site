export type RoomPersona = {
  id: string;
  name: string;
  role: string;
  line: string;
  contribution?: string;
};

export const coreRoomPersonas: RoomPersona[] = [
  {
    id: "maya-elise-harper",
    name: "Maya Elise Harper",
    role: "Emotional Truth",
    line: "Finds what people are buying beneath the brief.",
    contribution:
      "Reframes the decision around the human need underneath the stated brief.",
  },
  {
    id: "simon-cross",
    name: "Simon Cross",
    role: "Contrarian Pressure",
    line: "Challenges the answer the room agreed on too early.",
    contribution:
      "Applies constructive skepticism before the market does it less politely.",
  },
  {
    id: "nick-deckman",
    name: "Nick Deckman",
    role: "Commercial Realism",
    line: "Sees the cost of being wrong.",
    contribution:
      "Tests whether the recommendation can survive budget, timing and commercial reality.",
  },
  {
    id: "lexi-arden",
    name: "Lexi Arden",
    role: "Cultural Friction",
    line: "Spots what others miss.",
    contribution:
      "Reads the cultural risk, memory and meaning surrounding the decision.",
  },
  {
    id: "akiko-hayashi",
    name: "Akiko Hayashi",
    role: "Consequence",
    line: "Looks beyond the next decision.",
    contribution:
      "Keeps the room honest about second-order effects, unintended consequences and future regret.",
  },
  {
    id: "adrian-mbeki",
    name: "Adrian Mbeki",
    role: "Reality Stress",
    line: "Tests what survives outside the room.",
    contribution:
      "Pushes the idea against operational pressure, customer behavior and messy reality.",
  },
  {
    id: "the-customer",
    name: "The Customer",
    role: "The Missing Chair",
    line: "Would anyone outside this room care enough to act?",
    contribution:
      "Pulls the room back to the person who has to choose, pay for, use or ignore the thing.",
  },
];

export const supportingRoomPersonas: RoomPersona[] = [
  {
    id: "charles-whitmore",
    name: "Charles Whitmore",
    role: "Executive Judgment",
    line: "Clarifies the real decision, the stakes and what success must look like.",
  },
  {
    id: "clare-mercer",
    name: "Clare Mercer",
    role: "Synthesis & Governance",
    line: "Separates evidence from assumptions.",
    contribution:
      "Ensures the Room reaches a coherent recommendation rather than a collection of opinions.",
  },
  {
    id: "judy-law",
    name: "Judy Law",
    role: "Legal Exposure",
    line: "Identifies legal, ethical and regulatory risks before they become expensive.",
  },
  {
    id: "grace-holloway",
    name: "Grace Holloway",
    role: "Reputation",
    line: "Protects long-term trust, legitimacy and public confidence.",
  },
  {
    id: "brigitte-brussels",
    name: "Brigitte Brussels",
    role: "Institutional Systems",
    line: "Brings the perspective of governments, regulators and large institutions.",
  },
  {
    id: "sandra-soskic",
    name: "Sandra Soskic",
    role: "Execution Reality",
    line: "Asks whether the recommendation can be produced, delivered and maintained.",
  },
  {
    id: "vera-elise-hartmann",
    name: "Vera Elise Hartmann",
    role: "Historical Memory",
    line: "Recognizes patterns that have appeared before.",
    contribution:
      "Reminds the Room what history is trying to teach.",
  },
  {
    id: "wade-ellison",
    name: "Wade Ellison",
    role: "Unfinished Intent",
    line: "Detects the questions nobody has fully asked yet.",
    contribution:
      "Surfaces emotional signals and unfinished thinking before they disappear.",
  },
  {
    id: "johan-cruyff",
    name: "Johan Cruyff",
    role: "Simple Truth",
    line: "Leaves the Room with the observation that makes the pattern obvious.",
  },
];

export const roomPersonas = coreRoomPersonas;
export const homepageRoomPersonas = coreRoomPersonas;

export const allRoomPersonas = [...coreRoomPersonas, ...supportingRoomPersonas];

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
