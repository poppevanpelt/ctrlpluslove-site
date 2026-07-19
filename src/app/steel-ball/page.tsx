import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { createPageMetadata } from "../seo";
import { ThemeToggle } from "../theme-toggle";
import { SteelBallMemoryPanel } from "./steel-ball-memory-panel";

const steelBallStory = [
  "When Tesla unveiled the Cybertruck in 2019, one steel ball changed everything.",
  "It didn't just shatter a window. It cracked confidence.",
  "For years, Tesla had built one of the world's most powerful marketing engines: millions of owners, fans and creators voluntarily spreading the story.",
  "A global network powered by belief.",
  "Then, in a matter of seconds, that network had a different story to tell.",
  "Not because anyone instructed it to.",
  "Networks don't wait for instructions. They amplify reality.",
  "The window wasn't the real failure. The story was.",
  "That is exactly why we built ctrl+love.",
  "Today, our ambassadors span Europe and Asia.",
  "Different cultures. Different industries. Different ways of seeing.",
  "Their role isn't to agree with us.",
  "It's to ask the uncomfortable question, notice the overlooked detail, challenge the easy consensus, and find the steel ball before reality throws it.",
  "Because if someone in Stockholm, Berlin, Valencia, Tokyo or Seoul spots a weakness before launch, we'd much rather hear it in our room than watch millions discover it online.",
  "That's what a global network should be for.",
  "Not to amplify certainty. To improve it.",
  "Reality always wins.",
  "The only question is where you choose to meet it.",
  "Because when the steel ball finally comes flying...",
  "...you'll wish it was us holding it.",
  "ctrl+love. Shortcut to reality.",
  "Now available online. The original replica of the Steel Ball.",
  "The only piece of merchandise we genuinely hope you'll never have to use.",
  "€29.95",
  "Warning: May expose weak ideas before the market does.",
];

export const metadata: Metadata = createPageMetadata({
  path: "/steel-ball/",
  title: "The Steel Ball — ctrl+love",
  description:
    "The original replica. A physical reminder to test confidence before reality does.",
  image: "/museum/steel-ball-packshot-cutout.png",
  imageAlt: "Steel Ball SB-01 by ctrl+love",
});

export default function SteelBallPage() {
  return (
    <main className="site-shell steel-ball-page">
      <ThemeToggle />

      <section className="content-section steel-ball-section" aria-labelledby="steel-ball-title">
        <div className="content-block steel-ball-block">
          <nav className="page-backlinks" aria-label="Steel Ball page links">
            <Link className="back-home-link" href="/">
              ← Home
            </Link>
            <Link className="back-home-link" href="/museum/">
              Museum shop
            </Link>
          </nav>

          <section className="steel-ball-hero">
            <div className="steel-ball-hero-copy">
              <p className="section-kicker">Artifact 001</p>
              <Image
                className="steel-ball-hero-orb"
                src="/museum/steel-ball-packshot-cutout.png"
                alt=""
                width={430}
                height={414}
                sizes="(max-width: 720px) 54vw, 0px"
                priority
              />
              <h1 id="steel-ball-title">The Steel Ball</h1>
              <p className="steel-ball-subheading">The original replica.</p>
              <p className="steel-ball-price">€29.95</p>
              <button
                className="steel-ball-cta"
                type="button"
                aria-describedby="steel-ball-coming-soon"
                disabled
              >
                Order online
              </button>
              <p id="steel-ball-coming-soon" className="steel-ball-cta-note">
                Coming soon. Reality is still reviewing fulfillment.
              </p>
            </div>

          </section>

          <section className="steel-ball-description" aria-labelledby="steel-ball-description-title">
            <h2 id="steel-ball-description-title">
              The only piece of merchandise we genuinely hope you&apos;ll never
              have to use.
            </h2>
            <div>
              <p>
                In 2019, one steel ball changed the story of the Cybertruck
                launch.
              </p>
              <p>The window wasn&apos;t the real failure.</p>
              <p>The story was.</p>
              <p>
                The Steel Ball is a physical reminder to test confidence before
                reality does.
              </p>
            </div>
          </section>

          <aside className="steel-ball-warning" aria-label="Steel Ball warning">
            Warning: May expose weak ideas before the market does.
          </aside>

          <SteelBallMemoryPanel />

          <section className="steel-ball-story" aria-labelledby="steel-ball-story-title">
            <details>
              <summary>
                <span>Full story</span>
                <strong id="steel-ball-story-title">
                  How to ruin a global network model in under a week
                </strong>
              </summary>
              <div className="steel-ball-story-copy">
                {steelBallStory.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          </section>
        </div>
      </section>
    </main>
  );
}
