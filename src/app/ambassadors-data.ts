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
  status: "confirmed" | "pending";
};

export const ambassadors: Ambassador[] = [
  {
    id: "poppe-van-pelt",
    name: "Poppe van Pelt",
    role: "Role pending confirmation",
    city: "",
    country: "Netherlands",
    perspective: "Perspective pending confirmation.",
    bio: "Biography pending confirmation.",
    image: "/ambassadors/poppe-van-pelt.svg",
    linkedin: "",
    embassyNumber: "EMB-001",
    status: "confirmed",
  },
  {
    id: "nadia",
    name: "Nadia",
    role: "Role pending confirmation",
    city: "",
    country: "Germany",
    perspective: "Perspective pending confirmation.",
    bio: "Biography pending confirmation.",
    image: "/ambassadors/nadia.svg",
    linkedin: "",
    embassyNumber: "EMB-002",
    status: "confirmed",
  },
  {
    id: "shun",
    name: "Shun",
    role: "Role pending confirmation",
    city: "",
    country: "Japan",
    perspective: "Perspective pending confirmation.",
    bio: "Biography pending confirmation.",
    image: "/ambassadors/shun.svg",
    linkedin: "",
    embassyNumber: "EMB-003",
    status: "confirmed",
  },
  {
    id: "jorge",
    name: "Jorge",
    role: "Role pending confirmation",
    city: "",
    country: "Brazil",
    perspective: "Perspective pending confirmation.",
    bio: "Biography pending confirmation.",
    image: "/ambassadors/jorge.svg",
    linkedin: "",
    embassyNumber: "EMB-004",
    status: "confirmed",
  },
  {
    id: "tayl",
    name: "Tayl",
    role: "Role pending confirmation",
    city: "",
    country: "China",
    perspective: "Perspective pending confirmation.",
    bio: "Biography pending confirmation.",
    image: "/ambassadors/tayl.svg",
    linkedin: "",
    embassyNumber: "EMB-005",
    status: "confirmed",
  },
  {
    id: "mats",
    name: "Mats",
    role: "Role pending confirmation",
    city: "",
    country: "Belgium",
    perspective: "Perspective pending confirmation.",
    bio: "Biography pending confirmation.",
    image: "/ambassadors/mats.svg",
    linkedin: "",
    embassyNumber: "EMB-006",
    status: "confirmed",
  },
  {
    id: "christophe",
    name: "Christophe",
    role: "Role pending confirmation",
    city: "",
    country: "France",
    perspective: "Perspective pending confirmation.",
    bio: "Biography pending confirmation.",
    image: "/ambassadors/christophe.svg",
    linkedin: "",
    embassyNumber: "EMB-007",
    status: "confirmed",
  },
  {
    id: "jose-ricardo-monteiro",
    name: "José Ricardo Monteiro",
    role: "Role pending confirmation",
    city: "",
    country: "Portugal",
    perspective: "Perspective pending confirmation.",
    bio: "Biography pending confirmation.",
    image: "/ambassadors/jose-ricardo-monteiro.svg",
    linkedin: "",
    embassyNumber: "EMB-008",
    status: "confirmed",
  },
];

export const confirmedAmbassadors = ambassadors.filter(
  (ambassador) => ambassador.status === "confirmed",
);

export const featuredAmbassadors = confirmedAmbassadors.slice(0, 4);
