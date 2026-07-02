import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";

export const metadata: Metadata = {
  title: "Dear Marjan — ctrl+love",
};

export default function MarjanPage() {
  return (
    <DocumentViewer
      src="/dear-marjan.png"
      alt="Dear Marjan"
      width={1024}
      height={1536}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
