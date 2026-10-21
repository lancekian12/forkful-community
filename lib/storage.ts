import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { UPLOADS_DIR } from "@/db";

/**
 * Saves an uploaded image and returns its public URL.
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise data/uploads
 * (served by app/uploads/[file]/route.ts) for local development.
 */
export async function saveImage(file: File, fileName: string) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`meals/${fileName}`, file, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error("BLOB_READ_WRITE_TOKEN must be set on Vercel to store uploads.");
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${fileName}`;
}
