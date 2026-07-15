import {
  confidenceFromComparativeValue,
  type RadarReflection,
} from "./reflection.ts";

const NOTION_VERSION = "2022-06-28";
const FALLBACK_RADAR_SIGNALS_DATA_SOURCE_ID = "0e63c0ad-9817-40de-b1bb-267cd0c748a7";

export type RadarSignalInput = {
  signal: string;
  type: string;
  source: string;
  confidence: string;
  market?: string;
  location?: string;
  notes?: string;
  sourceMaterial?: string;
};

export type PublicRadarSignal = {
  signal: string;
  type: string;
  market: string;
  location: string;
  confidence: string;
  notes: string;
};

export type RadarSubmissionInsight =
  | "similar-observed"
  | "first-observed"
  | null;

type NotionRichText = {
  plain_text?: string;
};

type NotionSelect = {
  name?: string;
};

type NotionPage = {
  id?: string;
  properties?: Record<
    string,
    {
      title?: NotionRichText[];
      rich_text?: NotionRichText[];
      select?: NotionSelect | null;
      checkbox?: boolean;
    }
  >;
};

type NotionQueryResponse = {
  results?: NotionPage[];
};

function notionToken() {
  return process.env.NOTION_TOKEN?.trim();
}

function radarSignalsDataSourceId() {
  return (
    process.env.RADAR_SIGNALS_DATA_SOURCE_ID?.trim() ||
    FALLBACK_RADAR_SIGNALS_DATA_SOURCE_ID
  );
}

async function notionRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = notionToken();

  if (!token) {
    throw new Error("Missing NOTION_TOKEN.");
  }

  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `Notion request failed with ${response.status}.`);
  }

  return (await response.json()) as T;
}

function textProperty(text: string) {
  return {
    rich_text: [
      {
        text: {
          content: text,
        },
      },
    ],
  };
}

function titleProperty(text: string) {
  return {
    title: [
      {
        text: {
          content: text,
        },
      },
    ],
  };
}

function selectProperty(name: string) {
  return {
    select: {
      name,
    },
  };
}

function checkboxProperty(checked: boolean) {
  return {
    checkbox: checked,
  };
}

function safeText(value: string | undefined, fallback = "") {
  return value?.trim() || fallback;
}

function getTitle(page: NotionPage, property: string) {
  return page.properties?.[property]?.title?.map((item) => item.plain_text ?? "").join("").trim() ?? "";
}

function getText(page: NotionPage, property: string) {
  return page.properties?.[property]?.rich_text?.map((item) => item.plain_text ?? "").join("").trim() ?? "";
}

function getSelect(page: NotionPage, property: string) {
  return page.properties?.[property]?.select?.name ?? "";
}

export async function createRadarSignal(input: RadarSignalInput) {
  const signal = safeText(input.signal).slice(0, 220);

  if (!signal) {
    throw new Error("A signal is required.");
  }

  return notionRequest<{ id: string }>("/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: {
        data_source_id: radarSignalsDataSourceId(),
      },
      properties: {
        Signal: titleProperty(signal),
        Type: selectProperty(input.type),
        Source: selectProperty(input.source),
        Confidence: selectProperty(input.confidence),
        Status: selectProperty("Raw"),
        "Reflection Status": selectProperty("Pending"),
        Captured: {
          date: {
            start: new Date().toISOString(),
          },
        },
        Market: textProperty(safeText(input.market)),
        Location: textProperty(safeText(input.location)),
        Notes: textProperty(safeText(input.notes)),
        "Source Material": textProperty(safeText(input.sourceMaterial)),
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content:
                    "Submitted through the public /radar route. Keep as Raw until reviewed and promoted into a Decision Question, Room, Knowledge, Output or Evidence.",
                },
              },
            ],
          },
        },
      ],
    }),
  });
}

export async function getRadarSignal(pageId: string): Promise<RadarSignalInput & { id: string }> {
  const page = await notionRequest<NotionPage>(`/pages/${encodeURIComponent(pageId)}`);

  return {
    id: page.id ?? pageId,
    signal: getTitle(page, "Signal"),
    type: getSelect(page, "Type") || "Observation",
    source: getSelect(page, "Source") || "Other",
    confidence: getSelect(page, "Confidence") || "Medium",
    market: getText(page, "Market"),
    location: getText(page, "Location"),
    notes: getText(page, "Notes"),
    sourceMaterial: getText(page, "Source Material"),
  };
}

export async function updateRadarSignalReflection(pageId: string, reflection: RadarReflection) {
  const relatedSignals = reflection.relatedSignals
    .map((signal) => signal.signal)
    .filter(Boolean)
    .join("\n");

  return notionRequest<NotionPage>(`/pages/${encodeURIComponent(pageId)}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        Reflection: textProperty(reflection.reflection),
        "Reflection Type": selectProperty(reflection.reflectionType),
        Confidence: selectProperty(confidenceFromComparativeValue(reflection.quality.comparativeValue)),
        "Related Signals": textProperty(relatedSignals),
        "Room Worthy": checkboxProperty(reflection.roomWorthy),
        "Reflection Status": selectProperty("Generated"),
      },
    }),
  });
}

export async function findMatchingRadarSignal(signal: string): Promise<RadarSubmissionInsight> {
  const normalizedSignal = safeText(signal).slice(0, 220);

  if (!normalizedSignal) {
    return null;
  }

  const response = await notionRequest<NotionQueryResponse>(
    `/data_sources/${radarSignalsDataSourceId()}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        page_size: 1,
        filter: {
          property: "Signal",
          title: {
            equals: normalizedSignal,
          },
        },
      }),
    },
  );

  return (response.results ?? []).length > 0 ? "similar-observed" : "first-observed";
}

export async function getPublicRadarSignals(): Promise<PublicRadarSignal[]> {
  const response = await notionRequest<NotionQueryResponse>(
    `/data_sources/${radarSignalsDataSourceId()}/query`,
    {
      method: "POST",
      body: JSON.stringify({
        page_size: 6,
        filter: {
          property: "Status",
          select: {
            equals: "Promoted",
          },
        },
        sorts: [
          {
            property: "Captured",
            direction: "descending",
          },
        ],
      }),
    },
  );

  return (response.results ?? [])
    .map((page) => ({
      signal: getTitle(page, "Signal"),
      type: getSelect(page, "Type"),
      market: getText(page, "Market"),
      location: getText(page, "Location"),
      confidence: getSelect(page, "Confidence"),
      notes: getText(page, "Notes"),
    }))
    .filter((signal) => signal.signal);
}
