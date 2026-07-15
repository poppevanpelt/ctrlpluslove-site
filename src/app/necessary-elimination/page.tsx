import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";
import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/necessary-elimination/");

export default function NecessaryEliminationPage() {
  return (
    <DocumentViewer
      src="/department-necessary-elimination.webp"
      alt="Department of Necessary Elimination — Kill Almost Everything, Apple, 1997"
      width={1024}
      height={1536}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
