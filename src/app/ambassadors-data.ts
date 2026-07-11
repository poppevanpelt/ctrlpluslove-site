export type AmbassadorStatus = "founder" | "ambassador";

export type Ambassador = {
  id: string;
  number: string;
  name: string;
  preferredName?: string;
  role: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  status: AmbassadorStatus;
  participationLabel: string;
  image?: string;
  linkedin?: string;
  website?: string;
  roomHref: string;
  featured?: boolean;
  public: boolean;
};

export const ambassadors: Ambassador[] = [
  {
    id: "poppe-van-pelt",
    number: "001",
    name: "Poppe van Pelt",
    role: "Netherlands / Haarlem",
    city: "Haarlem",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    status: "founder",
    participationLabel: "Founder",
    image: "/ambassadors/portraits/001-poppe-van-pelt.png",
    linkedin: "https://nl.linkedin.com/in/poppevanpelt",
    roomHref: "/#room",
    featured: true,
    public: true,
  },
  {
    id: "nadia-al-mardini",
    number: "002",
    name: "Nadia Al-Mardini",
    role: "Germany / Berlin",
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    status: "ambassador",
    participationLabel: "Ambassador",
    image: "/ambassadors/portraits/002-nadia-al-mardini.png",
    roomHref: "/#room",
    featured: true,
    public: true,
  },
  {
    id: "shun-iwai",
    number: "003",
    name: "Shun Iwai",
    role: "Japan / Tokyo",
    city: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    status: "ambassador",
    participationLabel: "Ambassador",
    image: "/ambassadors/portraits/003-shun-iwai.png",
    roomHref: "/#room",
    featured: true,
    public: true,
  },
  {
    id: "sung-wook-tayl-chung",
    number: "004",
    name: "Sung Wook \"Tayl\" Chung",
    preferredName: "Tayl",
    role: "South Korea / Seoul",
    city: "Seoul",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    status: "ambassador",
    participationLabel: "Ambassador",
    image: "/ambassadors/portraits/004-sung-wook-tay-chung.png",
    roomHref: "/#room",
    featured: true,
    public: true,
  },
  {
    id: "mats-utberg",
    number: "005",
    name: "Mats Utberg",
    role: "Sweden / Stockholm",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
    status: "ambassador",
    participationLabel: "Ambassador",
    image: "/ambassadors/portraits/005-mats-utberg.png",
    roomHref: "/#room",
    public: true,
  },
  {
    id: "jorge-virgos",
    number: "006",
    name: "Jorge Virgós",
    role: "Spain / Valencia",
    city: "Valencia",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    status: "ambassador",
    participationLabel: "Ambassador",
    image: "/ambassadors/portraits/006-jorge-virgos.png",
    roomHref: "/#room",
    public: true,
  },
  {
    id: "jose-ricardo-monteiro",
    number: "007",
    name: "José Ricardo Monteiro (JR)",
    role: "Portugal / Lisbon",
    city: "Lisbon",
    country: "Portugal",
    countryCode: "PT",
    flag: "🇵🇹",
    status: "ambassador",
    participationLabel: "Ambassador",
    image: "/ambassadors/portraits/007-jose-ricardo-monteiro-jr.png",
    roomHref: "/#room",
    public: true,
  },
  {
    id: "christophe-pernaudet",
    number: "008",
    name: "Christophe Pernaudet",
    role: "France / Paris",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    status: "ambassador",
    participationLabel: "Ambassador",
    image: "/ambassadors/portraits/008-christophe-color.png",
    roomHref: "/#room",
    public: true,
  },
  {
    id: "umberto-bartolini",
    number: "009",
    name: "Umberto Bartolini",
    role: "Italy / Milan and Rome",
    city: "Milan / Rome",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    status: "ambassador",
    participationLabel: "Ambassador",
    image: "/ambassadors/portraits/009-umberto-bartolini.png",
    roomHref: "/#room",
    public: true,
  },
];

export const confirmedAmbassadors = ambassadors.filter(
  (ambassador) => ambassador.public,
);

export const featuredAmbassadors = confirmedAmbassadors.filter(
  (ambassador) => ambassador.featured,
);

export const ambassadorMetrics = [
  ["People", String(confirmedAmbassadors.length)],
  [
    "Countries",
    String(new Set(confirmedAmbassadors.map((ambassador) => ambassador.country)).size),
  ],
  ["Cities", "10"],
  [
    "Founders",
    String(
      confirmedAmbassadors.filter((ambassador) => ambassador.status === "founder")
        .length,
    ),
  ],
] as const;
