import type { MetadataRoute } from "next";

import { allRoomPersonas } from "./room-personas-data";
import { absoluteUrl, publicRoutes } from "./seo";
import { swatMissions } from "./swat/missions-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-15");
  const homeLastModified = new Date("2026-09-19");
  const swatLastModified = new Date("2026-09-15");
  const twoGoLastModified = new Date("2026-09-20");

  return [
    {
      url: absoluteUrl("/dispatches/"),
      lastModified: new Date("2026-11-07"),
      changeFrequency: "weekly" as const,
      priority: 0.82,
    },
    ...publicRoutes.filter(route => !["/ambassadors/", "/embassies/"].includes(route.path)).map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: route.path === "/" ? homeLastModified : lastModified,
      changeFrequency: route.changeFrequency ?? "monthly",
      priority: route.priority ?? 0.5,
    })),
    {
      url: absoluteUrl("/2go/"),
      lastModified: twoGoLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.88,
    },
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
    ...allRoomPersonas.map((persona) => ({
      url: absoluteUrl(`/room/${persona.id}/`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
