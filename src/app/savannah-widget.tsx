"use client";

// Netlify rebuild marker: Savannah web activation

import Script from "next/script";
import { createElement } from "react";

const SAVANNAH_ASSISTANT_ID = "c0ba4276-4ffc-4e6f-b795-c4d8f8dfa8b4";
const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

export function SavannahWidget() {
  if (!VAPI_PUBLIC_KEY) return null;

  return (
    <>
      <Script
        src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
        strategy="afterInteractive"
      />
      {createElement("vapi-widget", {
        "public-key": VAPI_PUBLIC_KEY,
        "assistant-id": SAVANNAH_ASSISTANT_ID,
        mode: "voice",
        theme: "dark",
        position: "bottom-right",
        size: "compact",
        "start-button-text": "Talk to Savannah",
        "end-button-text": "End call",
        "empty-voice-message": "Savannah is listening.",
      })}
    </>
  );
}
