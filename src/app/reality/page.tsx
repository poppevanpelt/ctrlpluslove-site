import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";

export const metadata: Metadata = {
  title: "Department of Reality Preservation — ctrl+love",
};

export default function RealityPage() {
  return (
    <DocumentViewer
      src="/reality-poster.png"
      alt="Department of Reality Preservation"
      width={1672}
      height={941}
      initialScale={2.15}
      initialX={58}
      initialY={30}
    />
  );
}
