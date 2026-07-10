export type Ambassador = {
  id: string;
  name: string;
  role: string;
  city: string;
  country: string;
  perspective: string;
  bio: string;
  image: string;
  linkedin: string;
  embassyNumber: string;
};

export const ambassadors: Ambassador[] = [
  {
    id: "poppe-van-pelt",
    name: "Poppe van Pelt",
    role: "Strategic Creative Partner",
    city: "Amsterdam",
    country: "Netherlands",
    perspective: "Precision and curiosity.",
    bio:
      "Poppe helps leadership teams slow down enough to notice the assumption underneath the plan. His work sits between brand, product, and the uncomfortable moment when a good idea needs better evidence.",
    image: "/ambassadors/poppe-van-pelt.svg",
    linkedin: "https://www.linkedin.com/",
    embassyNumber: "EMB-001",
  },
  {
    id: "nadia",
    name: "Nadia",
    role: "Decision Designer",
    city: "Berlin",
    country: "Germany",
    perspective: "Useful tension, clearly held.",
    bio:
      "Nadia works with founders and boards on decisions that have become too expensive to keep vague. She is interested in friction, timing, and the tiny signals that reveal whether a team is ready to act.",
    image: "/ambassadors/nadia.svg",
    linkedin: "https://www.linkedin.com/",
    embassyNumber: "EMB-002",
  },
  {
    id: "shun",
    name: "Shun",
    role: "Narrative Strategist",
    city: "Tokyo",
    country: "Japan",
    perspective: "Quiet signals often decide first.",
    bio:
      "Shun works with teams whose strongest insight is still under the surface. His practice connects narrative restraint, operational patience, and the discipline to let weak signals become usable evidence.",
    image: "/ambassadors/shun.svg",
    linkedin: "https://www.linkedin.com/",
    embassyNumber: "EMB-003",
  },
  {
    id: "jorge",
    name: "Jorge",
    role: "Creative Systems Advisor",
    city: "Sao Paulo",
    country: "Brazil",
    perspective: "Make the invisible decision visible.",
    bio:
      "Jorge helps organizations see the decision behind the campaign, the ritual behind the meeting, and the human pressure behind the brief. He is drawn to work where clarity has to travel across cultures.",
    image: "/ambassadors/jorge.svg",
    linkedin: "https://www.linkedin.com/",
    embassyNumber: "EMB-004",
  },
  {
    id: "tayl",
    name: "Tayl",
    role: "Product Consequence Lead",
    city: "Shanghai",
    country: "China",
    perspective: "Reality starts after launch.",
    bio:
      "Tayl helps product teams think through second-order effects before release. Their lens is practical: what changes, who carries the cost, and what the team should learn before momentum gets expensive.",
    image: "/ambassadors/tayl.svg",
    linkedin: "https://www.linkedin.com/",
    embassyNumber: "EMB-005",
  },
  {
    id: "mats",
    name: "Mats",
    role: "Commercial Realist",
    city: "Brussels",
    country: "Belgium",
    perspective: "Optimism needs a test.",
    bio:
      "Mats translates enthusiasm into commercial tests. He is most useful when the story is compelling, the spreadsheet is optimistic, and nobody has asked what would make the decision fail.",
    image: "/ambassadors/mats.svg",
    linkedin: "https://www.linkedin.com/",
    embassyNumber: "EMB-006",
  },
  {
    id: "christophe",
    name: "Christophe",
    role: "Systems Witness",
    city: "Paris",
    country: "France",
    perspective: "Every decision enters a system.",
    bio:
      "Christophe works where strategy meets operations. He helps teams see which decision they are really making, which system will absorb it, and which consequence deserves a seat in the room.",
    image: "/ambassadors/christophe.svg",
    linkedin: "https://www.linkedin.com/",
    embassyNumber: "EMB-007",
  },
  {
    id: "jose-ricardo-monteiro",
    name: "José Ricardo Monteiro",
    role: "Cultural Reader",
    city: "Lisbon",
    country: "Portugal",
    perspective: "Culture before dashboards.",
    bio:
      "José Ricardo studies the distance between what organizations say and what people actually do. He brings cultural pattern recognition into rooms where numbers are loud but meaning is still missing.",
    image: "/ambassadors/jose-ricardo-monteiro.svg",
    linkedin: "https://www.linkedin.com/",
    embassyNumber: "EMB-008",
  },
];

export const featuredAmbassadors = ambassadors.slice(0, 4);
