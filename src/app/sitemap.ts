import type { MetadataRoute } from "next";

import { ambassadorProfiles } from "./ambassador-profiles-data";
import { allRoomPersonas } from "./room-personas-data";
import { absoluteUrl, publicRoutes } from "./seo";
import { swatMissions } from "./swat/missions-data";
import { embassies } from "@/content/embassies";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-15");
  const homeLastModified = new Date("2026-09-19");
  const swatLastModified = new Date("2026-09-15");

  return [
    ...publicRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: route.path === "/" ? homeLastModified : lastModified,
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
    {
      url: absoluteUrl("/five-guys-signal/"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.78,
    },
    {
      url: absoluteUrl("/swat/"),
      lastModified: swatLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.82,
    },
    ...swatMissions.map((mission) => ({
      url: absoluteUrl(`/swat/missions/${mission.slug}/`),
      lastModified: swatLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.74,
    })),
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
