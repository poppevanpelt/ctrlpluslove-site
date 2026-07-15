import type { RoomEnv } from "../env.ts";
import type { NotionPage } from "../room/types.ts";
import { collectPaginated, notionRequest } from "./client.ts";

export async function findRequestedPages(env: RoomEnv, limit: number): Promise<NotionPage[]> {
  const pages = await collectPaginated<NotionPage>((startCursor) =>
    notionRequest(env, `/data_sources/${env.notionRunsDataSourceId}/query`, {
      method: "POST",
      body: {
        page_size: Math.min(limit, 100),
        start_cursor: startCursor,
        filter: {
          property: "Room Status",
          status: {
            equals: "Refresh requested",
          },
        },
        sorts: [
          {
            property: "Refresh Requested At",
            direction: "ascending",
          },
        ],
      },
    }),
  );

  return pages.slice(0, limit);
}
