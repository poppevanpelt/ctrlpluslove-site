import { fetchHeadlines } from "@/lib/savannah/news";
export const maxDuration = 20;
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") || "";
  if (query.length > 100) return Response.json({ error: "Query too long" }, { status: 400 });
  return Response.json(await fetchHeadlines(query));
}
export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > 100_000) return Response.json({ error: "Request too large" }, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const calls = body?.message?.toolCallList;
  if (!Array.isArray(calls) || calls.length > 8) return Response.json({ error: "Expected toolCallList" }, { status: 400 });
  const results = await Promise.all(calls.map(async (call: { id?: unknown; function?: { name?: unknown; arguments?: unknown } }) => {
    const toolCallId = typeof call.id === "string" ? call.id : "unknown";
    try {
      if (call.function?.name !== "get_current_news") throw new Error("Unknown tool");
      const args = typeof call.function.arguments === "string" ? JSON.parse(call.function.arguments) : call.function.arguments;
      const query = args?.query;
      if (typeof query !== "string" || query.length > 100) throw new Error("Invalid query");
      const news = await fetchHeadlines(query);
      if (news.unavailableSources.length === 3) throw new Error("All headline sources are unavailable. Do not invent news.");
      return { toolCallId, result: JSON.stringify(news) };
    } catch (error) { return { toolCallId, error: error instanceof Error ? error.message : "News unavailable" }; }
  }));
  return Response.json({ results });
}
