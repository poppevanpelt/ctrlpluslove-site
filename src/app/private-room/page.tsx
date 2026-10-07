import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Room · ctrl+love",
  robots: { index: false, follow: false, nocache: true },
};

type Props = { searchParams: Promise<{ room?: string }> };

export default async function PrivateRoom({ searchParams }: Props) {
  const { room } = await searchParams;
  const label = room === "luther" ? "Luther" : room === "bonkers" ? "Bonkers" : "This";
  const target = room === "luther"
    ? "/savannah-room/luther"
    : room === "bonkers"
      ? "/savannah-room/bonkers"
      : "/";

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
        <p style={{ fontSize: "clamp(20px, 2.4vw, 32px)", lineHeight: 1.15, maxWidth: 620, marginBottom: 30 }}>
          {label} Room is invitation only.
        </p>

        {room === "luther" || room === "bonkers" ? (
          <form action={target} method="get" style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 10,
            maxWidth: 620,
            alignItems: "stretch"
          }}>
            <input
              type="text"
              name="key"
              autoComplete="off"
              spellCheck={false}
              placeholder="Paste room key"
              aria-label="Room key"
              style={{
                minWidth: 0,
                background: "transparent",
                border: "1px solid rgba(242,240,233,.35)",
                color: "#f2f0e9",
                padding: "16px 18px",
                fontSize: 15,
                outline: "none"
              }}
            />
            <button
              type="submit"
              style={{
                border: "1px solid #f2f0e9",
                background: "#f2f0e9",
                color: "#0b0b0b",
                padding: "0 20px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                cursor: "pointer"
              }}
            >
              Enter
            </button>
          </form>
        ) : null}

        <div style={{
          marginTop: 18,
          fontSize: 10,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          opacity: .45
        }}>
          Personal invite links still work too.
        </div>
      </section>
    </main>
  );
}
