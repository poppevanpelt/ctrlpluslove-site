import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";
import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/irreversible-decisions/");

export default function IrreversibleDecisionsPage() {
  return (
    <DocumentViewer
      src="/department-irreversible-decisions.webp"
      alt="Department of Irreversible Decisions — Burn the Boats, Netflix, 2007"
      width={1158}
      height={1359}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
