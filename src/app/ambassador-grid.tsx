import Image from "next/image";

import type { Ambassador } from "./ambassadors-data";

type AmbassadorGridProps = {
  ambassadors: Ambassador[];
  compact?: boolean;
};

type AmbassadorCardProps = {
  ambassador: Ambassador;
};

function formatAmbassadorLocation(ambassador: Ambassador) {
  return [ambassador.city, ambassador.country].filter(Boolean).join(", ");
}

function portraitSrc(src: string) {
  return `${src}?v=portrait-clean-20260712-2`;
}

export function AmbassadorCard({ ambassador }: AmbassadorCardProps) {
  return (
    <article
      className="ambassador-profile-card"
      id={`ambassador-${ambassador.id}`}
    >
      <div className="ambassador-profile-portrait">
        <span
          className="ambassador-flag-badge"
          aria-label={`${ambassador.country} flag`}
        >
          {ambassador.flag}
        </span>
        {ambassador.image ? (
          <Image
            src={portraitSrc(ambassador.image)}
            alt={`Portrait of ${ambassador.name}, ctrl+love table member from ${ambassador.country}`}
            width={720}
            height={900}
            className="ambassador-profile-image"
            loading="lazy"
            sizes="(max-width: 980px) 100vw, 42vw"
            unoptimized
          />
        ) : (
          <div className="ambassador-initials" aria-label={ambassador.name}>
            {ambassador.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
      </div>

      <div className="ambassador-profile-copy">
        <div className="ambassador-profile-head">
          <p className="ambassador-profile-meta">
            <span>{ambassador.number}</span>
            <span>{formatAmbassadorLocation(ambassador)}</span>
          </p>
          <h3>
            <span
              className="ambassador-name-flag"
              aria-label={`${ambassador.country} flag`}
            >
              {ambassador.flag}
            </span>
            {ambassador.name}
          </h3>
          <p className="ambassador-profile-role">
            {ambassador.role}
          </p>
        </div>

        <dl className="ambassador-profile-facts">
          <div>
            <dt>Number</dt>
            <dd>{ambassador.number}</dd>
          </div>
          <div>
            <dt>Participation</dt>
            <dd>{ambassador.participationLabel}</dd>
          </div>
          {ambassador.preferredName ? (
            <div>
              <dt>Short name</dt>
              <dd>{ambassador.preferredName}</dd>
            </div>
          ) : null}
        </dl>

        <div className="ambassador-profile-actions">
          {ambassador.linkedin ? (
            <a
              className="ambassador-action"
              href={ambassador.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${ambassador.name} on LinkedIn in a new tab`}
            >
              View LinkedIn profile ↗
            </a>
          ) : (
            <span className="ambassador-action is-disabled">
              LinkedIn to confirm
            </span>
          )}
          {ambassador.website ? (
            <a
              className="ambassador-action"
              href={ambassador.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${ambassador.name}'s website in a new tab`}
            >
              Website ↗
            </a>
          ) : null}
          <a className="ambassador-room-link" href={ambassador.roomHref}>
            Meet the Room →
          </a>
        </div>
      </div>
    </article>
  );
}

export function AmbassadorGrid({
  ambassadors,
  compact = false,
}: AmbassadorGridProps) {
  if (compact) {
    return (
      <div className="ambassador-grid is-compact">
        {ambassadors.map((ambassador) => (
          <article
            className="ambassador-portrait-card"
            key={ambassador.id}
          >
            <a
              className="ambassador-portrait-main"
              href={`/ambassadors/#ambassador-${ambassador.id}`}
            >
              <span className="ambassador-portrait-frame">
                <span
                  className="ambassador-flag-badge"
                  aria-label={`${ambassador.country} flag`}
                >
                  {ambassador.flag}
                </span>
                {ambassador.image ? (
                  <Image
                    src={portraitSrc(ambassador.image)}
                    alt={`Portrait of ${ambassador.name}`}
                    width={240}
                    height={300}
                    className="ambassador-portrait-image"
                    loading="lazy"
                    sizes="7.5rem"
                    unoptimized
                  />
                ) : (
                  <span className="ambassador-initials">
                    {ambassador.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                )}
              </span>
              <span className="ambassador-portrait-copy">
                <strong>
                  <span
                    className="ambassador-name-flag"
                    aria-label={`${ambassador.country} flag`}
                  >
                    {ambassador.flag}
                  </span>
                  {ambassador.name}
                </strong>
                <span>
                  {ambassador.number} · {ambassador.city}, {ambassador.country}
                </span>
                <em>{ambassador.participationLabel}</em>
              </span>
            </a>
            {ambassador.linkedin ? (
              <a
                className="ambassador-portrait-link"
                href={ambassador.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${ambassador.name} on LinkedIn in a new tab`}
              >
                View LinkedIn profile ↗
              </a>
            ) : (
              <span className="ambassador-portrait-link is-disabled">
                LinkedIn to confirm
              </span>
            )}
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="ambassador-profile-list">
      {ambassadors.map((ambassador) => (
        <AmbassadorCard ambassador={ambassador} key={ambassador.id} />
      ))}
    </div>
  );
}
