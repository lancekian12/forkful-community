"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { likes, meals, reviews, subscribers } from "@/db/schema";
import { saveImage } from "./storage";
import { slugify } from "./utils";
import {
  IMAGE_TYPES,
  mealSchema,
  reviewSchema,
  subscribeSchema,
  type FieldErrors,
} from "./validation";
import { ensureVisitorId } from "./visitor";

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
  values?: Record<string, string>;
};

function textValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  }
  return values;
}

async function uniqueSlug(title: string) {
  const base = slugify(title) || "recipe";
  let slug = base;
  for (let i = 2; await db.select({ id: meals.id }).from(meals).where(eq(meals.slug, slug)).get(); i++) {
    slug = `${base}-${i}`;
  }
  return slug;
}

export async function shareMeal(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = mealSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Please fix the highlighted fields.",
      values: textValues(formData),
    };
  }

  const { image, ...data } = parsed.data;
  const slug = await uniqueSlug(data.title);
  const ext = IMAGE_TYPES[image.type as keyof typeof IMAGE_TYPES];
  const fileName = `${slug}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const imageUrl = await saveImage(image, fileName);

  await db.insert(meals).values({ ...data, slug, image: imageUrl }).run();

  revalidatePath("/", "layout");
  redirect(`/meals/${slug}?shared=1`);
}

export async function addReview(
  mealId: number,
  slug: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      values: textValues(formData),
    };
  }

  await db.insert(reviews).values({ ...parsed.data, mealId }).run();
  revalidatePath(`/meals/${slug}`);
  revalidatePath("/meals");
  return { ok: true, message: "Thanks — your review is live." };
}

export async function toggleLike(mealId: number, slug: string) {
  const visitorId = await ensureVisitorId();
  const match = and(eq(likes.mealId, mealId), eq(likes.visitorId, visitorId));

  const existing = await db.select().from(likes).where(match).get();
  if (existing) await db.delete(likes).where(match).run();
  else await db.insert(likes).values({ mealId, visitorId }).run();

  revalidatePath(`/meals/${slug}`);
  revalidatePath("/meals");
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = subscribeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values: textValues(formData) };
  }
  await db.insert(subscribers).values(parsed.data).onConflictDoNothing().run();
  return { ok: true, message: "You're on the list. See you at the next cook-along!" };
}
