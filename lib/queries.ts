import "server-only";
import { and, count, countDistinct, desc, eq, like, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { CATEGORIES, likes, meals, reviews, type Category } from "@/db/schema";

const ratingExpr = sql<number>`coalesce((select avg(r.rating) from reviews r where r.meal_id = "meals"."id"), 0)`.mapWith(Number);
const reviewCountExpr = sql<number>`(select count(*) from reviews r where r.meal_id = "meals"."id")`.mapWith(Number);
const likeCountExpr = sql<number>`(select count(*) from likes l where l.meal_id = "meals"."id")`.mapWith(Number);

const cardFields = {
  id: meals.id,
  slug: meals.slug,
  title: meals.title,
  image: meals.image,
  summary: meals.summary,
  category: meals.category,
  difficulty: meals.difficulty,
  cookTime: meals.cookTime,
  servings: meals.servings,
  creator: meals.creator,
  createdAt: meals.createdAt,
  rating: ratingExpr,
  reviewCount: reviewCountExpr,
  likeCount: likeCountExpr,
};

export type MealCard = Awaited<ReturnType<typeof listMeals>>[number];

export const SORTS = {
  newest: "Newest",
  top: "Top rated",
  popular: "Most loved",
  quick: "Quickest",
} as const;
export type Sort = keyof typeof SORTS;

export async function listMeals({
  q,
  category,
  sort = "newest",
  limit,
}: {
  q?: string;
  category?: Category;
  sort?: Sort;
  limit?: number;
} = {}) {
  const term = q?.trim();
  const where = and(
    category ? eq(meals.category, category) : undefined,
    term
      ? or(
          like(meals.title, `%${term}%`),
          like(meals.summary, `%${term}%`),
          like(meals.creator, `%${term}%`),
          like(meals.ingredients, `%${term}%`)
        )
      : undefined
  );

  const order = {
    newest: [desc(meals.createdAt)],
    top: [desc(ratingExpr), desc(reviewCountExpr)],
    popular: [desc(likeCountExpr), desc(ratingExpr)],
    quick: [meals.cookTime],
  }[sort];

  const query = db.select(cardFields).from(meals).where(where).orderBy(...order, desc(meals.id));
  return limit ? query.limit(limit) : query;
}

export async function getMeal(slug: string) {
  return db
    .select({ ...cardFields, ingredients: meals.ingredients, steps: meals.steps })
    .from(meals)
    .where(eq(meals.slug, slug))
    .get();
}

export async function getRelated(category: Category, excludeId: number) {
  return db
    .select(cardFields)
    .from(meals)
    .where(and(eq(meals.category, category), ne(meals.id, excludeId)))
    .orderBy(desc(ratingExpr))
    .limit(3)
    .all();
}

export async function getReviews(mealId: number) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.mealId, mealId))
    .orderBy(desc(reviews.createdAt), desc(reviews.id))
    .all();
}

export async function hasLiked(mealId: number, visitorId: string | undefined) {
  if (!visitorId) return false;
  const row = await db
    .select({ mealId: likes.mealId })
    .from(likes)
    .where(and(eq(likes.mealId, mealId), eq(likes.visitorId, visitorId)))
    .get();
  return !!row;
}

export async function getCategoryCounts() {
  const rows = await db
    .select({ category: meals.category, n: count() })
    .from(meals)
    .groupBy(meals.category)
    .all();
  const byName = new Map(rows.map((r) => [r.category, r.n]));
  return CATEGORIES.map((c) => ({ category: c, count: byName.get(c) ?? 0 }));
}

export async function getStats() {
  const [m, r, l] = await Promise.all([
    db
    .select({ recipes: count(), cooks: countDistinct(meals.creatorEmail) })
    .from(meals)
    .get(),
    db.select({ n: count() }).from(reviews).get(),
    db.select({ n: count() }).from(likes).get(),
  ]);
  return { recipes: m!.recipes, cooks: m!.cooks, reviews: r!.n, likes: l!.n };
}

export async function getTopCooks(limit = 5) {
  return db
    .select({
      name: meals.creator,
      recipes: count(),
      likes: sql<number>`sum(${likeCountExpr})`.mapWith(Number),
      rating: sql<number>`avg(nullif(${ratingExpr}, 0))`.mapWith(Number),
    })
    .from(meals)
    .groupBy(meals.creatorEmail)
    .orderBy(desc(sql`count(*)`), desc(sql`sum(${likeCountExpr})`))
    .limit(limit)
    .all();
}
