"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Line = { role: "assistant" | "user"; text: string };
const welcome: Line = { role: "assistant", text: "Hi. Savannah at control love. What's up?" };

export default function SavannahPage() {
  const [lines, setLines] = useState<Line[]>([welcome]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [lines, pending]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.trim();
    if (!value || pending) return;
    const next: Line[] = [...lines, { role: "user", text: value }];
    setLines(next);
    setDraft("");
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/savannah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ messages: next.slice(-18) }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.text !== "string") {
        throw new Error(result?.error || `Chat endpoint HTTP ${response.status}`);
      }
      setLines((previous) => [...previous, { role: "assistant", text: result.text }]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connection failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main id="main-content" style={{ position: "fixed", inset: 0, zIndex: 2147483000, display: "flex", flexDirection: "column", background: "#f1eee6", color: "#151515", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, padding: "max(env(safe-area-inset-top), 18px) 18px 14px", borderBottom: "1px solid #bcb7ae", flexShrink: 0 }}>
        <img src="/savannah-avatar.jpg" width={72} height={72} alt="Savannah" style={{ width: 72, height: 72, objectFit: "cover" }} />
        <div>
          <div style={{ fontSize: 28, fontWeight: 750 }}>Savannah.</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", opacity: .6 }}>CTRL+LOVE / EMPLOYEE #4</div>
        </div>
      </header>
      <section aria-label="Conversation" aria-live="polite" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "14px 18px" }}>
        {lines.map((line, index) => (
          <div key={index} style={{ padding: "14px 0", borderBottom: "1px solid #d0cbc2", overflowWrap: "anywhere" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".12em", opacity: .55, marginBottom: 7 }}>{line.role === "assistant" ? "SAVANNAH" : "YOU"}</div>
            <div style={{ fontSize: 19, lineHeight: 1.36, fontWeight: line.role === "user" ? 700 : 400 }}>{line.text}</div>
          </div>
        ))}
        {pending && <p>Thinking…</p>}
        {error && <p role="alert" style={{ fontSize: 14, color: "#9b3024" }}>Connection problem: {error}</p>}
        <div ref={bottom} />
      </section>
      <form onSubmit={send} style={{ display: "flex", gap: 8, padding: "12px 14px calc(12px + env(safe-area-inset-bottom))", borderTop: "1px solid #bcb7ae", flexShrink: 0 }}>
        <input aria-label="Message Savannah" autoComplete="off" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type to Savannah…" style={{ fontSize: 16, minWidth: 0, width: 0, flex: 1, border: "1px solid #aba69d", padding: "13px 11px", background: "#fff", color: "#151515" }} />
        <button type="submit" disabled={pending || !draft.trim()} style={{ flexShrink: 0, border: 0, background: "#151515", color: "#fff", padding: "0 17px", fontSize: 12, fontWeight: 800, opacity: pending || !draft.trim() ? .5 : 1 }}>SEND</button>
      </form>
    </main>
  );
}
