import { SAVANNAH_BRIEFING } from "../../savannah-briefing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatLine = { role?: "user" | "assistant"; text?: string };
type RequestBody = { messages?: ChatLine[]; context?: string };

function extractText(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  const pieces: string[] = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content?.text === "string") pieces.push(content.text);
    }
  }
  return pieces.join("\n").trim();
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "Savannah is not connected yet. An API key is required." }, { status: 503, headers: { "Cache-Control": "no-store" } });

  const body = (await request.json().catch(() => ({}))) as RequestBody;
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((item) => (item.role === "user" || item.role === "assistant") && typeof item.text === "string")
    .map((item) => ({ role: item.role, content: String(item.text).replace(/\s+/g, " ").trim().slice(0, 4000) }))
    .filter((item) => item.content)
    .slice(-18);

  if (!messages.length) return Response.json({ error: "Say something first." }, { status: 400 });

  const context = typeof body.context === "string" ? body.context.slice(0, 8000).trim() : "";
  const instructions = [
    SAVANNAH_BRIEFING,
    "Website mode: the visitor is typing and you answer in short natural spoken turns.",
    "Do not mention implementation details.",
    "Stay concise by default: usually 1-3 sentences.",
    "The reply will be spoken aloud locally, so write for the ear.",
    context ? `Additional live context:\n${context}` : "",
  ].filter(Boolean).join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      instructions,
      input: messages,
      max_output_tokens: 220,
    }),
  });

  if (!response.ok) return Response.json({ error: "Savannah lost her train of thought." }, { status: 502 });

  const payload = await response.json();
  const text = extractText(payload);
  if (!text) return Response.json({ error: "Savannah had nothing to say." }, { status: 502 });

  return Response.json({ text }, { headers: { "Cache-Control": "no-store" } });
}
