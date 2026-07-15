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
    title: "ctrl+love — Shortcut to reality",
    description:
      "A decision company for moments when the real question matters more than another answer.",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/stress-test/",
    title: "Decision Stress-Test™ — ctrl+love",
    description:
      "Bring one live creative decision into the ctrl+love room. Leave with less fog.",
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
    path: "/room-runner/",
    title: "Room Runner — ctrl+love",
    description:
      "An internal ctrl+love prototype for turning decision questions into visible discussion lineage.",
    changeFrequency: "monthly",
    priority: 0.25,
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
    description: "Pricing is simple. But the room should fit the question.",
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
    path: "/steel-ball/",
    title: "The Steel Ball — ctrl+love",
    description:
      "The original replica. A physical reminder to test confidence before reality does.",
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    path: "/museum/",
    title: "Museum Shop — ctrl+love",
    description: "Ideas. Artifacts. Consequences. Objects from the ctrl+love archive.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/artifacts/",
    title: "The Artifact Registry — ctrl+love",
    description: "A registry of ctrl+love objects, consequences and decision folklore.",
    changeFrequency: "monthly",
    priority: 0.65,
  },
  {
    path: "/ai-y-fier/",
    title: "AI-y-fier — ctrl+love",
    description: "Empty thoughts in. Thought leadership out.",
    changeFrequency: "monthly",
    priority: 0.65,
  },
  {
    path: "/meeting-filter/",
    title: "The Meeting Filter — ctrl+love",
    description: "A ctrl+love filter for deciding whether the meeting should exist.",
    changeFrequency: "monthly",
    priority: 0.65,
  },
  {
    path: "/inside-ctrl-love/",
    title: "Inside ctrl+love — ctrl+love",
    description: "Tools, departments and artifacts from the ctrl+love engine.",
    changeFrequency: "monthly",
    priority: 0.55,
  },
  {
    path: "/constitution/",
    title: "ctrl+love constitution",
    description: "Download the ctrl+love constitution archive.",
    changeFrequency: "yearly",
    priority: 0.45,
  },
  {
    path: "/living-decision-review/",
    title: "Live Decision Simulator — ctrl+love",
    description: "A decision room that thinks in public.",
    changeFrequency: "yearly",
    priority: 0.45,
  },
  {
    path: "/reality/",
    title: "Department of Reality Preservation — ctrl+love",
    description: "A ctrl+love department document for preserving contact with reality.",
    changeFrequency: "yearly",
    priority: 0.35,
  },
  {
    path: "/unfinished-thoughts/",
    title: "Department of Unanswered Questions — ctrl+love",
    description: "A ctrl+love department document for questions that refuse to close.",
    changeFrequency: "yearly",
    priority: 0.35,
  },
  {
    path: "/necessary-elimination/",
    title: "Department of Necessary Elimination — ctrl+love",
    description: "A ctrl+love department document about removing what weakens the decision.",
    changeFrequency: "yearly",
    priority: 0.35,
  },
  {
    path: "/irreversible-decisions/",
    title: "Department of Irreversible Decisions — ctrl+love",
    description: "A ctrl+love department document about decisions that cannot be walked back.",
    changeFrequency: "yearly",
    priority: 0.35,
  },
  {
    path: "/essential-things/",
    title: "Department of Essential Things — ctrl+love",
    description: "A ctrl+love department document about protecting the thing that matters.",
    changeFrequency: "yearly",
    priority: 0.35,
  },
  {
    path: "/consequential-belief/",
    title: "Department of Consequential Belief — ctrl+love",
    description: "A ctrl+love department document about belief with consequences attached.",
    changeFrequency: "yearly",
    priority: 0.35,
  },
  {
    path: "/rob/",
    title: "Dear Rob — ctrl+love",
    description: "A ctrl+love document from the archive.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    path: "/marjan/",
    title: "Dear Marjan — ctrl+love",
    description: "A ctrl+love document from the archive.",
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export function routeMetadata(path: string) {
  const route = publicRoutes.find((entry) => canonicalPath(entry.path) === canonicalPath(path));

  if (!route) {
    throw new Error(`Missing public route metadata for ${path}`);
  }

  return createPageMetadata(route);
}
