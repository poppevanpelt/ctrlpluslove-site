import type { Metadata } from "next";

export const SITE_URL = "https://www.ctrlpluslove.com";

export type PublicRoute = {
  path: string;
  title: string;
  description: string;
  changeFrequency?: "weekly" | "monthly" | "yearly";
  priority?: number;
};

export function canonicalPath(path: string) {
  if (path === "/") {
    return "/";
  }

  return path.endsWith("/") ? path : `${path}/`;
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${canonicalPath(path)}`;
}

export function createPageMetadata({
  path,
  title,
  description,
  image = "/ctrl-love-logo-gradient-master.png",
  imageAlt = "ctrl+love",
  type = "website",
  robots,
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  robots?: Metadata["robots"];
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots,
    openGraph: {
      title,
      description,
      url,
      siteName: "ctrl+love",
      locale: "en_US",
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const publicRoutes: PublicRoute[] = [
  {
    path: "/",
    title: "ctrl+love — Instruments for human judgment",
    description:
      "ctrl+love is a small experimental institution for human judgment. We build and field-test instruments that expose weak evidence, hidden assumptions, missing voices and the things decisions smooth over.",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/organic-ai/",
    title: "Organic AI — what the machine believes about your brand | ctrl+love",
    description:
      "Organic AI is what the machine believes about you before you pay to enter the conversation. ctrl+love maps Organic AI presence, prominence, portrayal, persuasion and AI reputation.",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/instruments/",
    title: "Instrument Cabinet — ctrl+love",
    description:
      "A cabinet of working ctrl+love instruments for seeing, testing, deciding and moving.",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/brand-survival/",
    title: "Brand Survival — ctrl+love",
    description:
      "A subtraction instrument that shows what remains distinctive when a brand's obvious identifiers are systematically removed.",
    changeFrequency: "monthly",
    priority: 0.82,
  },
  {
    path: "/stress-test/",
    title: "Decision Stress-Test™ — ctrl+love",
    description:
      "Bring one live creative decision into the ctrl+love Room. Leave with less fog.",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/room/",
    title: "The Room — ctrl+love",
    description:
      "The decision-making lenses invited before a choice hardens.",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/radar/",
    title: "Radar — ctrl+love",
    description:
      "The human-facing sensing layer of ctrl+love: observations, contradictions and weak signals before they become questions.",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/pricing/",
    title: "Rooms and pricing — ctrl+love",
    description: "Pricing is simple. But the Room should fit the question.",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/pricing/decision-stress-test/",
    title: "Decision Stress-Test pricing — ctrl+love",
    description:
      "Pricing details for the ctrl+love Decision Stress-Test room.",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/pricing/on-call-room/",
    title: "On-Call Room pricing — ctrl+love",
    description: "Pricing details for keeping ctrl+love on call for live decisions.",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/pricing/kill-or-scale/",
    title: "Kill or Scale pricing — ctrl+love",
    description:
      "Pricing details for testing whether an idea deserves to be killed or scaled.",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/ambassadors/",
    title: "Around the Table — ctrl+love",
    description: "The distributed human network behind ctrl+love decisions.",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/embassies/",
    title: "Embassy Network — ctrl+love",
    description:
      "A growing group of trusted creative leaders bringing local intelligence into the ctrl+love ecosystem.",
    changeFrequency: "monthly",
    priority: 0.82,
  },
  {
    path: "/steel-ball/",
    title: "The Steel Ball — ctrl+love",
    description:
      "A small physical instrument for noticing movement, instability and the things the room would rather smooth over.",
    changeFrequency: "monthly",
    priority: 0.72,
  },
];

export function routeMetadata(path: string): Metadata {
  const route = publicRoutes.find((item) => item.path === canonicalPath(path));

  if (!route) {
    return {};
  }

  return createPageMetadata(route);
}
