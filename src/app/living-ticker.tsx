const tickerItems = [
  "REALITY PRESSURE: HIGH",
  "CONFIDENCE DECREASING",
  "7 NEW CONTRADICTIONS DETECTED",
  "ONE ASSUMPTION UNDER INVESTIGATION",
  "WAITING FOR A BETTER QUESTION",
  "USEFUL DISAGREEMENT NEARBY",
  "THIS NUMBER MAY BE INACCURATE",
  "POWERED BY REALITY",
  "BUILT ON BILLIONS OF HUMAN SIGNALS",
  "SOMEONE JUST SAID \"LET'S CIRCLE BACK\"",
  "CYBERTRUCK STEEL BALL STATUS: UNRESOLVED",
  "SIGNAL QUALITY: RESTLESS",
  "ROOM TEMPERATURE: ARGUMENTATIVE",
  "ONE PROMISE IS LOSING SHAPE",
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
        <span className="ticker-item" key={`${item}-${index}`}>
          {index === 0 || index === 10 ? (
            <span className="ticker-accent">{item}</span>
          ) : (
            item
          )}
        </span>
      ))}
    </div>
  );
}
