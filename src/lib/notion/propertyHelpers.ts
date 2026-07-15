import type { NotionPage, NotionRichText, RoomStatus } from "../room/types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function richTextToPlainText(value: unknown): string {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.map((item: NotionRichText) => item.plain_text ?? item.text?.content ?? "").join("");
}

export function propertyToText(value: unknown): string | number | null {
  if (!isRecord(value) || typeof value.type !== "string") {
    return null;
  }

  switch (value.type) {
    case "title":
      return richTextToPlainText(value.title);
    case "rich_text":
      return richTextToPlainText(value.rich_text);
    case "select":
      return isRecord(value.select) && typeof value.select.name === "string" ? value.select.name : null;
    case "status":
      return isRecord(value.status) && typeof value.status.name === "string" ? value.status.name : null;
    case "number":
      return typeof value.number === "number" ? value.number : null;
    case "date":
      return isRecord(value.date) && typeof value.date.start === "string" ? value.date.start : null;
    case "checkbox":
      return typeof value.checkbox === "boolean" ? String(value.checkbox) : null;
    case "url":
      return typeof value.url === "string" ? value.url : null;
    case "email":
      return typeof value.email === "string" ? value.email : null;
    case "phone_number":
      return typeof value.phone_number === "string" ? value.phone_number : null;
    default:
      return null;
  }
}

export function getPageTitle(page: NotionPage): string {
  for (const property of Object.values(page.properties)) {
    if (isRecord(property) && property.type === "title") {
      return richTextToPlainText(property.title);
    }
  }

  return "Untitled ctrl+love room";
}

export function getSelectProperty(page: NotionPage, name: string): string | null {
  const property = page.properties[name];
  const value = propertyToText(property);
  return typeof value === "string" ? value : null;
}

export function getNumberProperty(page: NotionPage, name: string): number {
  const property = page.properties[name];
  const value = propertyToText(property);
  return typeof value === "number" ? value : 0;
}

export function getRichTextProperty(page: NotionPage, name: string): string {
  const property = page.properties[name];
  const value = propertyToText(property);
  return typeof value === "string" ? value : "";
}

export function getDateProperty(page: NotionPage, name: string): string | null {
  const property = page.properties[name];
  const value = propertyToText(property);
  return typeof value === "string" ? value : null;
}

export function assertRoomStatus(value: string | null): RoomStatus | null {
  if (
    value === "Idle" ||
    value === "Refresh requested" ||
    value === "Running" ||
    value === "Updated" ||
    value === "Failed"
  ) {
    return value;
  }

  return null;
}

export function pagePropertiesToPlainObject(page: NotionPage): Record<string, string | number | null> {
  return Object.fromEntries(
    Object.entries(page.properties).map(([name, property]) => [name, propertyToText(property)]),
  );
}

export function plainTextRichText(content: string) {
  const safe = content.slice(0, 1900);
  return safe.length === 0 ? [] : [{ type: "text", text: { content: safe } }];
}
