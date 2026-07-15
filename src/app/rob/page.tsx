import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";
import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/rob/");

export default function RobPage() {
  return (
    <DocumentViewer
      src="/dear-rob.webp"
      alt="Dear Rob"
      width={1024}
      height={1536}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
