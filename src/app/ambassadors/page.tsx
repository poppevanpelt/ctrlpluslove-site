import type { Metadata } from "next";

import { AmbassadorGrid } from "../ambassador-grid";
import { confirmedAmbassadors } from "../ambassadors-data";
import { ThemeToggle } from "../theme-toggle";

export const metadata: Metadata = {
  title: "The People Behind ctrl+love — ctrl+love",
  description: "The distributed human network behind ctrl+love.",
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
              <h1>The People Behind ctrl+love.</h1>
            </div>
            <p>
              The network is not a permanent committee. Relevant voices enter
              when the decision, market or cultural context requires them.
              <br />
              Confirmed countries are shown; city labels will be added only
              when confirmed.
            </p>
          </div>

          <AmbassadorGrid ambassadors={confirmedAmbassadors} />
        </div>
      </section>
    </main>
  );
}
