"use client";

import { useState } from "react";

import type { Embassy } from "@/content/embassies";

type EmbassyAtlasProps = {
  embassies: Embassy[];
};

function projectCoordinates(embassy: Embassy) {
  const latitude = embassy.coordinates?.latitude ?? 0;
  const longitude = embassy.coordinates?.longitude ?? 0;

  return {
    x: ((longitude + 180) / 360) * 100,
    y: ((90 - latitude) / 180) * 100,
  };
}

export function EmbassyAtlas({ embassies }: EmbassyAtlasProps) {
  const [activeId, setActiveId] = useState(embassies[0]?.id);
  const activeEmbassy =
    embassies.find((embassy) => embassy.id === activeId) ?? embassies[0];

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
          role="img"
          aria-label="Embassy atlas with points in Tokyo and Stockholm"
        >
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
          {embassies.map((embassy) => {
            const point = projectCoordinates(embassy);
            const isActive = activeEmbassy?.id === embassy.id;

            return (
              <a
                className="embassy-atlas-point"
                data-active={isActive}
                href={`/embassies/${embassy.slug}/`}
                key={embassy.id}
                onBlur={() => setActiveId(activeEmbassy?.id)}
                onFocus={() => setActiveId(embassy.id)}
                onMouseEnter={() => setActiveId(embassy.id)}
              >
                <circle cx={point.x} cy={point.y} r="1.55" />
                <text x={point.x + 2.4} y={point.y - 1.4}>
                  {embassy.id}
                </text>
                <title>
                  {embassy.city}, {embassy.ambassador}, {embassy.id}
                </title>
              </a>
            );
          })}
        </svg>

        {activeEmbassy ? (
          <aside className="embassy-atlas-readout" aria-live="polite">
            <span>{activeEmbassy.id}</span>
            <strong>{activeEmbassy.city}</strong>
            <em>{activeEmbassy.ambassador}</em>
          </aside>
        ) : null}
      </div>

      <div className="embassy-atlas-list" aria-label="Embassy atlas list">
        {embassies.map((embassy) => (
          <button
            type="button"
            className="embassy-atlas-list-item"
            data-active={activeEmbassy?.id === embassy.id}
            key={embassy.id}
            onClick={() => setActiveId(embassy.id)}
            onFocus={() => setActiveId(embassy.id)}
          >
            <span>{embassy.id}</span>
            <strong>{embassy.city}</strong>
            <em>{embassy.ambassador}</em>
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
        </div>
      </noscript>
    </section>
  );
}
