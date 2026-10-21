import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { CATEGORIES, DIFFICULTIES, type Category, type Difficulty } from "../lib/constants";

export { CATEGORIES, DIFFICULTIES, type Category, type Difficulty };

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

export const meals = sqliteTable(
  "meals",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    slug: text().notNull().unique(),
    title: text().notNull(),
    image: text().notNull(),
    summary: text().notNull(),
    ingredients: text({ mode: "json" }).$type<string[]>().notNull(),
    steps: text({ mode: "json" }).$type<string[]>().notNull(),
    category: text({ enum: CATEGORIES }).notNull(),
    difficulty: text({ enum: DIFFICULTIES }).notNull(),
    cookTime: integer("cook_time").notNull(), // minutes
    servings: integer().notNull(),
    creator: text().notNull(),
    creatorEmail: text("creator_email").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("meals_category_idx").on(t.category)]
);

export const reviews = sqliteTable(
  "reviews",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    mealId: integer("meal_id")
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    author: text().notNull(),
    rating: integer().notNull(),
    body: text().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("reviews_meal_idx").on(t.mealId)]
);

// One row per (meal, anonymous visitor) — the visitor id lives in a cookie.
export const likes = sqliteTable(
  "likes",
  {
    mealId: integer("meal_id")
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id").notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.mealId, t.visitorId] })]
);

export const subscribers = sqliteTable("subscribers", {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  createdAt: createdAt(),
});

export type Meal = typeof meals.$inferSelect;
export type Review = typeof reviews.$inferSelect;
