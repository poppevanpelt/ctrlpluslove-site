import type { RoomEnv } from "../env.ts";

export class NotionApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "NotionApiError";
    this.status = status;
    this.code = code;
  }
}

type NotionRequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  retry?: boolean;
};

const NOTION_VERSION = "2022-06-28";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function notionRequest<T>(
  env: RoomEnv,
  path: string,
  options: NotionRequestOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const retry = options.retry ?? true;
  const attempts = retry ? 3 : 1;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(`https://api.notion.com/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${env.notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    if (response.ok) {
      return (await response.json()) as T;
    }

    const errorBody = (await response.json().catch(() => ({}))) as { message?: string; code?: string };
    const shouldRetry = response.status === 429 || response.status >= 500;

    if (attempt < attempts && shouldRetry) {
      await wait(300 * 2 ** (attempt - 1));
      continue;
    }

    throw new NotionApiError(
      errorBody.message ?? `Notion API request failed with HTTP ${response.status}`,
      response.status,
      errorBody.code,
    );
  }

  throw new NotionApiError("Notion API request failed.", 500);
}

export async function collectPaginated<T>(
  fetchPage: (cursor?: string) => Promise<{ results: T[]; has_more?: boolean; next_cursor?: string | null }>,
): Promise<T[]> {
  const results: T[] = [];
  let cursor: string | undefined;

  do {
    const page = await fetchPage(cursor);
    results.push(...page.results);
    cursor = page.has_more && page.next_cursor ? page.next_cursor : undefined;
  } while (cursor);

  return results;
}
