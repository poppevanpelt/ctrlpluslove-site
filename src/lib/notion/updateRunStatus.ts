import type { RoomEnv } from "../env.ts";
import type { NotionPage, RoomStatus } from "../room/types.ts";
import { notionRequest } from "./client.ts";
import { plainTextRichText } from "./propertyHelpers.ts";

export async function retrievePage(env: RoomEnv, pageId: string): Promise<NotionPage> {
  return notionRequest<NotionPage>(env, `/pages/${pageId}`);
}

export async function updateRunStatus(
  env: RoomEnv,
  pageId: string,
  status: RoomStatus,
  options: {
    error?: string;
    summary?: string;
    lastRoomRun?: string;
    lastProcessedComment?: string;
    runVersion?: number;
    statusPropertyType?: "select" | "status";
  } = {},
): Promise<NotionPage> {
  const properties: Record<string, unknown> = {
    "Room Status":
      options.statusPropertyType === "select"
        ? {
            select: {
              name: status,
            },
          }
        : {
            status: {
              name: status,
            },
          },
  };

  if (options.error !== undefined) {
    properties["Room Error"] = { rich_text: plainTextRichText(options.error) };
  }

  if (options.summary !== undefined) {
    properties["Last Room Summary"] = { rich_text: plainTextRichText(options.summary) };
  }

  if (options.lastRoomRun !== undefined) {
    properties["Last Room Run"] = { date: { start: options.lastRoomRun } };
  }

  if (options.lastProcessedComment !== undefined) {
    properties["Last Processed Comment"] = { rich_text: plainTextRichText(options.lastProcessedComment) };
  }

  if (options.runVersion !== undefined) {
    properties["Run Version"] = { number: options.runVersion };
  }

  return notionRequest<NotionPage>(env, `/pages/${pageId}`, {
    method: "PATCH",
    body: { properties },
  });
}

export async function safeUpdateRunStatus(
  env: RoomEnv,
  page: NotionPage,
  status: RoomStatus,
  options: Omit<Parameters<typeof updateRunStatus>[3], "statusPropertyType"> = {},
): Promise<NotionPage> {
  const roomStatus = page.properties["Room Status"];
  const statusPropertyType =
    typeof roomStatus === "object" &&
    roomStatus !== null &&
    "type" in roomStatus &&
    roomStatus.type === "select"
      ? "select"
      : "status";

  return updateRunStatus(env, page.id, status, { ...options, statusPropertyType });
}
