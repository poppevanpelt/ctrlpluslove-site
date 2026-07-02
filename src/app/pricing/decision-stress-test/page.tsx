import type { Metadata } from "next";
import { DocumentViewer } from "../../document-viewer";

export const metadata: Metadata = {
  title: "Decision Stress-Test pricing — ctrl+love",
};

export default function DecisionStressTestPricingPage() {
  return (
    <DocumentViewer
      src="/pricing/decision-stress-test.png"
      alt="Decision Stress-Test pricing document"
      width={1536}
      height={1024}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
