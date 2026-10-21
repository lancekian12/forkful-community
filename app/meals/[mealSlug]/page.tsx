import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3, CheckCircle2, Clock, Users } from "lucide-react";
import CopyLinkButton from "@/components/copy-link-button";
import IngredientChecklist from "@/components/ingredient-checklist";
import LikeButton from "@/components/like-button";
import MealCard from "@/components/meal-card";
import MealImage from "@/components/meal-image";
import { RatingSummary, Stars } from "@/components/rating";
import ReviewForm from "@/components/review-form";
import { getMeal, getRelated, getReviews, hasLiked } from "@/lib/queries";
import { formatMinutes, initials, timeAgo } from "@/lib/utils";
import { getVisitorId } from "@/lib/visitor";

type Props = {
  params: Promise<{ mealSlug: string }>;
  searchParams: Promise<{ shared?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meal = await getMeal((await params).mealSlug);
  if (!meal) return { title: "Recipe not found" };
  return {
    title: meal.title,
    description: meal.summary,
    openGraph: { title: meal.title, description: meal.summary, images: [meal.image] },
  };
}

export default async function MealDetailPage({ params, searchParams }: Props) {
  const { mealSlug } = await params;
  const { shared } = await searchParams;
  const meal = await getMeal(mealSlug);
  if (!meal) notFound();

  const [reviews, related, liked] = await Promise.all([
    getReviews(meal.id),
    getRelated(meal.category, meal.id),
    getVisitorId().then((id) => hasLiked(meal.id, id)),
  ]);

  const distribution = [5, 4, 3, 2, 1].map((n) => ({
    stars: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <article className="container-page pt-8">
      {shared && (
        <p role="status" className="mb-6 flex items-center gap-2 rounded-2xl bg-accent-soft px-5 py-4 text-sm font-medium text-accent">
          <CheckCircle2 className="size-5" aria-hidden />
          Your recipe is live! Share the link so friends can cook it too.
        </p>
      )}

      <Link href="/meals" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> All recipes
      </Link>

      <header className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-surface-2 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.4)]">
          <MealImage src={meal.image} alt={meal.title} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
        </div>

        <div className="animate-fade-up">
          <Link href={`/meals?category=${meal.category}`} className="eyebrow hover:underline">
            {meal.category}
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {meal.title}
          </h1>
          <div className="mt-4">
            <a href="#reviews" className="hover:underline">
              <RatingSummary rating={meal.rating} count={meal.reviewCount} />
            </a>
          </div>
          <p className="mt-5 text-lg text-muted">{meal.summary}</p>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface">
            {[
              { icon: Clock, label: "Total time", value: formatMinutes(meal.cookTime) },
              { icon: Users, label: "Serves", value: meal.servings },
              { icon: BarChart3, label: "Difficulty", value: meal.difficulty },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-2 py-4 text-center">
                <Icon className="size-4 text-accent" aria-hidden />
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-surface-2 font-semibold">
                {initials(meal.creator)}
              </span>
              <div className="text-sm">
                <p className="text-muted">Recipe by</p>
                <p className="font-semibold">{meal.creator}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <LikeButton mealId={meal.id} slug={meal.slug} liked={liked} count={meal.likeCount} />
              <CopyLinkButton />
            </div>
          </div>
        </div>
      </header>

      <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-2xl font-semibold">Ingredients</h2>
            <p className="mt-1 text-sm text-muted">For {meal.servings} {meal.servings === 1 ? "serving" : "servings"}</p>
            <div className="mt-4">
              <IngredientChecklist items={meal.ingredients} />
            </div>
          </div>
        </aside>

        <section aria-labelledby="method">
          <h2 id="method" className="font-display text-2xl font-semibold">Method</h2>
          <ol className="mt-6 space-y-8">
            {meal.steps.map((step, i) => (
              <li key={i} className="flex gap-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft font-display text-lg font-semibold text-accent">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-[1.05rem] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section id="reviews" aria-labelledby="reviews-title" className="mt-24 scroll-mt-24 border-t border-line pt-16">
        <h2 id="reviews-title" className="font-display text-3xl font-semibold">
          Reviews <span className="text-muted">({reviews.length})</span>
        </h2>
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div className="space-y-8">
            {reviews.length > 0 && (
              <div>
                <p className="font-display text-5xl font-semibold">{meal.rating.toFixed(1)}</p>
                <Stars value={meal.rating} className="mt-2 text-xl" />
                <ul className="mt-5 space-y-1.5">
                  {distribution.map(({ stars, count }) => (
                    <li key={stars} className="flex items-center gap-3 text-sm">
                      <span className="w-3 text-muted">{stars}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <span className="block h-full rounded-full bg-gold" style={{ width: `${(count / reviews.length) * 100}%` }} />
                      </span>
                      <span className="w-4 text-right text-muted">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ReviewForm mealId={meal.id} slug={meal.slug} />
          </div>

          {reviews.length ? (
            <ul className="divide-y divide-line">
              {reviews.map((r) => (
                <li key={r.id} className="py-6 first:pt-0">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-surface-2 text-sm font-semibold">
                      {initials(r.author)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{r.author}</p>
                      <p className="text-xs text-muted">{timeAgo(r.createdAt)}</p>
                    </div>
                    <Stars value={r.rating} className="ml-auto text-sm" />
                    <span className="sr-only">{r.rating} out of 5</span>
                  </div>
                  <p className="mt-3 leading-relaxed text-muted">{r.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No reviews yet. Cook it first and tell everyone how it went.</p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-24">
          <h2 id="related" className="font-display text-3xl font-semibold">
            More {meal.category.toLowerCase()} recipes
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((m) => (
              <li key={m.id}>
                <MealCard meal={m} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
