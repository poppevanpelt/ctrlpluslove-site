export type RoomPersona = {
  id: string;
  name: string;
  role: string;
  line: string;
  contribution: string;
};

export const roomPersonas: RoomPersona[] = [
  {
    id: "maya-elise-harper",
    name: "Maya Elise Harper",
    role: "Emotional Truth",
    line: "Finds what people are really buying.",
    contribution:
      "Reframes the decision around the human need underneath the stated brief.",
  },
  {
    id: "simon-cross",
    name: "Simon Cross",
    role: "Contrarian Pressure",
    line: "Challenges the answer everyone already agreed on.",
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
      "Reads the cultural risk, memory and meaning around the decision.",
  },
  {
    id: "akiko-hayashi",
    name: "Akiko Hayashi",
    role: "Consequence",
    line: "Looks beyond the next decision.",
    contribution:
      "Keeps the room honest about second-order effects and future regret.",
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
    line: "Would anyone outside this room actually care?",
    contribution:
      "Pulls the room back to the person who has to choose, pay, use or ignore the thing.",
  },
];

export const homepageRoomPersonas = roomPersonas.filter(
  (persona) => persona.id !== "maya-elise-harper",
);
