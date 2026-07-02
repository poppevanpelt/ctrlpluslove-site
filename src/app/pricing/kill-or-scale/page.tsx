import type { Metadata } from "next";
import { DocumentViewer } from "../../document-viewer";

export const metadata: Metadata = {
  title: "Kill or Scale pricing — ctrl+love",
};

export default function KillOrScalePricingPage() {
  return (
    <DocumentViewer
      src="/pricing/kill-or-scale.png"
      alt="Kill or Scale pricing document"
      width={1536}
      height={1024}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
