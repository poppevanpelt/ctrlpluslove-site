import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  path: "/pricing/",
  title: "Rooms and pricing — ctrl+love",
  description: "Pricing is simple. But the Room should fit the question.",
  robots: {
    index: false,
    follow: true,
  },
});

export { default } from "../pricing/page";
