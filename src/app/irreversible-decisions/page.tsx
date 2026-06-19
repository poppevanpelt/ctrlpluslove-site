import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";

export const metadata: Metadata = {
  title: "Department of Irreversible Decisions — ctrl+love",
};

export default function IrreversibleDecisionsPage() {
  return (
    <DocumentViewer
      src="/department-irreversible-decisions.png"
      alt="Department of Irreversible Decisions — Burn the Boats, Netflix, 2007"
      width={1158}
      height={1359}
      initialScale={2.1}
      initialX={0}
      initialY={0}
    />
  );
}
