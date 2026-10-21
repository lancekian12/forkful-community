import "server-only";
import { cookies } from "next/headers";

const COOKIE = "forkful_visitor";

/** Anonymous per-browser id used to remember likes without accounts. */
export async function getVisitorId() {
  return (await cookies()).get(COOKIE)?.value;
}

export async function ensureVisitorId() {
  const jar = await cookies();
  let id = jar.get(COOKIE)?.value;
  if (!id) {
    id = crypto.randomUUID();
    jar.set(COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return id;
}
