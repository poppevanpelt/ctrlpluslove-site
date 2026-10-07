import { createServer } from "node:http";
import { SAVANNAH_BRIEFING } from "../src/app/savannah-briefing.ts";

const HOST = process.env.SAVANNAH_LOCAL_HOST || "127.0.0.1";
const PORT = Number(process.env.SAVANNAH_LOCAL_PORT || 4517);
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
const REQUEST_LIMIT = 256 * 1024;

const preferredModels = [
  "qwen3:8b",
  "gemma3:4b",
  "llama3.2:3b",
];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (/^https:\/\/(www\.)?ctrlpluslove\.com$/i.test(origin)) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;

  const extra = (process.env.SAVANNAH_LOCAL_ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return extra.includes(origin);
}

function corsHeaders(origin) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Private-Network": "true",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };

  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function sendJson(response, statusCode, payload, origin) {
  response.writeHead(statusCode, corsHeaders(origin));
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  let bytes = 0;

  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > REQUEST_LIMIT) throw new Error("Request too large.");
    chunks.push(chunk);
  }

  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .slice(-24)
    .filter((message) => message && (message.role === "user" || message.role === "assistant"))
    .map((message) => ({
      role: message.role,
      content: String(message.content || "").replace(/\u0000/g, "").slice(0, 6000).trim(),
    }))
    .filter((message) => message.content);
}

async function fetchWithTimeout(url, init, timeoutMs = 90_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function installedModels() {
  const response = await fetchWithTimeout(`${OLLAMA_BASE_URL}/api/tags`, {}, 2500);
  if (!response.ok) throw new Error(`Ollama tags failed with ${response.status}`);

  const payload = await response.json();
  return Array.isArray(payload?.models)
    ? payload.models.map((item) => String(item?.name || item?.model || "")).filter(Boolean)
    : [];
}

async function resolveModel() {
  const explicit = process.env.SAVANNAH_LOCAL_MODEL?.trim();
  const models = await installedModels();

  if (explicit) {
    if (!models.includes(explicit)) {
      throw new Error(
        `SAVANNAH_LOCAL_MODEL is set to "${explicit}", but that model is not installed. Run: ollama pull ${explicit}`,
      );
    }
    return explicit;
  }

  for (const preferred of preferredModels) {
    if (models.includes(preferred)) return preferred;
  }

  return models[0] || null;
}

async function health() {
  try {
    const model = await resolveModel();
    return {
      ok: Boolean(model),
      model,
      ollama: true,
      runtime: "savannah-local",
      message: model ? "Savannah Local is ready." : "Ollama is running, but no local model is installed.",
    };
  } catch (error) {
    return {
      ok: false,
      model: null,
      ollama: false,
      runtime: "savannah-local",
      message: error instanceof Error ? error.message : "Ollama is unavailable.",
    };
  }
}

async function chat(body) {
  const messages = sanitizeMessages(body?.messages);
  if (!messages.length || messages[messages.length - 1]?.role !== "user") {
    throw new Error("A user message is required.");
  }

  const model = await resolveModel();
  if (!model) {
    throw new Error(
      "Savannah Local has no model yet. Install one with Ollama first, for example: ollama pull qwen3:8b",
    );
  }

  const localContext = String(body?.context || "").slice(0, 16000).trim();
  const system = [
    SAVANNAH_BRIEFING,
    "LOCAL RUNTIME: You are running on Poppe's local Savannah machine. Never mention Ollama, local inference, model names or infrastructure unless explicitly asked.",
    "TEXT MODE: Reply in short, natural written turns. Keep Savannah's existing personality, judgment, privacy boundaries and action boundaries. Do not claim an outward action unless a real connected tool confirms it.",
    localContext,
  ].filter(Boolean).join("\n\n");

  const ollamaResponse = await fetchWithTimeout(
    `${OLLAMA_BASE_URL}/api/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, ...messages],
        stream: false,
        think: false,
        keep_alive: "10m",
        options: {
          temperature: 0.72,
        },
      }),
    },
  );

  if (!ollamaResponse.ok) {
    const detail = await ollamaResponse.text().catch(() => "");
    throw new Error(`Ollama chat failed with ${ollamaResponse.status}${detail ? `: ${detail.slice(0, 240)}` : ""}`);
  }

  const payload = await ollamaResponse.json();
  const message = String(payload?.message?.content || "").trim();
  if (!message) throw new Error("The local model returned an empty answer.");

  return { message, model, runtime: "local" };
}

const server = createServer(async (request, response) => {
  const origin = String(request.headers.origin || "");

  if (!isAllowedOrigin(origin)) {
    sendJson(response, 403, { error: "Origin not allowed." }, origin);
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders(origin));
    response.end();
    return;
  }

  const url = new URL(request.url || "/", `http://${HOST}:${PORT}`);

  try {
    if (request.method === "GET" && url.pathname === "/health") {
      const status = await health();
      sendJson(response, status.ok ? 200 : 503, status, origin);
      return;
    }

    if (request.method === "POST" && url.pathname === "/chat") {
      const body = await readJson(request);
      const result = await chat(body);
      sendJson(response, 200, result, origin);
      return;
    }

    sendJson(response, 404, { error: "Not found." }, origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Savannah Local failed.";
    const status = /JSON|user message|Request too large/i.test(message) ? 400 : 503;
    sendJson(response, status, { error: message }, origin);
  }
});

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("Savannah Local");
  console.log(`  http://${HOST}:${PORT}`);
  console.log(`  Ollama: ${OLLAMA_BASE_URL}`);
  console.log("  Type is local. Vapi is not used by this server.");
  console.log("");
  console.log("Health check:");
  console.log(`  curl http://${HOST}:${PORT}/health`);
  console.log("");
});
