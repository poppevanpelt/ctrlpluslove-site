import type { Metadata } from "next";

import { ThemeToggle } from "../theme-toggle";

export const metadata: Metadata = {
  title: "Inside ctrl+love — ctrl+love",
  description: "Internal tools, departments and artifacts from the ctrl+love engine.",
};

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

const featureLinks = [
  {
    name: "Live Decision Simulator",
    href: "/living-decision-simulator-episode-002/",
    note: "A decision room that thinks in public.",
  },
  {
    name: "AI-y-fier",
    href: "/ai-y-fier/",
    note: "Empty thoughts in. Thought leadership out.",
  },
  {
    name: "Meeting Filter",
    href: "/meeting-filter/",
    note: "Should we be in this meeting?",
  },
  {
    name: "Museum Shop",
    href: "/museum/",
    note: "Ideas, artifacts, consequences.",
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
              <h1>How the engine works.</h1>
            </div>
            <p>
              Internal labels, tools and artifacts moved out of the homepage
              path so the offer can be understood first.
            </p>
          </div>

          <div className="departments-list">
            {departments.map((department) => (
              <a className="department-link" href={department.href} key={department.name}>
                <span>{department.name}</span>
                <em>{department.person}</em>
              </a>
            ))}
          </div>

          <div className="features-list">
            {featureLinks.map((feature) => (
              <a className="feature-link" href={feature.href} key={feature.name}>
                <span>{feature.name} →</span>
                <em>{feature.note}</em>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
