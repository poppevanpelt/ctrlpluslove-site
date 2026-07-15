import type { Metadata } from "next";
import { DocumentViewer } from "../../document-viewer";
import { routeMetadata } from "../../seo";

export const metadata: Metadata = routeMetadata("/pricing/kill-or-scale/");

export default function KillOrScalePricingPage() {
  return (
    <DocumentViewer
      src="/pricing/kill-or-scale.webp"
      alt="Kill or Scale pricing document"
      width={1536}
      height={1024}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
