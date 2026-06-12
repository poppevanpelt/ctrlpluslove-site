type TickerTone = "neutral" | "warm" | "alert" | "odd";

const tickerItems: Array<{ text: string; tone: TickerTone }> = [
  { text: "REALITY PRESSURE: HIGH", tone: "alert" },
  { text: "CONFIDENCE DECREASING", tone: "neutral" },
  { text: "7 NEW CONTRADICTIONS DETECTED", tone: "neutral" },
  { text: "ONE ASSUMPTION UNDER INVESTIGATION", tone: "neutral" },
  { text: "WAITING FOR A BETTER QUESTION", tone: "neutral" },
  { text: "USEFUL DISAGREEMENT NEARBY", tone: "warm" },
  { text: "THIS NUMBER MAY BE INACCURATE", tone: "neutral" },
  { text: "SHORTCUT TO REALITY", tone: "neutral" },
  { text: "POWERED BY BILLIONS OF HUMAN SIGNALS", tone: "neutral" },
  { text: "SOMEONE JUST SAID \"LET'S CIRCLE BACK\"", tone: "neutral" },
  { text: "SIGNAL QUALITY: RESTLESS", tone: "odd" },
  { text: "ROOM TEMPERATURE: ARGUMENTATIVE", tone: "neutral" },
  { text: "ONE PROMISE IS LOSING SHAPE", tone: "neutral" },
];

export function LivingTicker() {
  return (
    <div className="living-ticker" aria-label="Live reality signals">
      <div className="ticker-track">
        <TickerRun />
        <TickerRun ariaHidden />
      </div>
    </div>
  );
}

function TickerRun({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="ticker-run" aria-hidden={ariaHidden}>
      {tickerItems.map((item, index) => (
        <span
          className="ticker-item"
          data-tone={item.tone}
          key={`${item.text}-${index}`}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
