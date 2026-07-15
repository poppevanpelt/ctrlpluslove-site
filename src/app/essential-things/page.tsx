import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";
import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/essential-things/");

export default function EssentialThingsPage() {
  return (
    <DocumentViewer
      src="/department-essential-things.webp"
      alt="Department of Essential Things — Remember the Brick, LEGO, 2004"
      width={1140}
      height={1380}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
