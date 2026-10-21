import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

// Turso in deployed environments; a local SQLite file otherwise.
const url = process.env.TURSO_DATABASE_URL ?? `file:${path.join(DATA_DIR, "food.db")}`;

if (process.env.VERCEL && url.startsWith("file:")) {
  throw new Error("TURSO_DATABASE_URL must be set on Vercel — the filesystem there is not persistent.");
}
if (url.startsWith("file:")) fs.mkdirSync(DATA_DIR, { recursive: true });

// Reuse the client across hot reloads in dev.
const globalForDb = globalThis as unknown as { libsql?: ReturnType<typeof createClient> };
const client =
  globalForDb.libsql ?? createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
if (process.env.NODE_ENV !== "production") globalForDb.libsql = client;

export const db = drizzle(client, { schema });
