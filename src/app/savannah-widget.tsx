"use client";

import { useEffect, useRef, useState } from "react";

const PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const WIDGET_SRC =
  "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";

export function SavannahWidget() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState("Loading Savannah…");

  useEffect(() => {
    let cancelled = false;
    let widget: HTMLElement | null = null;

    const mountWidget = () => {
      if (cancelled || !hostRef.current) return;

      hostRef.current.replaceChildren();

      widget = document.createElement("vapi-widget");
      widget.setAttribute("public-key", PUBLIC_KEY);
      widget.setAttribute("assistant-id", ASSISTANT_ID);
      widget.setAttribute("mode", "voice");
      widget.setAttribute("theme", "light");
      widget.setAttribute("size", "compact");
      widget.setAttribute("position", "bottom-right");
      widget.setAttribute("main-label", "Savannah");
      widget.setAttribute("start-button-text", "Talk to Savannah");
      widget.setAttribute("end-button-text", "End call");
      widget.setAttribute(
        "empty-voice-message",
        "Morning. What are we trying to decide?",
      );
      widget.setAttribute("show-transcript", "false");

      widget.addEventListener("call-start", () => setStatus("I'm listening."));
      widget.addEventListener("call-end", () =>
        setStatus("Morning. What are we trying to decide?"),
      );
      widget.addEventListener("error", (event) => {
        console.error("Savannah Vapi widget error", event);
        setStatus("Savannah's line hit a snag. Try once more.");
      });

      hostRef.current.appendChild(widget);
      setStatus("Morning. What are we trying to decide?");
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-savannah-vapi-widget="true"]',
    );

    if (existing) {
      if (customElements.get("vapi-widget")) {
        mountWidget();
      } else {
        existing.addEventListener("load", mountWidget, { once: true });
      }
    } else {
      const script = document.createElement("script");
      script.src = WIDGET_SRC;
      script.async = true;
      script.defer = true;
      script.dataset.savannahVapiWidget = "true";
      script.addEventListener("load", mountWidget, { once: true });
      script.addEventListener(
        "error",
        () => setStatus("Savannah's voice control did not load. Try again."),
        { once: true },
      );
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      widget?.remove();
    };
  }, []);

  return (
    <>
      <aside
        aria-label="Savannah, ctrl+love employee #4"
        style={{
          position: "fixed",
          right: 18,
          bottom: 92,
          zIndex: 2147483001,
          width: "min(330px, calc(100vw - 36px))",
          border: "1px solid rgba(21,21,21,.22)",
          background: "rgba(245,241,231,.98)",
          color: "#151515",
          boxShadow: "0 16px 44px rgba(0,0,0,.16)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          fontFamily: "inherit",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "72px 1fr",
            gap: 14,
            alignItems: "center",
            padding: "14px 16px 15px",
          }}
        >
          <img
            src="/savannah-avatar.jpg"
            alt=""
            width={72}
            height={72}
            style={{
              width: 72,
              height: 72,
              objectFit: "cover",
              borderRadius: "50%",
              display: "block",
            }}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1 }}>
                Savannah
              </div>
              <div
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, monospace",
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
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
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

            <p
              aria-live="polite"
              style={{
                margin: "12px 0 0",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.3,
                letterSpacing: "-.01em",
              }}
            >
              {status}
            </p>
          </div>
        </div>
      </aside>

      <div
        ref={hostRef}
        aria-label="Savannah voice control"
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 2147483002,
        }}
      />
    </>
  );
}
