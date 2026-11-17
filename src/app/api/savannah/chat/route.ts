import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { POST as replyToSavannah } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Line = { role: "user" | "assistant"; text: string };
const MAX_TOKEN_LENGTH = 40_000;
const SESSION_MS = 12 * 60 * 60 * 1000;

function sessionKey() {
  const secret = process.env.OPENAI_API_KEY;
  if (!secret) throw new Error("Savannah is not configured");
  return createHash("sha256").update("savannah-native-history-v1\0" + secret).digest();
}

function restoreHistory(token: unknown): Line[] {
  if (typeof token !== "string" || token.length > MAX_TOKEN_LENGTH || !token.startsWith("native1.")) return [];
  try {
    const payload = Buffer.from(token.slice(8), "base64url");
    if (payload.length < 29) return [];
    const decipher = createDecipheriv("aes-256-gcm", sessionKey(), payload.subarray(0, 12));
    decipher.setAuthTag(payload.subarray(12, 28));
    const decoded = Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString("utf8");
    const session = JSON.parse(decoded);
    if (typeof session.expires !== "number" || session.expires < Date.now() || !Array.isArray(session.messages)) return [];
    return session.messages.filter((line: Line) =>
      line && (line.role === "user" || line.role === "assistant") && typeof line.text === "string"
    ).slice(-16).map((line: Line) => ({ role: line.role, text: line.text.slice(0, 1000) }));
  } catch { return []; }
}

function saveHistory(messages: Line[]) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sessionKey(), iv);
  const session = JSON.stringify({ expires: Date.now() + SESSION_MS,
    messages: messages.slice(-16).map(line => ({ role: line.role, text: line.text.slice(0, 1000) })) });
  const ciphertext = Buffer.concat([cipher.update(session, "utf8"), cipher.final()]);
  return "native1." + Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64url");
}

// Compatibility for the installed v0.1 Swift client: {input,previousChatId}
// -> {id,output:[{role,content}]}. History stays client-held and encrypted.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.input !== "string" || !body.input.trim()) {
    return Response.json({ error: "Say something first." }, { status: 400 });
  }
  if (body.input.length > 4000) {
    return Response.json({ error: "Please keep messages under 4000 characters." }, { status: 400 });
  }
  const messages: Line[] = [...restoreHistory(body.previousChatId), { role: "user", text: body.input.trim() }];
  const forwarded = new Request(new URL("/api/savannah", request.url), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(request.headers.get("referer") ? { referer: request.headers.get("referer")! } : {}) },
    body: JSON.stringify({ messages })
  });
  const response = await replyToSavannah(forwarded);
  if (!response.ok) return response;
  const result = await response.json();
  if (typeof result.text !== "string" || !result.text.trim()) {
    return Response.json({ error: "Savannah had nothing to say." }, { status: 502 });
  }
  const history: Line[] = [...messages, { role: "assistant", text: result.text }];
  return Response.json({ id: saveHistory(history), output: [{ role: "assistant", content: result.text }] },
    { headers: { "Cache-Control": "no-store" } });
}
