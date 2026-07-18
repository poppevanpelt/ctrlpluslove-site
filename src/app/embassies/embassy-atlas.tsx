"use client";

import { type KeyboardEvent, useMemo, useState } from "react";

import {
  embassyMapLocations,
  type Embassy,
  type EmbassyMapLocation,
} from "@/content/embassies";

type EmbassyAtlasProps = {
  embassies: Embassy[];
};

function projectCoordinates(location: EmbassyMapLocation) {
  return {
    x: ((location.coordinates.longitude + 180) / 360) * 100,
    y: ((90 - location.coordinates.latitude) / 180) * 100,
  };
}

const exchangeArcs = [
  ["EMB-001", "EMB-002"],
  ["EMB-001", "SIG-SEO"],
  ["EMB-002", "SIG-AMS"],
  ["SIG-VAL", "SIG-LIS"],
] as const;

function arcPath(from: EmbassyMapLocation, to: EmbassyMapLocation) {
  const start = projectCoordinates(from);
  const end = projectCoordinates(to);
  const midpointX = (start.x + end.x) / 2;
  const midpointY = (start.y + end.y) / 2;
  const lift = Math.max(4, Math.abs(start.x - end.x) * 0.08);

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} Q ${midpointX.toFixed(
    2,
  )} ${(midpointY - lift).toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function EmbassyAtlas({ embassies }: EmbassyAtlasProps) {
  const locations = useMemo(() => embassyMapLocations, []);
  const [activeId, setActiveId] = useState(locations[0]?.id);
  const activeLocation =
    locations.find((location) => location.id === activeId) ?? locations[0];
  const activeEmbassyIds = useMemo(
    () => new Set(embassies.map((embassy) => embassy.id)),
    [embassies],
  );
  const countryCount = new Set(locations.map((location) => location.country)).size;
  const locationById = useMemo(
    () => new Map(locations.map((location) => [location.id, location])),
    [locations],
  );

  function selectGhostLocation(
    event: KeyboardEvent<SVGGElement>,
    locationId: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveId(locationId);
    }
  }

  return (
    <section className="embassy-atlas" aria-labelledby="embassy-atlas-title">
      <div className="embassy-atlas-copy">
        <p className="section-kicker">Interactive atlas</p>
        <h2 id="embassy-atlas-title">A quiet index of trusted local judgment.</h2>
        <p>
          The atlas is not a logistics map. It is a record of where trusted
          people help ideas arrive with more context than scale can carry.
        </p>
      </div>

      <div className="embassy-atlas-stage">
        <svg
          className="embassy-atlas-svg"
          viewBox="0 0 100 56"
          role="group"
          aria-label="Embassy atlas showing active embassies and speculative future signals"
        >
          <defs>
            <linearGradient id="embassy-arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="18%" stopColor="currentColor" stopOpacity="0.34" />
              <stop offset="82%" stopColor="currentColor" stopOpacity="0.34" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="embassy-atlas-land embassy-atlas-land-americas"
            d="M8 16 C16 8 27 10 31 18 C36 29 28 37 30 47 C22 48 14 42 12 33 C10 26 2 24 8 16Z"
          />
          <path
            className="embassy-atlas-land embassy-atlas-land-europe"
            d="M47 15 C53 10 63 12 66 19 C69 26 62 29 57 28 C50 27 44 22 47 15Z"
          />
          <path
            className="embassy-atlas-land embassy-atlas-land-africa"
            d="M51 29 C59 25 67 30 65 39 C63 48 55 51 51 44 C47 38 45 32 51 29Z"
          />
          <path
            className="embassy-atlas-land embassy-atlas-land-asia"
            d="M63 16 C73 7 91 11 95 23 C99 36 89 41 80 36 C72 32 60 27 63 16Z"
          />
          <path
            className="embassy-atlas-thread"
            d="M55 16 C63 10 75 16 89 17"
          />
          {exchangeArcs.map(([fromId, toId]) => {
            const from = locationById.get(fromId);
            const to = locationById.get(toId);

            if (!from || !to) {
              return null;
            }

            return (
              <path
                aria-hidden="true"
                className="embassy-atlas-arc"
                d={arcPath(from, to)}
                key={`${fromId}-${toId}`}
              />
            );
          })}
          {locations
            .filter((location) => location.kind === "active")
            .map((location) => {
              const point = projectCoordinates(location);

              return (
                <circle
                  aria-hidden="true"
                  className="embassy-atlas-influence"
                  cx={point.x}
                  cy={point.y}
                  data-active={activeLocation?.id === location.id}
                  key={`${location.id}-influence`}
                  r="7.4"
                />
              );
            })}
          {locations
            .filter((location) => location.kind === "ghost")
            .map((location) => {
              const point = projectCoordinates(location);

              return (
                <circle
                  aria-hidden="true"
                  className="embassy-atlas-ghost-aura"
                  cx={point.x}
                  cy={point.y}
                  data-active={activeLocation?.id === location.id}
                  key={`${location.id}-aura`}
                  r="3.25"
                />
              );
            })}
          {locations.map((location) => {
            const point = projectCoordinates(location);
            const isActive = activeLocation?.id === location.id;
            const isDossierBacked =
              location.kind === "active" && activeEmbassyIds.has(location.id);
            const label = `${location.city}, ${
              location.ambassador ?? "future embassy"
            }, ${location.status}, ${location.currentFocus}`;

            if (isDossierBacked && location.slug) {
              return (
                <a
                  aria-label={label}
                  className="embassy-atlas-point"
                  data-active={isActive}
                  data-location-kind={location.kind}
                  href={`/embassies/${location.slug}/`}
                  key={location.id}
                  onClick={() => setActiveId(location.id)}
                  onFocus={() => setActiveId(location.id)}
                  onMouseEnter={() => setActiveId(location.id)}
                >
                  <circle cx={point.x} cy={point.y} r="1.55" />
                  <text x={point.x + 2.4} y={point.y - 1.4}>
                    {location.id}
                  </text>
                  <title>{label}</title>
                </a>
              );
            }

            return (
              <g
                aria-label={label}
                className="embassy-atlas-point"
                data-location-kind={location.kind}
                data-active={isActive}
                key={location.id}
                onClick={() => setActiveId(location.id)}
                onFocus={() => setActiveId(location.id)}
                onKeyDown={(event) => selectGhostLocation(event, location.id)}
                onMouseEnter={() => setActiveId(location.id)}
                role="button"
                tabIndex={0}
              >
                <circle cx={point.x} cy={point.y} r="1.55" />
                <text x={point.x + 2.4} y={point.y - 1.4}>
                  {location.status}
                </text>
                <title>{label}</title>
              </g>
            );
          })}
        </svg>

        {activeLocation ? (
          <aside className="embassy-atlas-readout" aria-live="polite">
            <span>{activeLocation.status}</span>
            <strong>{activeLocation.city}</strong>
            <em>
              {activeLocation.ambassador ?? "Speculative embassy signal"} ·{" "}
              {activeLocation.yearEstablished}
            </em>
            <p>{activeLocation.currentFocus}</p>
          </aside>
        ) : null}
      </div>

      <p className="embassy-atlas-counter">
        {locations.length} embassies · {countryCount} countries · expansion ongoing
      </p>
      <p className="embassy-atlas-caption">
        The network expands through trust, curiosity and cultural proximity.
      </p>

      <div className="embassy-atlas-list" aria-label="Embassy atlas list">
        {locations.map((location) => (
          <button
            type="button"
            className="embassy-atlas-list-item"
            data-active={activeLocation?.id === location.id}
            data-location-kind={location.kind}
            key={location.id}
            onClick={() => setActiveId(location.id)}
            onFocus={() => setActiveId(location.id)}
          >
            <span>{location.status}</span>
            <strong>{location.city}</strong>
            <em>{location.ambassador ?? "future embassy signal"}</em>
          </button>
        ))}
      </div>

      <noscript>
        <div className="embassy-atlas-noscript">
          {embassies.map((embassy) => (
            <a href={`/embassies/${embassy.slug}/`} key={embassy.id}>
              {embassy.id} / {embassy.city} / {embassy.ambassador}
            </a>
          ))}
          {locations
            .filter((location) => location.kind === "ghost")
            .map((location) => (
              <span key={location.id}>
                {location.status} / {location.city} / {location.currentFocus}
              </span>
            ))}
        </div>
      </noscript>
    </section>
  );
}
