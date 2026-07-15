import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";
import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/consequential-belief/");

export default function ConsequentialBeliefPage() {
  return (
    <DocumentViewer
      src="/department-consequential-belief.webp"
      alt="Department of Consequential Belief — Mortgage the Heroes, Marvel, 2009"
      width={1149}
      height={1369}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
