"use client";

import { useEffect, useRef, useState } from "react";

const emailAddress = "hello@ctrlpluslove.com";
const emailHref =
  "mailto:hello@ctrlpluslove.com?subject=Decision%20Stress-Test&body=Hello%20ctrl%2Blove%2C%0A%0AI%20have%20one%20decision%20for%20the%20room.%0A%0AThe%20decision%3A%20";

export function StressEntry() {
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "selected">(
    "idle"
  );
  const addressField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopyState("copied");
    } catch {
      addressField.current?.focus();
      addressField.current?.select();
      setCopyState("selected");
    }
  }

  return (
    <>
      <button
        className="stress-primary-action"
        type="button"
        onClick={() => setOpen(true)}
      >
        Enter the room →
      </button>

      {open && (
        <div
          className="stress-entry-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className="stress-entry-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stress-entry-title"
          >
            <div className="stress-entry-heading">
              <p className="section-kicker">Enter the room</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <h2 id="stress-entry-title">Bring one live decision.</h2>
            <p>
              Start with one sentence. Tell us what the decision is and why it
              matters now.
            </p>
            <div className="stress-entry-address">
              <input
                ref={addressField}
                value={emailAddress}
                readOnly
                aria-label="Email address"
              />
              <button type="button" onClick={copyAddress}>
                {copyState === "copied"
                  ? "Copied"
                  : copyState === "selected"
                    ? "Selected — press ⌘C"
                    : "Copy address"}
              </button>
            </div>
            <a className="stress-entry-email" href={emailHref}>
              Open email app →
            </a>
            <p className="stress-entry-note">
              If your email app does not open here, copy the address above.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
