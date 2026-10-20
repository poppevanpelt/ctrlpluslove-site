import "server-only";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { database } from "./database";
import { validateReceipt } from "./receipt";

export function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
export async function saveAssessment(payload: unknown) {
  const assessment = validateReceipt(payload);
  if (!assessment) return null;
  const orderId = randomUUID();
  const privateToken = randomBytes(32).toString("hex");
  await database().query(
    "INSERT INTO valhalla.receipt_drafts (order_id, access_hash, assessment) VALUES ($1, $2, $3::jsonb)",
    [orderId, digest(privateToken), JSON.stringify(assessment)]
  );
  return { orderId, privateToken };
}
