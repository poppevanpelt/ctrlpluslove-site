import type { Metadata } from "next";

import { AmbassadorGrid } from "../ambassador-grid";
import { ambassadors } from "../ambassadors-data";
import { ThemeToggle } from "../theme-toggle";

export const metadata: Metadata = {
  title: "Ambassadors — ctrl+love",
  description: "The ctrl+love ambassador layer.",
};

export default function AmbassadorsPage() {
  return (
    <main className="site-shell ambassadors-page">
      <ThemeToggle />

      <section className="content-section ambassador-directory-section">
        <div className="content-block ambassador-directory-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">Ambassadors</p>
              <h1>The ctrl+love embassy.</h1>
            </div>
            <p>
              Local readers of reality.
              <br />
              Different rooms. Same pressure.
            </p>
          </div>

          <AmbassadorGrid ambassadors={ambassadors} />
        </div>
      </section>
    </main>
  );
}
