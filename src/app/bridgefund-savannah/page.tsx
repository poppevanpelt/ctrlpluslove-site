export default function BridgeFundSavannahPage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        background:
          "radial-gradient(circle at 18% 15%, rgba(198,164,104,.12), transparent 28rem), #151412",
        color: "#f3f0e8",
        padding: "28px",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 540,
          borderTop: "1px solid rgba(198,164,104,.5)",
          paddingTop: 14,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          opacity: .72,
        }}
      >
        BridgeFund / private room
      </div>
      <h1
        style={{
          maxWidth: 580,
          margin: "20px 0 0",
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: "clamp(40px, 8vw, 72px)",
          fontWeight: 400,
          lineHeight: .94,
          letterSpacing: "-.04em",
        }}
      >
        Savannah is in the room.
      </h1>
      <p style={{ maxWidth: 520, marginTop: 18, opacity: .68, fontSize: 14, lineHeight: 1.45 }}>
        Talk or type. She receives the active BridgeFund room context when the line opens.
      </p>
    </main>
  );
}
