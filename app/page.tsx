import Link from "next/link";
import { ArrowRight, ChefHat, Search, Share2 } from "lucide-react";
import HeroSlideshow from "@/components/hero-slideshow";
import MealCard from "@/components/meal-card";
import { getCategoryCounts, getStats, listMeals } from "@/lib/queries";

export const dynamic = "force-dynamic";

const steps = [
  {
    icon: Search,
    title: "Discover",
    body: "Search by dish, ingredient or cook. Filter by cuisine and sort by what the community loves most.",
  },
  {
    icon: ChefHat,
    title: "Cook",
    body: "Clear ingredient checklists and numbered steps you can follow with flour on your hands.",
  },
  {
    icon: Share2,
    title: "Share",
    body: "Post your own dish in two minutes. Collect likes and reviews from people who made it.",
  },
];

export default async function Home() {
  const [featured, latest, stats, categories] = await Promise.all([
    listMeals({ sort: "top", limit: 3 }),
    listMeals({ sort: "newest", limit: 6 }),
    getStats(),
    getCategoryCounts(),
  ]);

  return (
    <>
      <section className="container-page grid items-center gap-12 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div className="animate-fade-up">
          <p className="eyebrow">The community cookbook</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Cook something <em className="font-normal text-accent">worth</em> sharing.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Home recipes from real cooks — tested in real kitchens, rated by the people who made them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/meals" className="btn-primary px-6 py-3 text-base">
              Explore recipes <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/meals/share" className="btn-ghost px-6 py-3 text-base">
              Share yours
            </Link>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["Recipes", stats.recipes],
              ["Home cooks", stats.cooks],
              ["Reviews", stats.reviews],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
                <dd className="mt-1 font-display text-3xl font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="animate-fade-up [animation-delay:150ms]">
          <HeroSlideshow slides={latest} />
        </div>
      </section>

      <section className="container-page" aria-labelledby="browse">
        <h2 id="browse" className="sr-only">Browse by cuisine</h2>
        <ul className="flex flex-wrap gap-2">
          {categories.map(({ category, count }) => (
            <li key={category}>
              <Link
                href={`/meals?category=${category}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                {category}
                <span className="rounded-full bg-surface-2 px-2 text-xs text-muted">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-20" aria-labelledby="featured">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Community favourites</p>
            <h2 id="featured" className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Top rated this season
            </h2>
          </div>
          <Link href="/meals?sort=top" className="hidden items-center gap-1 text-sm font-semibold text-accent hover:underline sm:inline-flex">
            See all <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((meal) => (
            <li key={meal.id}>
              <MealCard meal={meal} />
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-24" aria-labelledby="how">
        <div className="rounded-[2rem] bg-surface-2 px-6 py-14 sm:px-12">
          <p className="eyebrow text-center">How it works</p>
          <h2 id="how" className="mt-2 text-center font-display text-3xl font-semibold sm:text-4xl">
            From someone&apos;s kitchen to yours
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface text-accent shadow-sm">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  <span className="text-muted">0{i + 1}.</span> {title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-accent px-6 py-16 text-center text-accent-ink sm:px-12">
          <h2 className="font-display text-3xl font-semibold sm:text-5xl">
            Got a dish people always ask for?
          </h2>
          <p className="mx-auto mt-4 max-w-md opacity-85">
            Write it down once. Let the whole community cook it.
          </p>
          <Link
            href="/meals/share"
            className="btn mt-8 bg-accent-ink px-6 py-3 text-base text-accent hover:opacity-90"
          >
            Share your recipe <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
