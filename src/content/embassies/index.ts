export type EmbassyStatus = "active" | "forming" | "quiet";
export type EmbassyNetworkStatus =
  | "ESTABLISHED"
  | "ACTIVE"
  | "OPENING SOON"
  | "SIGNAL DETECTED";

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
  networkStatus?: EmbassyNetworkStatus;
  yearEstablished?: string;
  currentFocus?: string;
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
    networkStatus: "ESTABLISHED",
    yearEstablished: "2026",
    currentFocus: "Translating creative intelligence without flattening its signal.",
    timezone: "Asia/Tokyo",
    summary:
      "The Tokyo Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through Shun Iwai.",
    publishedAt: "2026-07-18",
    relatedSignals: ["global-mood-tokyo-focused"],
    relatedConversations: ["embassy-network-opening"],
  },
  {
    id: "EMB-002",
    slug: "helsinki",
    title: "Helsinki Embassy",
    city: "Helsinki",
    country: "Finland",
    ambassador: "Marko Pasanen",
    coordinates: {
      latitude: 60.1699,
      longitude: 24.9384,
    },
    portrait: "/embassies/portraits/002-marko-pasanen.png",
    quote: "Ideas shape brands. Words bring them to life.",
    localIntelligence:
      "Marko Pasanen brings senior brand design and copywriting judgment to the network through Brandscape.",
    status: "active",
    networkStatus: "ACTIVE",
    yearEstablished: "2026",
    currentFocus: "Senior Brand Designer & Copywriter. Brandscape. By appointment only.",
    timezone: "Europe/Helsinki",
    summary:
      "The Helsinki Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through Marko Pasanen.",
    publishedAt: "2026-07-18",
    relatedSignals: ["embassy-trust-scales"],
    relatedConversations: ["embassy-network-opening"],
  },
  {
    id: "EMB-004",
    slug: "seoul",
    title: "Seoul Embassy",
    city: "Seoul",
    country: "South Korea",
    ambassador: "Sung Wook Tayl Chung",
    coordinates: {
      latitude: 37.5665,
      longitude: 126.978,
    },
    portrait: "/ambassadors/portraits/004-sung-wook-tayl-chung-portrait-live-20260712.jpeg",
    quote: "A local signal is strongest before it becomes obvious from far away.",
    localIntelligence:
      "Tayl Chung brings Seoul perspective and cultural timing into the Embassy Network.",
    status: "active",
    networkStatus: "ACTIVE",
    yearEstablished: "2026",
    currentFocus: "Korean market perspective and cultural timing.",
    timezone: "Asia/Seoul",
    summary:
      "The Seoul Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through Tayl Chung.",
    publishedAt: "2026-07-30",
  },
  {
    id: "EMB-006",
    slug: "valencia",
    title: "Valencia Embassy",
    city: "Valencia",
    country: "Spain",
    ambassador: "Jorge Virgós",
    coordinates: {
      latitude: 39.4699,
      longitude: -0.3763,
    },
    portrait: "/ambassadors/portraits/006-jorge-virgos-portrait-live-20260712.jpeg",
    quote: "The local angle is often where the sharper question lives.",
    localIntelligence:
      "Jorge Virgós brings Spanish market perspective and local creative judgment into the Embassy Network.",
    status: "active",
    networkStatus: "ACTIVE",
    yearEstablished: "2026",
    currentFocus: "Spanish market perspective and local creative judgment.",
    timezone: "Europe/Madrid",
    summary:
      "The Valencia Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through Jorge Virgós.",
    publishedAt: "2026-07-30",
  },
  {
    id: "EMB-007",
    slug: "lisbon",
    title: "Lisbon Embassy",
    city: "Lisbon",
    country: "Portugal",
    ambassador: "José Ricardo Monteiro",
    coordinates: {
      latitude: 38.7223,
      longitude: -9.1393,
    },
    portrait: "/ambassadors/portraits/007-jose-ricardo-monteiro-jr-portrait-live-20260712.jpeg",
    quote: "Good translation keeps the original intention alive in another place.",
    localIntelligence:
      "José Ricardo Monteiro brings Portuguese market perspective and cultural nuance into the Embassy Network.",
    status: "active",
    networkStatus: "ACTIVE",
    yearEstablished: "2026",
    currentFocus: "Portuguese market perspective and cultural nuance.",
    timezone: "Europe/Lisbon",
    summary:
      "The Lisbon Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through José Ricardo Monteiro.",
    publishedAt: "2026-07-30",
  },
  {
    id: "EMB-009",
    slug: "prague",
    title: "Prague Embassy",
    city: "Prague",
    country: "Czech Republic",
    ambassador: "Jan Houdek",
    coordinates: {
      latitude: 50.0755,
      longitude: 14.4378,
    },
    portrait: "/embassies/portraits/009-jan-houdek.png",
    quote: "Helping brands grow. Building digital ecosystems that perform.",
    localIntelligence:
      "Jan Houdek brings entrepreneurial judgment and digital ecosystem intelligence to the network.",
    status: "active",
    networkStatus: "ACTIVE",
    yearEstablished: "2026",
    currentFocus: "Entrepreneur. Digital Ecosystems & Born Organic Content. By appointment only.",
    timezone: "Europe/Prague",
    summary:
      "The Prague Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through Jan Houdek.",
    publishedAt: "2026-07-30",
  },
  {
    id: "EMB-010",
    slug: "wroclaw",
    title: "Wrocław Embassy",
    city: "Wrocław",
    country: "Poland",
    ambassador: "Piotr Klimowicz",
    coordinates: {
      latitude: 51.1079,
      longitude: 17.0385,
    },
    portrait: "/embassies/portraits/010-piotr-klimowicz.png",
    quote: "Making global brands feel local in Poland.",
    localIntelligence:
      "Piotr Klimowicz brings copywriting, cultural strategy, transcreation, localization, linguistic QA and brand communication to the network.",
    status: "active",
    networkStatus: "ACTIVE",
    yearEstablished: "2026",
    currentFocus: "Copywriter & Cultural Strategist. By appointment only.",
    timezone: "Europe/Warsaw",
    summary:
      "The Wrocław Embassy brings local intelligence and human judgment into the ctrl+love ecosystem through Piotr Klimowicz.",
    publishedAt: "2026-07-30",
  },
];

