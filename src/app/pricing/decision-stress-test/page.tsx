import type { Metadata } from "next";
import { DocumentViewer } from "../../document-viewer";
import { routeMetadata } from "../../seo";

export const metadata: Metadata = routeMetadata("/pricing/decision-stress-test/");

export default function DecisionStressTestPricingPage() {
  return (
    <DocumentViewer
      src="/pricing/decision-stress-test.webp"
      alt="Decision Stress-Test pricing document"
      width={1536}
      height={1024}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
