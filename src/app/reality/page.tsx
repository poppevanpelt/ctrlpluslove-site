import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department of Reality Preservation — ctrl+love",
};

export default function RealityPage() {
  return (
    <main className="document-page">
      {/* Plain img keeps the exported file:// preview self-contained. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="document-image"
        src="reality-poster.png"
        alt="Department of Reality Preservation"
        width={1792}
        height={1024}
      />
    </main>
  );
}
