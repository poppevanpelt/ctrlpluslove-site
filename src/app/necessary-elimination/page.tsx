import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";

export const metadata: Metadata = {
  title: "Department of Necessary Elimination — ctrl+love",
};

export default function NecessaryEliminationPage() {
  return (
    <DocumentViewer
      src="/department-necessary-elimination.png"
      alt="Department of Necessary Elimination — Kill Almost Everything, Apple, 1997"
      width={1024}
      height={1536}
      initialScale={2.1}
      initialX={0}
      initialY={0}
    />
  );
}
