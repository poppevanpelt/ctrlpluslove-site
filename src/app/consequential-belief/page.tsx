import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";

export const metadata: Metadata = {
  title: "Department of Consequential Belief — ctrl+love",
};

export default function ConsequentialBeliefPage() {
  return (
    <DocumentViewer
      src="/department-consequential-belief.png"
      alt="Department of Consequential Belief — Mortgage the Heroes, Marvel, 2009"
      width={1149}
      height={1369}
      initialScale={2.1}
      initialX={0}
      initialY={0}
    />
  );
}
