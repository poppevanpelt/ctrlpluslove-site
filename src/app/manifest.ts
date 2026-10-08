import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/savannah/",
    name: "SavannahOS",
    short_name: "Savannah",
    description: "Savannah. The ctrl+love voice in your pocket.",
    start_url: "/savannah/",
    scope: "/savannah/",
    display: "standalone",
    background_color: "#f1eee6",
    theme_color: "#141414",
    orientation: "portrait",
    icons: [
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }
    ]
  };
}
