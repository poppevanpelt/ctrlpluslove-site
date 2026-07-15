import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";
import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/reality/");

export default function RealityPage() {
  return (
    <DocumentViewer
      src="/reality-poster.webp"
      alt="Department of Reality Preservation"
      width={1672}
      height={941}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
