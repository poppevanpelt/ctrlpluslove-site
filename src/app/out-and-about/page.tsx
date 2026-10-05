import type { Metadata } from "next";

import OutAndAboutClient from "./out-and-about-client";
import "./out-and-about.css";

export const metadata: Metadata = {
  title: "OUT & ABOUT™ — ctrl+love",
  description: "A coarse-location field-note engine for being deliberately elsewhere.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OutAndAboutPage() {
  return (
    <main className="oaa-page">
      <header className="oaa-header">
        <a href="/">CTRL+LOVE</a>
        <span>FIELD UNIT / 001</span>
      </header>

      <section className="oaa-hero">
        <p>INFINITE FREEDOM / SMALL INSTRUMENT</p>
        <h1>
          OUT &amp;
          <br />
          ABOUT™
        </h1>
        <p className="oaa-intro">
          An autoresponder that knows roughly where you are, without telling
          anyone where you are.
        </p>
      </section>

      <OutAndAboutClient />
    </main>
  );
}
