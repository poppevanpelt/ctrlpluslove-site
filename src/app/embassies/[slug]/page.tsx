import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { embassies, getEmbassyBySlug } from "@/content/embassies";
import { getRelatedContentForEmbassy } from "@/content/relationships";
import { absoluteUrl } from "../../seo";
import { ThemeToggle } from "../../theme-toggle";
import { EmbassyLocalTime } from "../local-time";

type EmbassyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return embassies.map((embassy) => ({
    slug: embassy.slug,
  }));
}

export async function generateMetadata({
  params,
}: EmbassyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const embassy = getEmbassyBySlug(slug);

  if (!embassy) {
    return {
      title: "Embassy not found — ctrl+love",
    };
  }

  const title = `${embassy.city} Embassy — ${embassy.ambassador} | ctrl+love`;

  return {
    title,
    description: embassy.summary,
    alternates: {
      canonical: absoluteUrl(`/embassies/${embassy.slug}/`),
    },
    openGraph: {
      title,
      description: embassy.summary,
      url: absoluteUrl(`/embassies/${embassy.slug}/`),
      type: "profile",
      images: [
        {
          url: embassy.portrait,
          width: 1200,
          height: 1500,
          alt: `Portrait of ${embassy.ambassador}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: embassy.summary,
      images: [embassy.portrait],
    },
  };
}

function formatCoordinates(embassy: NonNullable<ReturnType<typeof getEmbassyBySlug>>) {
  if (!embassy.coordinates) {
    return "Coordinates held quietly";
  }

  return `${embassy.coordinates.latitude.toFixed(4)}, ${embassy.coordinates.longitude.toFixed(4)}`;
}

export default async function EmbassyDossierPage({ params }: EmbassyPageProps) {
  const { slug } = await params;
  const embassy = getEmbassyBySlug(slug);

  if (!embassy) {
    notFound();
  }

  const related = getRelatedContentForEmbassy(embassy);

  return (
    <main className="site-shell embassy-detail-page" id="main-content">
      <ThemeToggle />

      <section className="content-section embassy-detail-hero-section">
        <div className="content-block embassy-detail-block">
          <div className="embassy-backlinks">
            <Link className="back-home-link" href="/">
              ← Home
            </Link>
            <Link className="back-home-link" href="/embassies/">
              Embassy Network
            </Link>
          </div>

          <section className="embassy-detail-hero" aria-labelledby="embassy-title">
            <div className="embassy-detail-copy">
              <p className="section-kicker">{embassy.id}</p>
              <h1 id="embassy-title">{embassy.city} Embassy</h1>
              <p className="embassy-detail-lede">
                {embassy.ambassador} holds the local signal for {embassy.city}.
              </p>
              <blockquote>
                <p>{embassy.quote}</p>
              </blockquote>
            </div>

            <div className="embassy-detail-media">
              <Image
                src={embassy.portrait}
                alt={`Portrait of ${embassy.ambassador}, ${embassy.city} Embassy ambassador`}
                width={980}
                height={1220}
                className="embassy-detail-image"
                priority
                sizes="(max-width: 900px) 100vw, 44vw"
              />
            </div>
          </section>

          <section className="embassy-detail-panel" aria-labelledby="local-intelligence-title">
            <dl className="embassy-detail-facts">
              <div>
                <dt>Embassy ID</dt>
                <dd>{embassy.id}</dd>
              </div>
              <div>
                <dt>Ambassador</dt>
                <dd>{embassy.ambassador}</dd>
              </div>
              <div>
                <dt>Coordinates</dt>
                <dd>{formatCoordinates(embassy)}</dd>
              </div>
              <div>
                <dt>Local time</dt>
                <dd>
                  <EmbassyLocalTime timezone={embassy.timezone} />
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{embassy.status ?? "quiet"}</dd>
              </div>
            </dl>

            <div className="embassy-detail-story">
              <div>
                <p className="section-kicker">Local intelligence</p>
                <h2 id="local-intelligence-title">What this Embassy protects</h2>
                <p>{embassy.localIntelligence}</p>
              </div>

              <div className="embassy-related">
                <h2>Related signals</h2>
                {[...related.signals, ...related.conversations].map((item) => (
                  <article key={item.slug}>
                    <span>{item.status}</span>
                    <strong>{item.title}</strong>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <nav className="embassy-detail-nav" aria-label="Related embassies">
            {related.relatedEmbassies.map((relatedEmbassy) => (
              <Link href={`/embassies/${relatedEmbassy.slug}/`} key={relatedEmbassy.id}>
                <span>{relatedEmbassy.id}</span>
                <strong>{relatedEmbassy.city}</strong>
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
