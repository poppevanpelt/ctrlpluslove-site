import type { MetadataRoute } from "next";

import { SITE_URL } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/pricing-documents/",
        "/living-decision-simulator-episode-002/",
        "/tools/",
        "/src/",
        "/private-room/",
        "/savannah-room/",
        "/savannah-test/",
        "/ted-test/",
        "/bridgefund-ted/",
        "/morning-chris/",
        "/ted-talks/",
        "/bonkers/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
