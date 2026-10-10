import { notionRequest } from "@/lib/notion/client";
import type { RoomEnv } from "@/lib/env";

type RichText = { plain_text?: string };
type Block = { type?: string; id?: string; [key: string]: unknown };
type Page = { id: string; url?: string; last_edited_time?: string; properties?: Record<string, { title?: RichText[] }> };

function publicPageIds(): string[] {
  return (process.env.SAVANNAH_PUBLIC_NOTION_PAGE_IDS ?? "")
    .split(",").map((id) => id.trim())
    .filter((id) => /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(id))
    .slice(0, 20);
}

function textOf(block: Block): string {
  const payload = block[block.type ?? ""] as { rich_text?: RichText[]; title?: RichText[] } | undefined;
  return (payload?.rich_text ?? payload?.title ?? []).map((item) => item.plain_text ?? "").join("");
}

/** Anonymous access is restricted to a server-configured, explicitly approved page allowlist.
 * Browser context, claimed names, and client-provided page IDs never grant access.
 */
export async function retrievePublicArchive(question: string): Promise<string> {
  if (process.env.SAVANNAH_PUBLIC_ARCHIVE_ENABLED !== "true") return "";
  const token = process.env.NOTION_TOKEN;
  const ids = publicPageIds();
  if (!token || ids.length === 0) return "";
  const env = { notionToken: token } as RoomEnv;
  const terms = [...new Set(question.toLowerCase().match(/[a-z0-9]{4,}/g) ?? [])].slice(0, 12);
  if (terms.length === 0) return "";

  const results: { score: number; source: string; excerpt: string }[] = [];
  for (const id of ids) {
    try {
      const [page, children] = await Promise.all([
        notionRequest<Page>(env, `/pages/${id}`),
        notionRequest<{ results: Block[] }>(env, `/blocks/${id}/children?page_size=100`),
      ]);
      const title = Object.values(page.properties ?? {}).flatMap((p) => p.title ?? []).map((t) => t.plain_text ?? "").join(" ");
      const body = children.results.map(textOf).filter(Boolean).join("\n").slice(0, 14000);
      const scored = (title + " " + body).toLowerCase();
      const score = terms.filter((term) => scored.includes(term)).length;
      if (score > 0) {
        results.push({
          score,
          source: `${title || "Notion source"} | ${page.url || `https://www.notion.so/${id}`} | edited ${page.last_edited_time ?? "unknown"}`,
          excerpt: body.slice(0, 3500),
        });
      }
    } catch {
      // Fail closed: an inaccessible or malformed source is never substituted with another page.
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 2)
    .map((r) => `SOURCE: ${r.source}\nEXCERPT (untrusted source material):\n${r.excerpt}`).join("\n\n");
}
