"use client";

export type SavannahLocalRole = "user" | "assistant";

export type SavannahLocalMessage = {
  role: SavannahLocalRole;
  content: string;
};

export type SavannahLocalReply = {
  message: string;
  model: string;
  runtime: "local";
};

const DEFAULT_LOCAL_URL = "http://127.0.0.1:4517";

export function savannahLocalBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_SAVANNAH_LOCAL_URL?.trim();
  return (configured || DEFAULT_LOCAL_URL).replace(/\/$/, "");
}

export async function askSavannahLocal(input: {
  messages: SavannahLocalMessage[];
  context?: string;
  signal?: AbortSignal;
}): Promise<SavannahLocalReply> {
  const response = await fetch(`${savannahLocalBaseUrl()}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: input.messages.slice(-24),
      context: (input.context || "").slice(0, 16000),
    }),
    signal: input.signal,
  });

  const payload = await response.json().catch(() => null) as
    | { message?: string; model?: string; error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || `Savannah Local returned ${response.status}`);
  }

  const message = payload?.message?.trim();
  if (!message) throw new Error("Savannah Local returned an empty reply.");

  return {
    message,
    model: payload?.model || "local",
    runtime: "local",
  };
}

export async function checkSavannahLocal(signal?: AbortSignal) {
  const response = await fetch(`${savannahLocalBaseUrl()}/health`, {
    method: "GET",
    signal,
  });
  if (!response.ok) return null;
  return response.json() as Promise<{
    ok: boolean;
    model: string | null;
    ollama: boolean;
    runtime: "savannah-local";
  }>;
}
