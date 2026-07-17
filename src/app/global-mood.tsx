const globalMoodEntries = [
  { city: "Seoul", mood: "Playful", direction: "up" },
  { city: "Tokyo", mood: "Focused", direction: "steady" },
  { city: "Valencia", mood: "Relaxed", direction: "up" },
  { city: "Amsterdam", mood: "Curious", direction: "steady" },
  { city: "São Paulo", mood: "Energetic", direction: "up" },
  { city: "San Francisco", mood: "Building", direction: "steady" },
  { city: "Helsinki", mood: "Reflective", direction: "steady" },
  { city: "Mexico City", mood: "Hopeful", direction: "up" },
  { city: "London", mood: "Restless", direction: "steady" },
  { city: "Nairobi", mood: "Inventive", direction: "up" },
];

const globalMoodDescription =
  "A living interpretation of the world’s emotional climate.";

export function GlobalMood() {
  return (
    <aside
      className="global-mood"
      aria-labelledby="global-mood-label"
      aria-describedby="global-mood-note"
    >
      <p className="global-mood-note" id="global-mood-note">
        {globalMoodDescription}
      </p>
      <div className="global-mood-label" id="global-mood-label">
        GLOBAL MOOD
      </div>
      <div className="global-mood-window">
        <div className="global-mood-track">
          <GlobalMoodRun />
          <GlobalMoodRun ariaHidden />
        </div>
      </div>
    </aside>
  );
}

function GlobalMoodRun({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="global-mood-run" aria-hidden={ariaHidden}>
      {globalMoodEntries.map((entry) => (
        <span className="global-mood-item" key={`${entry.city}-${entry.mood}`}>
          <span>{entry.city.toUpperCase()}</span>
          <strong>{entry.mood.toUpperCase()}</strong>
          <em aria-hidden="true">{entry.direction === "up" ? "↑" : "→"}</em>
        </span>
      ))}
    </div>
  );
}
