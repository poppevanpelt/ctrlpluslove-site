import type { Metadata } from "next";

import { routeMetadata } from "../seo";
import { ThemeToggle } from "../theme-toggle";

export const metadata: Metadata = routeMetadata("/inside-ctrl-love/");

const departments = [
  {
    name: "Reality Preservation",
    href: "/reality/",
    person: "Cornelis van Loon",
  },
  {
    name: "Unfinished Thoughts",
    href: "/unfinished-thoughts/",
    person: "Nora Veld",
  },
  {
    name: "Necessary Elimination",
    href: "/necessary-elimination/",
    person: "Kill Almost Everything. Apple, 1997.",
  },
  {
    name: "Irreversible Decisions",
    href: "/irreversible-decisions/",
    person: "Burn the Boats. Netflix, 2007.",
  },
  {
    name: "Essential Things",
    href: "/essential-things/",
    person: "Remember the Brick. LEGO, 2004.",
  },
  {
    name: "Consequential Belief",
    href: "/consequential-belief/",
    person: "Mortgage the Heroes. Marvel, 2009.",
  },
];

const instruments = [
  {
    name: "Instrument Cabinet",
    href: "/instruments/",
    note: "The physical family. Ideas enter. Evidence leaves.",
  },
  {
    name: "Decision Collider",
    href: "/decision-collider/",
    note: "Push one decision through collision and judgment.",
  },
  {
    name: "Meeting Filter",
    href: "/meeting-filter/",
    note: "Should this meeting exist?",
  },
  {
    name: "AI-Y-fier",
    href: "/ai-y-fier/",
    note: "Empty thoughts in. Thought leadership out.",
  },
  {
    name: "Live Decision Simulator",
    href: "/living-decision-review/",
    note: "A decision room that thinks in public.",
  },
];

const archive = [
  {
    name: "Museum",
    href: "/museum/",
    note: "Ideas. Artifacts. Consequences.",
  },
  {
    name: "Artifact Registry",
    href: "/artifacts/",
    note: "Objects, consequences and decision folklore.",
  },
  {
    name: "Constitution",
    href: "/constitution/",
    note: "Governance archive.",
  },
];

export default function InsideCtrlLovePage() {
  return (
    <main className="site-shell">
      <ThemeToggle />
      <section className="content-section ambassador-directory-section">
        <div className="content-block ambassador-directory-block">
          <div className="section-heading quiet-heading">
            <div>
              <p className="section-kicker">Inside ctrl+love</p>
              <h1>The engine room.</h1>
            </div>
            <p>
              Working instruments, internal departments and strange objects that
              earn their place by helping a decision get closer to reality.
            </p>
          </div>

          <p className="section-kicker">Working instruments</p>
          <div className="features-list">
            {instruments.map((instrument) => (
              <a className="feature-link" href={instrument.href} key={instrument.name}>
                <span>{instrument.name} →</span>
                <em>{instrument.note}</em>
              </a>
            ))}
          </div>

          <p className="section-kicker">Departments</p>
          <div className="departments-list">
            {departments.map((department) => (
              <a className="department-link" href={department.href} key={department.name}>
                <span>{department.name}</span>
                <em>{department.person}</em>
              </a>
            ))}
          </div>

          <p className="section-kicker">Archive</p>
          <div className="features-list">
            {archive.map((item) => (
              <a className="feature-link" href={item.href} key={item.name}>
                <span>{item.name} →</span>
                <em>{item.note}</em>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
