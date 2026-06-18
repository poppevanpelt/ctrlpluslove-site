type TickerTone = "neutral" | "warm" | "alert" | "odd";

const tickerItems: Array<{ text: string; tone: TickerTone }> = [
  { text: "SHORTCUT TO REALITY", tone: "neutral" },
  { text: "POWERED BY BILLIONS OF HUMAN SIGNALS", tone: "neutral" },
  { text: "REALITY PRESSURE: HIGH", tone: "alert" },
  { text: "CONFIDENCE DECREASING", tone: "neutral" },
  { text: "7 NEW CONTRADICTIONS DETECTED", tone: "neutral" },
  { text: "ONE ASSUMPTION UNDER INVESTIGATION", tone: "neutral" },
  { text: "WAITING FOR A BETTER QUESTION", tone: "neutral" },
  { text: "USEFUL DISAGREEMENT NEARBY", tone: "warm" },
  { text: "THIS NUMBER MAY BE INACCURATE", tone: "neutral" },
  { text: "QUESTION QUALITY IMPROVING", tone: "neutral" },
  { text: "CONSENSUS RISK ELEVATED", tone: "alert" },
  { text: "OBSERVATION IN PROGRESS", tone: "neutral" },
  { text: "REALITY EXPOSURE INCREASING", tone: "warm" },
  { text: "CERTAINTY LEVELS FALLING", tone: "neutral" },
  { text: "TENSION CREATING VALUE", tone: "warm" },
  { text: "JUDGMENT CONDITIONS FAVORABLE", tone: "neutral" },
  { text: "ONE GOOD QUESTION ADDED", tone: "neutral" },
  { text: "A FEW OPINIONS BECAME SIGNAL", tone: "odd" },
  { text: "3 PEOPLE CHANGED THEIR MINDS TODAY", tone: "neutral" },
  { text: "MEANING ACCUMULATING", tone: "warm" },
  { text: "PATTERN DETECTED", tone: "neutral" },
  { text: "PATTERN REJECTED", tone: "neutral" },
  { text: "ANSWER QUALITY UNDER REVIEW", tone: "neutral" },
  { text: "HUMAN JUDGMENT: ONLINE", tone: "odd" },
  { text: "ROOM TEMPERATURE: PRODUCTIVE", tone: "neutral" },
  { text: "NO URGENT NEED FOR CONSENSUS", tone: "neutral" },
  { text: "THINKING TOGETHER SINCE 2026", tone: "neutral" },
  { text: "POWERPOINT ACTIVITY DETECTED", tone: "neutral" },
  { text: "ANOTHER FRAMEWORK HAS BEEN CREATED", tone: "neutral" },
  { text: "ANOTHER FRAMEWORK HAS BEEN IGNORED", tone: "neutral" },
  { text: "TOO EARLY TO BE CERTAIN", tone: "neutral" },
  { text: "SPREADSHEET CONFIDENCE RISING", tone: "neutral" },
  { text: "MEANING > NOISE", tone: "warm" },
  { text: "SOMEONE JUST SAID \"LET'S CIRCLE BACK\"", tone: "neutral" },
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
