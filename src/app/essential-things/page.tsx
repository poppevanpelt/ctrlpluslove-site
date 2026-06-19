import type { Metadata } from "next";
import { DocumentViewer } from "../document-viewer";

export const metadata: Metadata = {
  title: "Department of Essential Things — ctrl+love",
};

export default function EssentialThingsPage() {
  return (
    <DocumentViewer
      src="/department-essential-things.png"
      alt="Department of Essential Things — Remember the Brick, LEGO, 2004"
      width={1140}
      height={1380}
      initialScale={2.1}
      initialX={0}
      initialY={0}
    />
  );
}
