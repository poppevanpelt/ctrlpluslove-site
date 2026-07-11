import type { Metadata } from "next";
import Link from "next/link";

import { roomPersonas } from "../room-personas-data";
import { ThemeToggle } from "../theme-toggle";

export const metadata: Metadata = {
  title: "The Room — ctrl+love",
  description: "The decision-making lenses inside the ctrl+love Room.",
};

export default function RoomPage() {
  return (
    <main className="site-shell room-page">
      <ThemeToggle />

      <section className="content-section room-directory-section">
        <div className="content-block room-directory-block">
          <Link className="back-home-link" href="/">
            ← Home
          </Link>

          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">The Room</p>
              <h1>The perspectives invited before a decision hardens.</h1>
            </div>
            <p>
              The Room is not one voice pretending to be certainty. It is a set
              of distinct lenses that pressure the decision from different
              angles.
            </p>
          </div>

          <div className="room-persona-list">
            {roomPersonas.map((persona, index) => (
              <article className="room-persona-profile" key={persona.id}>
                <p className="room-persona-number">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2>{persona.name}</h2>
                  <p className="room-persona-role">{persona.role}</p>
                </div>
                <p className="room-persona-line">{persona.line}</p>
                <p className="room-persona-contribution">
                  {persona.contribution}
                </p>
              </article>
            ))}
          </div>

          <section className="room-closing" aria-labelledby="room-closing-title">
            <p className="section-kicker">Then the decision enters</p>
            <h2 id="room-closing-title">
              Watch the Room think through a live example.
            </h2>
            <Link className="text-link" href="/living-decision-review/">
              Open the decision review →
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
