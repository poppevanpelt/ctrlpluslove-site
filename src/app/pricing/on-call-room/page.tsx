import type { Metadata } from "next";
import { DocumentViewer } from "../../document-viewer";
import { routeMetadata } from "../../seo";

export const metadata: Metadata = routeMetadata("/pricing/on-call-room/");

export default function OnCallRoomPricingPage() {
  return (
    <DocumentViewer
      src="/pricing/on-call-room.webp"
      alt="On-Call Room pricing document"
      width={1536}
      height={1024}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
