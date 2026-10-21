import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import MealCard, { MealCardSkeleton } from "@/components/meal-card";
import MealsToolbar from "@/components/meals-toolbar";
import { CATEGORIES, type Category } from "@/db/schema";
import { listMeals, SORTS, type Sort } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Browse every recipe shared by the Forkful community.",
};

type SearchParams = Promise<{ q?: string; category?: string; sort?: string }>;

export default async function MealsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, category, sort } = await searchParams;
  const filters = {
    q: q?.slice(0, 100),
    category: CATEGORIES.includes(category as Category) ? (category as Category) : undefined,
    sort: sort && sort in SORTS ? (sort as Sort) : undefined,
  };

  return (
    <div className="container-page pt-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Recipes</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Delicious meals, created <em className="font-normal text-accent">by you</em>
        </h1>
        <p className="mt-4 text-lg text-muted">
          Every dish here was shared by someone who cooks it at home. Find your next favourite.
        </p>
      </header>

      <div className="mt-10">
        <Suspense>
          <MealsToolbar />
        </Suspense>
      </div>

      <Suspense key={JSON.stringify(filters)} fallback={<GridSkeleton />}>
        <MealsGrid {...filters} />
      </Suspense>
    </div>
  );
}

async function MealsGrid(filters: Parameters<typeof listMeals>[0]) {
  const meals = await listMeals(filters);

  if (!meals.length) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-line px-6 py-20 text-center">
        <SearchX className="mx-auto size-10 text-muted" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-semibold">Nothing cooking here yet</h2>
        <p className="mt-2 text-muted">Try another search — or be the first to share this dish.</p>
        <Link href="/meals/share" className="btn-primary mt-6">
          Share a recipe
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {meals.length} {meals.length === 1 ? "recipe" : "recipes"}
      </p>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal, i) => (
          <li key={meal.id}>
            <MealCard meal={meal} priority={i < 3} />
          </li>
        ))}
      </ul>
    </>
  );
}

function GridSkeleton() {
  return (
    <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i}>
          <MealCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
