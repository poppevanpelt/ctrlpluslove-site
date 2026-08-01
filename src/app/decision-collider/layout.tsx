import type { Metadata } from "next";

import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  path: "/decision-collider/",
  title: "Decision Collider — ctrl+love",
  description:
    "An interactive ctrl+love instrument for pushing one decision through observation, framing, collision, detection, and human judgment.",
});

export default function DecisionColliderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
