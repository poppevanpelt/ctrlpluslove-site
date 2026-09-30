"use client";

import Script from "next/script";
import { useRef } from "react";

const SAVANNAH_ASSISTANT_ID = "417b8810-5b53-4330-9bc4-6437aba1e401";
const VAPI_PUBLIC_KEY = "f79f986e-3b43-4dde-b712-5527ec872a1c";
const SAVANNAH_AVATAR = "/savannah-avatar.jpg";

type VapiSdkWindow = Window & {
  vapiSDK?: {
    run: (options: {
      apiKey: string;
      assistant: string;
      config?: Record<string, unknown>;
    }) => unknown;
  };
};

export function SavannahWidget() {
  const initialized = useRef(false);

  const initSavannah = () => {
    if (initialized.current) return;

    const sdk = (window as VapiSdkWindow).vapiSDK;
    if (!sdk) return;

    initialized.current = true;
    sdk.run({
      apiKey: VAPI_PUBLIC_KEY,
      assistant: SAVANNAH_ASSISTANT_ID,
      config: {},
    });
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
        strategy="afterInteractive"
        onLoad={initSavannah}
      />

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          right: 18,
          bottom: 92,
          zIndex: 2147482999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
          fontFamily: "inherit",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid rgba(20,20,20,.18)",
            background: "#f5f1e7",
            boxShadow: "0 8px 28px rgba(0,0,0,.12)",
            flex: "0 0 auto",
          }}
        >
          <img
            src={SAVANNAH_AVATAR}
            alt=""
            width={76}
            height={76}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div
          style={{
            maxWidth: 210,
            padding: "9px 11px 10px",
            border: "1px solid rgba(20,20,20,.16)",
            background: "rgba(245,241,231,.96)",
            color: "#151515",
            boxShadow: "0 8px 28px rgba(0,0,0,.08)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>Savannah</div>
          <div
            style={{
              marginTop: 4,
              fontSize: 10,
              lineHeight: 1.25,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              opacity: 0.66,
            }}
          >
            employee #4 · intelligent front door
          </div>
        </div>
      </div>
    </>
  );
}
