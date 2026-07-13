import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ambassadorProfiles,
  getAmbassadorProfile,
} from "../../ambassador-profiles-data";
import { ThemeToggle } from "../../theme-toggle";

type AmbassadorProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function portraitSrc(src: string) {
  return `${src}?v=profile-20260713`;
}

export function generateStaticParams() {
  return ambassadorProfiles.map((profile) => ({
    slug: profile.slug,
  }));
}

export async function generateMetadata({
  params,
}: AmbassadorProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getAmbassadorProfile(slug);

  if (!profile) {
    return {
      title: "Ambassador not found — ctrl+love",
    };
  }

  const description = `${profile.name} brings ${profile.specialty.toLowerCase()} to the ctrl+love Room.`;

  return {
    title: `${profile.name} — ctrl+love Ambassador`,
    description,
    openGraph: {
      title: `${profile.name} — ctrl+love Ambassador`,
      description,
      type: "profile",
      images: profile.image
        ? [
            {
              url: profile.image,
              width: 1200,
              height: 1500,
              alt: profile.imageAlt,
            },
          ]
        : undefined,
    },
  };
}

export default async function AmbassadorProfilePage({
  params,
}: AmbassadorProfilePageProps) {
  const { slug } = await params;
  const profile = getAmbassadorProfile(slug);

  if (!profile) {
    notFound();
  }

  const previousProfile = profile.previousAmbassador
    ? getAmbassadorProfile(profile.previousAmbassador)
    : undefined;
  const nextProfile = profile.nextAmbassador
    ? getAmbassadorProfile(profile.nextAmbassador)
    : undefined;

  return (
    <main className="site-shell ambassador-detail-page">
      <ThemeToggle />

      <section className="content-section ambassador-detail-section">
        <div className="content-block ambassador-detail-block">
          <div className="ambassador-detail-backlinks" aria-label="Profile navigation">
            <Link className="back-home-link" href="/">
              ← Home
            </Link>
            <Link className="back-home-link" href="/ambassadors/">
              Around the Table
            </Link>
          </div>

          <section className="ambassador-detail-hero" aria-labelledby="ambassador-profile-title">
            <div className="ambassador-detail-city" aria-hidden="true">
              {profile.city}
            </div>

            <div className="ambassador-detail-copy">
              <p className="section-kicker">{profile.role}</p>
              <h1 id="ambassador-profile-title">{profile.name}</h1>
              <p className="ambassador-detail-role">
                {profile.origin} / {profile.specialty}
              </p>
              <p className="ambassador-detail-perspective">
                {profile.perspective}
              </p>
            </div>

            <div className="ambassador-detail-media">
              {profile.image ? (
                <Image
                  src={portraitSrc(profile.image)}
                  alt={profile.imageAlt}
                  width={980}
                  height={1220}
                  className="ambassador-detail-image"
                  priority
                  sizes="(max-width: 860px) 100vw, 42vw"
                  unoptimized
                />
              ) : (
                <div className="ambassador-detail-initials" aria-label={profile.name}>
                  {profile.name.slice(0, 2)}
                </div>
              )}
            </div>
          </section>

          <section className="ambassador-detail-panel" aria-labelledby="ambassador-notices-title">
            <dl className="ambassador-detail-facts">
              <div>
                <dt>City</dt>
                <dd>{profile.city}</dd>
              </div>
              <div>
                <dt>Country</dt>
                <dd>{profile.country}</dd>
              </div>
              <div>
                <dt>Origin</dt>
                <dd>{profile.origin}</dd>
              </div>
              <div>
                <dt>Specialty</dt>
                <dd>{profile.specialty}</dd>
              </div>
            </dl>

            <div className="ambassador-detail-story">
              <div>
                <h2 id="ambassador-notices-title">What they notice</h2>
                <ul>
                  {profile.notices.map((notice) => (
                    <li key={notice}>{notice}</li>
                  ))}
                </ul>
              </div>

              <blockquote className="ambassador-detail-quote">
                <p>{profile.quote}</p>
              </blockquote>

              <div className="ambassador-detail-bio">
                <h2>In the Room</h2>
                {profile.biography.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {profile.linkedin ? (
                  <a
                    className="ambassador-detail-link"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${profile.name}'s LinkedIn profile in a new tab`}
                  >
                    View LinkedIn profile ↗
                  </a>
                ) : null}
              </div>
            </div>
          </section>

          <nav className="ambassador-detail-nav" aria-label="Ambassador profile navigation">
            {previousProfile ? (
              <Link href={`/ambassadors/${previousProfile.slug}/`}>
                <span>Previous</span>
                <strong>{previousProfile.name}</strong>
              </Link>
            ) : (
              <span />
            )}
            {nextProfile ? (
              <Link href={`/ambassadors/${nextProfile.slug}/`}>
                <span>Next</span>
                <strong>{nextProfile.name}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </section>
    </main>
  );
}
