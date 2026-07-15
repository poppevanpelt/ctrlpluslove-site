export type RoomStatus = "Idle" | "Refresh requested" | "Running" | "Updated" | "Failed";

export type NotionRichText = {
  plain_text?: string;
  href?: string | null;
  text?: { content?: string; link?: { url: string } | null };
};

export type NotionPage = {
  id: string;
  properties: Record<string, unknown>;
  last_edited_time?: string;
  created_time?: string;
};

export type PageSection = {
  id: string;
  type: string;
  depth: number;
  text: string;
  children: PageSection[];
};

export type RoomComment = {
  id: string;
  discussionId?: string;
  parentId?: string;
  author?: string;
  createdTime?: string;
  lastEditedTime?: string;
  plainText: string;
  resolved?: boolean;
};

export type PageContext = {
  page: NotionPage;
  title: string;
  properties: Record<string, string | number | null>;
  blocks: PageSection[];
  sectionText: Record<string, string>;
  comments: RoomComment[];
};

export type StateMarker = {
  fingerprint: string;
  generatedAt: string;
  runVersion: number;
  idempotencyKey?: string;
  lastProcessedComment?: string;
  source: "ctrl-love-room-v1";
};

export type ChangeSignal = {
  source: "comment" | "page_edit" | "property_change";
  author?: string;
  summary: string;
  text: string;
  meaningful: boolean;
  reason: string;
};

export type ChangeDetectionResult = {
  previousFingerprint?: string;
  currentFingerprint: string;
  changed: boolean;
  signals: ChangeSignal[];
};

export type RoomRefreshResult = {
  meaningfulChange: boolean;
  triggeringComments: Array<{
    author: string;
    text: string;
    createdAt?: string;
  }>;
  voicesReactivated: string[];
  discussionMarkdown: string;
  changedPositions: Array<{
    voice: string;
    before?: string;
    after: string;
    reason: string;
  }>;
  synthesisMarkdown: string;
  recommendationMarkdown: string;
  recommendationChanged: boolean;
  confidenceBefore?: number;
  confidenceAfter: number;
  changeLogMarkdown: string;
};

export type LegacyRoomRefreshResult = {
  materialChange: boolean;
  changeSummary: string;
  triggeringInputs: Array<{
    source: "comment" | "page_edit" | "property_change";
    author?: string;
    summary: string;
  }>;
  voicesReactivated: Array<{
    name: string;
    reason: string;
  }>;
  discussionAddendum: Array<{
    speaker: string;
    role?: string;
    response: string;
    respondsTo?: string;
  }>;
  changedPositions: Array<{
    speaker: string;
    before: string;
    after: string;
    reason: string;
  }>;
  synthesisChanged: boolean;
  updatedSynthesis?: string;
  recommendationChanged: boolean;
  updatedRecommendation?: string;
  confidenceBefore?: number;
  confidenceAfter?: number;
  confidenceReason?: string;
  unresolvedQuestions: string[];
  shortAuditLog: string;
};

export type RunRoomOptions = {
  pageId: string;
  force?: boolean;
};

export type RunRoomOutcome = {
  pageId: string;
  status: "updated" | "skipped" | "failed";
  runId?: string;
  runVersion?: number;
  summary: string;
  error?: string;
  meaningfulChange?: boolean;
  dryRun?: boolean;
  result?: RoomRefreshResult;
};
