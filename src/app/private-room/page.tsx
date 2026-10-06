import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Room · ctrl+love",
  robots: { index: false, follow: false, nocache: true },
};

type Props = { searchParams: Promise<{ room?: string }> };

export default async function PrivateRoom({ searchParams }: Props) {
  const { room } = await searchParams;
  const label = room === "luther" ? "Luther" : room === "bonkers" ? "Bonkers" : "This";

  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#0b0b0b",
      color: "#f2f0e9",
      fontFamily: "Arial, Helvetica, sans-serif",
      padding: "32px"
    }}>
      <section style={{ maxWidth: 720, width: "100%" }}>
        <div style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", opacity: .6 }}>
          ctrl+love / private working room
        </div>
        <h1 style={{ fontSize: "clamp(54px, 10vw, 120px)", lineHeight: .82, letterSpacing: "-.06em", textTransform: "uppercase", margin: "24px 0" }}>
          Door closed.
        </h1>
        <p style={{ fontSize: "clamp(20px, 2.4vw, 32px)", lineHeight: 1.15, maxWidth: 620 }}>
          {label} Room is invitation only. Use your personal room link to enter.
        </p>
      </section>
    </main>
  );
}
