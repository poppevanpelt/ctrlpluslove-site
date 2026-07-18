export type EmbassyStatus = "active" | "forming" | "quiet";

export type Embassy = {
  id: string;
  city: string;
  country?: string;
  ambassador: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  portrait: string;
  cityImage?: string;
  quote?: string;
  localIntelligence?: string;
  status?: EmbassyStatus;
  timezone?: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt?: string;
  relatedSignals?: string[];
  relatedConversations?: string[];
};

export const embassies: Embassy[] = [
  {
    id: "EMB-001",
    slug: "tokyo",
    title: "Tokyo Embassy",
    city: "Tokyo",
    country: "Japan",
    ambassador: "Shun Iwai",
    coordinates: {
      latitude: 35.6764,
      longitude: 139.65,
    },
    portrait: "/ambassadors/portraits/003-shun-iwai-portrait-live-20260712.jpeg",
    quote: "Local intelligence begins where imported certainty stops.",
    localIntelligence:
      "Tokyo holds the question at a sharper distance: what travels, what must be translated, and what should remain quiet until trust has formed.",
    status: "active",
    timezone: "Asia/Tokyo",
    summary:
      "The Tokyo Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through Shun Iwai.",
    publishedAt: "2026-07-18",
    relatedSignals: ["global-mood-tokyo-focused"],
    relatedConversations: ["embassy-network-opening"],
  },
  {
    id: "EMB-002",
    slug: "stockholm",
    title: "Stockholm Embassy",
    city: "Stockholm",
    country: "Sweden",
    ambassador: "Mats Utberg",
    coordinates: {
      latitude: 59.3293,
      longitude: 18.0686,
    },
    portrait: "/ambassadors/portraits/005-mats-utberg-portrait-live-20260712.jpeg",
    quote: "Trust is not a distribution channel. It is the infrastructure.",
    localIntelligence:
      "Stockholm brings a northern editorial restraint to the network: clarity before theatre, usefulness before performance, and relationships before reach.",
    status: "active",
    timezone: "Europe/Stockholm",
    summary:
      "The Stockholm Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through Mats Utberg.",
    publishedAt: "2026-07-18",
    relatedSignals: ["embassy-trust-scales"],
    relatedConversations: ["embassy-network-opening"],
  },
];

export function getEmbassyBySlug(slug: string) {
  return embassies.find((embassy) => embassy.slug === slug);
}

export function getEmbassyById(id: string) {
  return embassies.find((embassy) => embassy.id === id);
}
