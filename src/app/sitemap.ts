import type { MetadataRoute } from "next";

import { ambassadorProfiles } from "./ambassador-profiles-data";
import { allRoomPersonas } from "./room-personas-data";
import { absoluteUrl, publicRoutes } from "./seo";
import { embassies } from "@/content/embassies";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-15");

  return [
    ...publicRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.changeFrequency ?? "monthly",
      priority: route.priority ?? 0.5,
    })),
    {
      url: absoluteUrl("/out-house/"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    },
    {
      url: absoluteUrl("/prompt-shoppe/"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...ambassadorProfiles.map((profile) => ({
      url: absoluteUrl(`/ambassadors/${profile.slug}/`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...embassies.map((embassy) => ({
      url: absoluteUrl(`/embassies/${embassy.slug}/`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
    ...allRoomPersonas.map((persona) => ({
      url: absoluteUrl(`/room/${persona.id}/`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
