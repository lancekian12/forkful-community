import { z } from "zod";
import { CATEGORIES, DIFFICULTIES } from "@/db/schema";

const lines = (label: string, min: number) =>
  z
    .string()
    .transform((v) =>
      v
        .split("\n")
        .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
        .filter(Boolean)
    )
    .pipe(
      z
        .array(z.string().max(300, `Each ${label} line must be under 300 characters.`))
        .min(min, `Add at least ${min} ${label}${min > 1 ? "s" : ""}, one per line.`)
        .max(40, `Keep it to 40 ${label}s or fewer.`)
    );

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export const mealSchema = z.object({
  title: z.string().trim().min(3, "Give your recipe a title.").max(80),
  summary: z
    .string()
    .trim()
    .min(20, "Write a short summary (at least 20 characters).")
    .max(220, "Keep the summary under 220 characters."),
  category: z.enum(CATEGORIES, "Pick a category."),
  difficulty: z.enum(DIFFICULTIES, "Pick a difficulty."),
  cookTime: z.coerce
    .number("Enter the total time in minutes.")
    .int()
    .min(1, "Enter the total time in minutes.")
    .max(1440, "That's over a day — double check the time."),
  servings: z.coerce.number("How many does it serve?").int().min(1, "How many does it serve?").max(50),
  ingredients: lines("ingredient", 2),
  steps: lines("step", 2),
  creator: z.string().trim().min(2, "Tell us your name.").max(60),
  creatorEmail: z.email("Enter a valid email address."),
  image: z
    .instanceof(File, { message: "Add a photo of your dish." })
    .refine((f) => f.size > 0, "Add a photo of your dish.")
    .refine((f) => f.size <= MAX_IMAGE_BYTES, "Images must be 4 MB or smaller.")
    .refine((f) => f.type in IMAGE_TYPES, "Use a JPG, PNG, WebP or AVIF image."),
});

export const reviewSchema = z.object({
  author: z.string().trim().min(2, "Tell us your name.").max(60),
  rating: z.coerce.number("Choose a rating.").int().min(1, "Choose a rating.").max(5),
  body: z.string().trim().min(5, "Say a little more.").max(1000),
});

export const subscribeSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export type FieldErrors = Partial<Record<string, string[]>>;
