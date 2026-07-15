import { ambassadors } from "./ambassadors-data";

export type AmbassadorProfile = {
  slug: string;
  name: string;
  city: string;
  country: string;
  role: string;
  origin: string;
  specialty: string;
  perspective: string;
  biography: string[];
  quote: string;
  notices: string[];
  image?: string;
  imageAlt: string;
  linkedin?: string;
  previousAmbassador?: string;
  nextAmbassador?: string;
};

const ambassadorById = new Map(
  ambassadors.map((ambassador) => [ambassador.id, ambassador]),
);

export const ambassadorProfiles: AmbassadorProfile[] = [
  {
    slug: "poppe-van-pelt",
    name: "Poppe van Pelt",
    city: "Haarlem",
    country: "Netherlands",
    role: "Founder",
    origin: "Haarlem, Netherlands",
    specialty: "Consequence-aware creative direction",
    perspective:
      "Poppe notices when confidence is moving faster than evidence, and when a room has started protecting the answer instead of testing it.",
    biography: [
      "Poppe van Pelt is an ADCN Hall of Fame creative director and the founder of ctrl+love.",
      "He began his career at TBWA before co-founding Selmore, which he helped build into one of the Netherlands’ leading independent creative agencies. Over the course of his career, Poppe has worked with ambitious international brands and served as Lead Creative Director for Apple in the Netherlands and Belgium.",
      "At ctrl+love, he brings together an international network of experienced creative and strategic leaders. They help organisations challenge assumptions, expose blind spots and make sharper decisions before reality makes them expensive.",
      "After more than 30 years in advertising, Poppe remains driven by the same belief: technology changes, markets change and organisations change—but a powerful idea still begins with understanding people.",
    ],
    quote:
      "A good room does not make the decision comfortable. It makes it visible.",
    notices: [
      "Where the story is doing more work than the product.",
      "Which assumption everyone is politely protecting.",
      "The moment a decision starts pretending it is already true.",
    ],
    image: ambassadorById.get("poppe-van-pelt")?.image,
    imageAlt: "Portrait of Poppe van Pelt, founder of ctrl+love",
    linkedin: ambassadorById.get("poppe-van-pelt")?.linkedin,
    previousAmbassador: "flip",
    nextAmbassador: "flip",
  },
  {
    slug: "flip",
    name: "Flip",
    city: "Stateless",
    country: "Everywhere",
    role: "Flight Controller",
    origin: "Stateless",
    specialty: "Bird's-eye view",
    perspective:
      "Flip sees the room from above. He notices patterns, repetition and movement before people inside the discussion do.",
    biography: [
      "Parrots are natural mimics. Flip can temporarily represent anyone missing from the room. His value is the instant role-switch: a quick change of angle before the room mistakes one perspective for the whole truth.",
    ],
    quote: "Welcome, Flip. Take a nut. Make us uncomfortable.",
    notices: [
      "Repetition in the room before it becomes a pattern.",
      "The absent person everyone is speaking for.",
      "When one perspective needs to flip into another quickly.",
    ],
    image: ambassadorById.get("flip")?.image,
    imageAlt: "Portrait of Flip, ctrl+love flight controller",
    previousAmbassador: "poppe-van-pelt",
    nextAmbassador: "poppe-van-pelt",
  },
];

export function getAmbassadorProfile(slug: string) {
  return ambassadorProfiles.find((profile) => profile.slug === slug);
}
