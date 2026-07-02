import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";

export const metadata: Metadata = {
  title: "Department of Unanswered Questions — ctrl+love",
};

export default function UnfinishedThoughtsPage() {
  return (
    <DocumentViewer
      src="/unfinished-thoughts.png"
      alt="Department of Unanswered Questions"
      width={1536}
      height={1024}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
