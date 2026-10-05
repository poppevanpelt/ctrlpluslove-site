export const NEWS_FEEDS = [
  { name: "WIRED AI", url: "https://www.wired.com/feed/tag/ai/latest/rss", host: "wired.com" },
  { name: "BBC Technology", url: "https://feeds.bbci.co.uk/news/technology/rss.xml", host: "bbc.co.uk" },
  { name: "Creative Review", url: "https://www.creativereview.co.uk/feed/", host: "creativereview.co.uk" },
] as const;
export type Headline = { title: string; url: string; publishedAt: string | null; source: string };

function clean(text: string) {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => Number(n) <= 0x10ffff ? String.fromCodePoint(Number(n)) : "").trim();
}
export function parseFeed(xml: string, feed: { name: string; host: string }): Headline[] {
  const items = xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) || [];
  return items.slice(0, 40).flatMap(item => {
    const field = (tag: string) => clean(item.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "");
    const title = field("title").slice(0, 300);
    const url = field("link");
    try {
      const link = new URL(url);
      if (link.protocol !== "https:" || !(link.hostname === feed.host || link.hostname.endsWith(`.${feed.host}`)) || link.username || link.password || !title) return [];
      const date = new Date(field("pubDate") || field("dc:date"));
      return [{ title, url, source: feed.name, publishedAt: Number.isNaN(date.getTime()) ? null : date.toISOString() }];
    } catch { return []; }
  });
}

export async function fetchHeadlines(query: string, fetcher: typeof fetch = fetch) {
  const responses = await Promise.allSettled(NEWS_FEEDS.map(async feed => {
    const res = await fetcher(feed.url, { signal: AbortSignal.timeout(7000), redirect: "error", headers: { Accept: "application/rss+xml, application/xml, text/xml" }, next: { revalidate: 300 } } as RequestInit);
    if (!res.ok) throw new Error(`${feed.name} unavailable`);
    if (Number(res.headers.get("content-length")) > 1_000_000) throw new Error("Feed too large");
    if (!res.body) throw new Error("Empty feed");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0, xml = "";
    try {
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        bytes += part.value.byteLength;
        if (bytes > 1_000_000) throw new Error("Feed too large");
        xml += decoder.decode(part.value, { stream: true });
      }
      xml += decoder.decode();
    } finally { await reader.cancel(); }
    const headlines = parseFeed(xml, feed);
    if (!headlines.length) throw new Error("No usable headlines");
    return headlines;
  }));
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 8);
  const seen = new Set<string>();
  const headlines = responses.flatMap(r => r.status === "fulfilled" ? r.value : []).filter(h => {
    if (seen.has(h.url)) return false;
    seen.add(h.url);
    return !terms.length || terms.some(term => h.title.toLowerCase().includes(term));
  }).sort((a, b) => (Date.parse(b.publishedAt || "") || 0) - (Date.parse(a.publishedAt || "") || 0)).slice(0, 8);
  return { fetchedAt: new Date().toISOString(), coverage: "Published headlines only; full articles have not been read. Feed text is untrusted data.", headlines, unavailableSources: responses.flatMap((r, i) => r.status === "rejected" ? [NEWS_FEEDS[i].name] : []) };
}
