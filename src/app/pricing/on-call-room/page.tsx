import type { Metadata } from "next";
import { DocumentViewer } from "../../document-viewer";

export const metadata: Metadata = {
  title: "On-Call Room pricing — ctrl+love",
};

export default function OnCallRoomPricingPage() {
  return (
    <DocumentViewer
      src="/pricing/on-call-room.png"
      alt="On-Call Room pricing document"
      width={1536}
      height={1024}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
