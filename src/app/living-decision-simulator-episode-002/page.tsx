import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  path: "/living-decision-review/",
  title: "Live Decision Simulator — ctrl+love",
  description: "A decision room that thinks in public.",
  robots: {
    index: false,
    follow: true,
  },
});

export { default } from "../living-decision-review/page";
