import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

export const metadata = {
  title: "ctrl+love constitution",
  description: "Download the ctrl+love constitution archive.",
};

export default function ConstitutionPage() {
  return (
    <main className="site-shell constitution-page">
      <ThemeToggle />

      <Link className="constitution-home" href="/">
        ctrl+love
      </Link>

      <section className="constitution-section">
        <div className="constitution-block">
          <p className="section-kicker">governance archive</p>

          <h1>ctrl+love constitution</h1>

          <p className="constitution-intro">
            We wrote down the rules of the room.
            <br />
            Not because the system was finished.
            <br />
            Because it started behaving like something that needed governance.
          </p>

          <a
            className="constitution-download"
            href="/downloads/ctrl_love_constitution_governance_export.zip"
            download
          >
            Download the constitution archive
          </a>
        </div>
      </section>
    </main>
  );
}
