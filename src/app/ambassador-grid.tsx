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
  return src;
}

function LinkedInPortrait({ ambassador, compact = false }: { ambassador: Ambassador; compact?: boolean }) {
  const portrait = ambassador.image ? (
    <Image
      src={portraitSrc(ambassador.image)}
      alt={`Portrait of ${ambassador.name}`}
      width={compact ? 240 : 720}
      height={compact ? 300 : 900}
      className={compact ? "ambassador-portrait-image" : "ambassador-profile-image"}
      loading="lazy"
      sizes={compact ? "7.5rem" : "(max-width: 980px) 100vw, 42vw"}
    />
  ) : (
    <span className="ambassador-initials" aria-label={ambassador.name}>
      {ambassador.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)}
    </span>
  );

  if (!ambassador.linkedin) return portrait;

  return (
    <a
      href={ambassador.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${ambassador.name}'s LinkedIn profile in a new tab`}
    >
      {portrait}
    </a>
  );
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
        <LinkedInPortrait ambassador={ambassador} />
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
            {ambassador.linkedin ? (
              <a
                href={ambassador.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${ambassador.name}'s LinkedIn profile in a new tab`}
              >
                {ambassador.name}
              </a>
            ) : (
              ambassador.name
            )}
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
            <div className="ambassador-portrait-main">
              <span className="ambassador-portrait-frame">
                <span
                  className="ambassador-flag-badge"
                  aria-label={`${ambassador.country} flag`}
                >
                  {ambassador.flag}
                </span>
                <LinkedInPortrait ambassador={ambassador} compact />
              </span>
              <span className="ambassador-portrait-copy">
                <strong>
                  <span
                    className="ambassador-name-flag"
                    aria-label={`${ambassador.country} flag`}
                  >
                    {ambassador.flag}
                  </span>
                  {ambassador.linkedin ? (
                    <a
                      href={ambassador.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${ambassador.name}'s LinkedIn profile in a new tab`}
                    >
                      {ambassador.name}
                    </a>
                  ) : (
                    ambassador.name
                  )}
                </strong>
                <span>
                  {ambassador.number} · {ambassador.city}, {ambassador.country}
                </span>
                <em>{ambassador.participationLabel}</em>
              </span>
            </div>
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
