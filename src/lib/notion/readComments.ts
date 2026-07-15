import type { RoomEnv } from "../env.ts";
import type { RoomComment } from "../room/types.ts";
import { collectPaginated, notionRequest, NotionApiError } from "./client.ts";
import { richTextToPlainText } from "./propertyHelpers.ts";

type RawComment = {
  id: string;
  discussion_id?: string;
  created_time?: string;
  last_edited_time?: string;
  rich_text?: unknown[];
  created_by?: { id?: string; name?: string; type?: string; person?: { email?: string } };
};

function normalizeComment(comment: RawComment, parentId: string): RoomComment {
  return {
    id: comment.id,
    discussionId: comment.discussion_id,
    parentId,
    author: comment.created_by?.name ?? comment.created_by?.person?.email ?? comment.created_by?.id,
    createdTime: comment.created_time,
    lastEditedTime: comment.last_edited_time,
    plainText: richTextToPlainText(comment.rich_text),
  };
}

export async function readCommentsForBlock(env: RoomEnv, blockId: string): Promise<RoomComment[]> {
  try {
    const comments = await collectPaginated<RawComment>((startCursor) =>
      notionRequest(env, `/comments?block_id=${encodeURIComponent(blockId)}${startCursor ? `&start_cursor=${startCursor}` : ""}`),
    );

    return comments.map((comment) => normalizeComment(comment, blockId));
  } catch (error) {
    if (error instanceof NotionApiError && (error.status === 403 || error.status === 404)) {
      return [];
    }

    throw error;
  }
}

export async function readComments(env: RoomEnv, blockIds: string[]): Promise<RoomComment[]> {
  const seen = new Set<string>();
  const all: RoomComment[] = [];

  for (const blockId of blockIds) {
    const comments = await readCommentsForBlock(env, blockId);

    for (const comment of comments) {
      if (!seen.has(comment.id)) {
        seen.add(comment.id);
        all.push(comment);
      }
    }
  }

  return all.sort((a, b) => (a.createdTime ?? "").localeCompare(b.createdTime ?? ""));
}
