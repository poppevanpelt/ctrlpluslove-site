import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dear Rob — ctrl+love",
};

export default function RobPage() {
  return (
    <main className="document-page">
      {/* Plain img keeps the exported file:// preview self-contained. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="document-image"
        src="dear-rob.png"
        alt="Dear Rob"
        width={1024}
        height={1536}
      />
    </main>
  );
}
