import { embassies, getEmbassyById, type Embassy } from "./embassies";

export type ContentStatus = "published" | "draft" | "quiet";

export type RelatedContent = {
  slug: string;
  title: string;
  summary: string;
  status: ContentStatus;
  publishedAt?: string;
  relatedEmbassies?: string[];
  relatedSignals?: string[];
  participants?: string[];
};

export const signals: RelatedContent[] = [
  {
    slug: "global-mood-tokyo-focused",
    title: "Tokyo is holding focus",
    summary:
      "A mood signal connected to concentration, restraint and careful translation.",
    status: "published",
    publishedAt: "2026-07-18",
    relatedEmbassies: ["EMB-001"],
    participants: ["Shun Iwai"],
  },
  {
    slug: "embassy-trust-scales",
    title: "Ideas need words that carry",
    summary:
      "A network signal on how brand ideas become sharper when design and language are held together.",
    status: "published",
    publishedAt: "2026-07-18",
    relatedEmbassies: ["EMB-002"],
    participants: ["Marko Pasanen"],
  },
];

export const conversations: RelatedContent[] = [
  {
    slug: "embassy-network-opening",
    title: "Ideas don’t scale. Trusted people do.",
    summary:
      "The opening conversation for the Embassy Network and its permanent IDs.",
    status: "published",
    publishedAt: "2026-07-18",
    relatedEmbassies: ["EMB-001", "EMB-002"],
    participants: ["Shun Iwai", "Marko Pasanen"],
  },
];

const relationshipCollections = {
  signals,
  conversations,
};

export function resolveEmbassies(ids: string[] = []) {
  return ids.map(getEmbassyById).filter(Boolean) as Embassy[];
}

export function getRelatedContentForEmbassy(embassy: Embassy) {
  return {
    signals: relationshipCollections.signals.filter((signal) =>
      signal.relatedEmbassies?.includes(embassy.id),
    ),
    conversations: relationshipCollections.conversations.filter(
      (conversation) => conversation.relatedEmbassies?.includes(embassy.id),
    ),
    relatedEmbassies: embassies.filter(
      (candidate) => candidate.id !== embassy.id,
    ),
  };
}
