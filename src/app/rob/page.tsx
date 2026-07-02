import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";

export const metadata: Metadata = {
  title: "Dear Rob — ctrl+love",
};

export default function RobPage() {
  return (
    <DocumentViewer
      src="/dear-rob.png"
      alt="Dear Rob"
      width={1024}
      height={1536}
      initialScale={1}
      initialX={0}
      initialY={0}
    />
  );
}
