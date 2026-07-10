"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { Ambassador } from "./ambassadors-data";

type AmbassadorGridProps = {
  ambassadors: Ambassador[];
  compact?: boolean;
};

type AmbassadorPortraitProps = {
  ambassador: Ambassador;
  onSelect: (ambassador: Ambassador, trigger: HTMLButtonElement) => void;
};

function formatAmbassadorLocation(ambassador: Ambassador) {
  return [ambassador.city, ambassador.country].filter(Boolean).join(", ");
}

export function AmbassadorPortrait({
  ambassador,
  onSelect,
}: AmbassadorPortraitProps) {
  const location = formatAmbassadorLocation(ambassador);

  return (
    <button
      className="ambassador-portrait-card"
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => onSelect(ambassador, event.currentTarget)}
    >
      <span className="ambassador-portrait-frame">
        <Image
          src={ambassador.image}
          alt={`Portrait of ${ambassador.name}, ctrl+love ambassador from ${ambassador.country}`}
          width={240}
          height={300}
          className="ambassador-portrait-image"
          loading="lazy"
        />
      </span>
      <span className="ambassador-portrait-copy">
        <strong>{ambassador.name}</strong>
        <span>{location}</span>
        <em>{ambassador.perspective}</em>
      </span>
    </button>
  );
}

export function AmbassadorGrid({
  ambassadors,
  compact = false,
}: AmbassadorGridProps) {
  const [selected, setSelected] = useState<Ambassador | null>(null);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!selected) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      activeButtonRef.current?.focus();
    };
  }, [selected]);

  return (
    <>
      <div
        className={compact ? "ambassador-grid is-compact" : "ambassador-grid"}
      >
        {ambassadors.map((ambassador) => (
          <AmbassadorPortrait
            ambassador={ambassador}
            key={ambassador.id}
            onSelect={(selectedAmbassador, trigger) => {
              activeButtonRef.current = trigger;
              setSelected(selectedAmbassador);
            }}
          />
        ))}
      </div>

      {selected ? (
        <div
          className="ambassador-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section
            className="ambassador-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ambassador-modal-title"
            aria-describedby="ambassador-modal-description"
          >
            <button
              className="ambassador-modal-close"
              type="button"
              ref={closeButtonRef}
              aria-label="Close ambassador details"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
            <div className="ambassador-modal-portrait">
              <Image
                src={selected.image}
                alt={`Portrait of ${selected.name}, ctrl+love ambassador from ${selected.country}`}
                width={480}
                height={600}
              />
            </div>
            <div className="ambassador-modal-copy">
              <p className="section-kicker">{selected.embassyNumber}</p>
              <h2 id="ambassador-modal-title">{selected.name}</h2>
              <p className="ambassador-modal-role">{selected.role}</p>
              <p className="ambassador-modal-place">
                {formatAmbassadorLocation(selected)}
              </p>
              <p
                className="ambassador-modal-perspective"
                id="ambassador-modal-description"
              >
                {selected.perspective}
              </p>
              <p className="ambassador-modal-bio">{selected.bio}</p>
              {selected.linkedin ? (
                <a
                  className="text-link"
                  href={selected.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn →
                </a>
              ) : (
                <p className="ambassador-modal-link-note">
                  LinkedIn pending confirmation.
                </p>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
