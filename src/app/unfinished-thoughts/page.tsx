import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Department of Unanswered Questions — ctrl+love",
};

export default function UnfinishedThoughtsPage() {
  return (
    <main className="document-page">
      {/* Plain img keeps the exported file:// preview self-contained. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="document-image"
        src="/unfinished-thoughts.png"
        alt="Department of Unanswered Questions"
        width={1792}
        height={1024}
      />
    </main>
  );
}
