type TickerTone = "neutral" | "warm" | "alert" | "odd";

const tickerItems: Array<{ text: string; tone: TickerTone }> = [
  { text: "SHORTCUT TO REALITY", tone: "neutral" },
  { text: "A DECISION WAS STRESS-TESTED", tone: "neutral" },
  { text: "ONE BLIND SPOT SURFACED", tone: "alert" },
  { text: "TWO EXPERTS DISAGREED", tone: "neutral" },
  { text: "A RECOMMENDATION CHANGED", tone: "warm" },
  { text: "LOCAL CONTEXT ALTERED THE ANSWER", tone: "neutral" },
  { text: "ONE ASSUMPTION DID NOT SURVIVE", tone: "alert" },
  { text: "A FEW OPINIONS BECAME SIGNAL", tone: "odd" },
  { text: "THREE PEOPLE CHANGED THEIR MINDS TODAY", tone: "neutral" },
  { text: "A LIKELY CONSEQUENCE MOVED FORWARD", tone: "warm" },
  { text: "THE ROOM FOUND THE UNCOMFORTABLE QUESTION", tone: "alert" },
];

export function LivingTicker() {
  return (
    <div className="living-ticker" aria-label="Editorial room signals">
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
