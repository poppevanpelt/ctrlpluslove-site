"use client";

import { useCallback, useEffect, useState } from "react";

type OutAndAboutResponse = {
  ok: boolean;
  mode: string;
  locationMode: string;
  locationStored: boolean;
  subject: string;
  body: string;
  note: string;
  profile: string;
  publicArea: string;
};

const PRESETS = [
  { label: "AUTO", value: "" },
  { label: "HAARLEM", value: "haarlem" },
  { label: "AMSTERDAM", value: "amsterdam" },
  { label: "SCHIPHOL", value: "schiphol" },
  { label: "BALI", value: "bali" },
  { label: "ELSEWHERE", value: "default" },
];

export default function OutAndAboutClient() {
  const [data, setData] = useState<OutAndAboutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async (area = "") => {
    setLoading(true);
    setCopied(false);

    const query = area ? `?area=${encodeURIComponent(area)}` : "";
    const response = await fetch(`/api/out-and-about${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      setData(null);
      setLoading(false);
      return;
    }

    setData((await response.json()) as OutAndAboutResponse);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyMessage() {
    if (!data) return;
    await navigator.clipboard.writeText(data.body);
    setCopied(true);
  }

  return (
    <section>
      <div className="oaa-presets" aria-label="Preview location">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="oaa-chip"
            onClick={() => void load(preset.value)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="oaa-status">
        <span>{loading ? "LOCATING…" : data?.publicArea ?? "UNKNOWN"}</span>
        <span>COARSE ONLY</span>
        <span>NOT STORED</span>
      </div>

      <article className="oaa-card">
        <div className="oaa-card-head">
          <span>OUT &amp; ABOUT™</span>
          <span>{data?.profile?.toUpperCase() ?? "—"}</span>
        </div>

        {loading ? (
          <p className="oaa-loading">Looking for the useful level of vagueness.</p>
        ) : data ? (
          <>
            <p className="oaa-subject">SUBJECT / {data.subject}</p>
            <pre>{data.body}</pre>
            <button type="button" className="oaa-copy" onClick={copyMessage}>
              {copied ? "COPIED" : "COPY MESSAGE"}
            </button>
          </>
        ) : (
          <p className="oaa-loading">Couldn&apos;t determine a useful area. Default wins.</p>
        )}
      </article>

      <p className="oaa-footnote">
        No GPS request. No coordinates. Network location is reduced to a broad
        profile before copy is selected. The message itself never needs to say
        where you are.
      </p>
    </section>
  );
}
