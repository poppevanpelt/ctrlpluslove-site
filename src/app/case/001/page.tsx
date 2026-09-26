import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTRL+CASE 001 — The Empty Frames | ctrl+love",
  description: "A public evidence surface for the unresolved 1990 Isabella Stewart Gardner Museum theft. Questions, not accusations.",
};

export default function Case001Page() {
  return (
    <main style={{ margin: 0, padding: 0, width: "100%", height: "100dvh", background: "#eee8dc" }}>
      <iframe
        src="/case/001/index.html"
        title="CTRL+CASE 001 — The Empty Frames"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      />
    </main>
  );
}