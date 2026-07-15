import type { Metadata } from "next";

import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/living-decision-review/");

export default function LivingDecisionReviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
