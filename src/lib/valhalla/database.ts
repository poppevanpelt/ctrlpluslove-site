import "server-only";
import { Pool } from "pg";
import type { PoolClient } from "pg";

let pool: Pool | undefined;
export function database() {
  if (!process.env.VALHALLA_DATABASE_URL) throw new Error("VALHALLA_DATABASE_URL is missing");
  if (!pool) pool = new Pool({ connectionString: process.env.VALHALLA_DATABASE_URL, max: 4, connectionTimeoutMillis: 5000, ssl: process.env.VALHALLA_DB_SSL === "true" ? { rejectUnauthorized: true } : undefined });
  return pool;
}
export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally { client.release(); }
}
