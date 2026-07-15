import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";
import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/unfinished-thoughts/");

export default function UnfinishedThoughtsPage() {
  return (
    <DocumentViewer
      src="/unfinished-thoughts.webp"
      alt="Department of Unanswered Questions"
      width={1536}
      height={1024}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
