import type { Metadata } from "next";
import Link from "next/link";

import { routeMetadata } from "../seo";

export const metadata: Metadata = routeMetadata("/organic-ai/");

const organicAiJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "Organic AI",
  description:
    "The machine's earned understanding of a brand before paid placement, sponsored answers or branded AI agents enter the conversation.",
  inDefinedTermSet: {
    "@type": "DefinedTermSet",
    name: "ctrl+love decision language",
    url: "https://ctrlpluslove.com/organic-ai/",
  },
};

export default function OrganicAiPage() {
  return (
    <main className="site-shell chapter-one" id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organicAiJsonLd) }}
      />

      <section className="content-section ruled constitution-article-section">
        <div className="content-block article-block">
          <p className="section-kicker">Organic AI</p>
          <h1>What the machine believes about you before you pay to enter the conversation.</h1>
          <p className="article-law">
            Organic AI is the earned layer of machine knowledge around a brand:
            what AI systems remember, retrieve, associate, describe and surface
            before sponsored placement, branded agents or other paid AI presence
            enters the decision environment.
          </p>
          <p className="article-note">
            In the AI era, brand decisions increasingly happen where machine
            memory, paid presence and human belief meet.
          </p>
        </div>
      </section>

      <section className="content-section ruled constitution-article-section">
        <div className="content-block article-block">
          <p className="section-kicker">The distinction</p>
          <h2>Organic AI. Paid AI. Human reality.</h2>
          <dl aria-label="Three layers of the decision surface">
            <div>
              <dt>Organic AI</dt>
              <dd>
                What the machine already knows or believes about you: presence,
                prominence, portrayal and persuasion in organic AI answers.
              </dd>
            </div>
            <div>
              <dt>Paid AI</dt>
              <dd>
                What the brand deliberately buys inside the conversation:
                sponsored visibility, click-to-chat brand agents and product integration.
              </dd>
            </div>
            <div>
              <dt>Human reality</dt>
              <dd>
                What people bring with them: past experience, cultural meaning,
                social proof, taste, trust and lived belief.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="content-section ruled constitution-article-section">
        <div className="content-block article-block">
          <p className="section-kicker">Why it matters</p>
          <h2>You can buy AI presence. You cannot directly buy Organic AI.</h2>
          <p className="article-law">
            A brand can purchase access to an AI conversation. But its organic
            machine reputation is built from the wider information environment:
            products, journalism, reviews, public data, customer experience,
            culture and the accumulated evidence machines can retrieve.
          </p>
          <p className="article-note">
            That makes Organic AI a new reputation surface to observe, test and
            understand, not merely another media channel to fill.
          </p>
          <p>
            <Link href="/decision-collider/">Explore the Decision Collider</Link>
            {" · "}
            <Link href="/instruments/">See the Instrument Cabinet</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
