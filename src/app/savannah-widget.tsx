"use client";

import { useEffect } from "react";

const SAVANNAH_AVATAR = "/savannah-avatar.jpg";

export function SavannahWidget() {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-savannah-runtime="true"]',
    );

    if (existing) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "/savannah-runtime.js?v=6af5039";
    script.dataset.savannahRuntime = "true";
    script.onerror = () => {
      const button = document.getElementById("savannah-call-button") as HTMLButtonElement | null;
      const presence = document.getElementById("savannah-presence");

      if (button) {
        button.textContent = "Try Savannah again";
        button.disabled = false;
        button.style.opacity = "1";
      }

      if (presence) {
        presence.textContent = "Savannah's audio line didn't load. Try again.";
      }
    };

    document.head.appendChild(script);
  }, []);

  return (
    <aside
      aria-label="Savannah, ctrl+love employee #4"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 2147483001,
        width: "min(360px, calc(100vw - 36px))",
        border: "1px solid rgba(21,21,21,.22)",
        background: "rgba(245,241,231,.97)",
        color: "#151515",
        boxShadow: "0 16px 44px rgba(0,0,0,.14)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "88px 1fr",
          minHeight: 112,
        }}
      >
        <div
          style={{
            overflow: "hidden",
            borderRight: "1px solid rgba(21,21,21,.18)",
            background: "#e9e4d8",
          }}
        >
          <img
            src={SAVANNAH_AVATAR}
            alt="Savannah"
            width={176}
            height={224}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 112,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            minWidth: 0,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "13px 14px 12px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>
                Savannah
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: ".13em",
                  textTransform: "uppercase",
                  opacity: 0.48,
                  whiteSpace: "nowrap",
                }}
              >
                employee #4
              </div>
            </div>

            <div
              style={{
                marginTop: 6,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 9,
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                opacity: 0.58,
              }}
            >
              intelligent front door
            </div>
          </div>

          <p
            id="savannah-presence"
            aria-live="polite"
            style={{
              margin: "14px 0 0",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.28,
              letterSpacing: "-.01em",
            }}
          >
            One second.
          </p>
        </div>
      </div>

      <button
        id="savannah-call-button"
        type="button"
        disabled
        aria-label="Talk to Savannah"
        style={{
          display: "flex",
          width: "100%",
          minHeight: 46,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          appearance: "none",
          border: 0,
          borderTop: "1px solid rgba(21,21,21,.22)",
          borderRadius: 0,
          padding: "0 14px",
          background: "#151515",
          color: "#f5f1e7",
          font: "inherit",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".11em",
          lineHeight: 1,
          textTransform: "uppercase",
          cursor: "default",
          opacity: 0.68,
        }}
      >
        <span>Loading Savannah…</span>
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            flex: "0 0 auto",
            background: "#ff5a2a",
          }}
        />
      </button>
    </aside>
  );
}
