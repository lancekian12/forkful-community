import fs from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/db";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

// Serves user-uploaded images from data/uploads (files added at runtime
// aren't served from /public in production).
export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const match = /^[a-z0-9-]+\.(jpg|png|webp|avif)$/.exec(file);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, file));
    return new Response(data, {
      headers: {
        "Content-Type": TYPES[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