export function getEmbassyBySlug(slug: string) {
  return embassies.find((embassy) => embassy.slug === slug);
}

export function getEmbassyById(id: string) {
  return embassies.find((embassy) => embassy.id === id);
}

export type EmbassyMapLocation = {
  id: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: EmbassyNetworkStatus;
  yearEstablished: string;
  currentFocus: string;
  kind: "active" | "ghost";
  ambassador?: string;
  slug?: string;
};

const futureEmbassySignals: EmbassyMapLocation[] = [
  {
    id: "SIG-AMS",
    city: "Amsterdam",
    country: "Netherlands",
    coordinates: {
      latitude: 52.3676,
      longitude: 4.9041,
    },
    status: "OPENING SOON",
    yearEstablished: "2027",
    currentFocus: "A founding signal is being formalized through local proximity.",
    kind: "ghost",
  },
  {
    id: "SIG-SFO",
    city: "San Francisco",
    country: "United States",
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    status: "SIGNAL DETECTED",
    yearEstablished: "Prospective",
    currentFocus: "West Coast creative intelligence is being watched with care.",
    kind: "ghost",
  },
  {
    id: "SIG-SHA",
    city: "Shanghai",
    country: "China",
    coordinates: {
      latitude: 31.2304,
      longitude: 121.4737,
    },
    status: "SIGNAL DETECTED",
    yearEstablished: "Prospective",
    currentFocus: "A future local bridge is forming around pace, commerce and culture.",
    kind: "ghost",
  },
  {
    id: "SIG-MIL",
    city: "Milan",
    country: "Italy",
    coordinates: {
      latitude: 45.4642,
      longitude: 9.19,
    },
    status: "SIGNAL DETECTED",
    yearEstablished: "Prospective",
    currentFocus: "Market meaning is beginning to echo back.",
    kind: "ghost",
  },
  {
    id: "SIG-SAO",
    city: "Sao Paulo",
    country: "Brazil",
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
    status: "SIGNAL DETECTED",
    yearEstablished: "Prospective",
    currentFocus: "Distance is behaving less like distance.",
    kind: "ghost",
  },
];

export const embassyMapLocations: EmbassyMapLocation[] = [
  ...embassies.map((embassy) => ({
    id: embassy.id,
    city: embassy.city,
    country: embassy.country ?? "",
    coordinates: embassy.coordinates ?? {
      latitude: 0,
      longitude: 0,
    },
    status: embassy.networkStatus ?? "ACTIVE",
    yearEstablished: embassy.yearEstablished ?? "2026",
    currentFocus:
      embassy.currentFocus ??
      "Local intelligence is helping ideas arrive with human judgment.",
    kind: "active" as const,
    ambassador: embassy.ambassador,
    slug: embassy.slug,
  })),
  ...futureEmbassySignals,
];
