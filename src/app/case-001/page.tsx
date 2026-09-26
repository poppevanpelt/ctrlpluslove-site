import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CTRL+CASE 001 — The Empty Frames",
  description: "A public evidence surface for the 1990 Isabella Stewart Gardner Museum theft.",
};

export default function Case001Page() {
  return (
    <main style={{ margin: 0, padding: 0, width: "100%", height: "100dvh", overflow: "hidden", background: "#eee8dc" }}>
      <iframe
        src="/case-001/index.html"
        title="CTRL+CASE 001 — The Empty Frames"
        style={{ border: 0, width: "100%", height: "100%", display: "block" }}
      />
    </main>
  );
}