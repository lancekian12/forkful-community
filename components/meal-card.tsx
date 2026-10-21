import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import type { MealCard as MealCardData } from "@/lib/queries";
import { formatMinutes } from "@/lib/utils";
import MealImage from "./meal-image";
import { RatingSummary } from "./rating";

export default function MealCard({ meal, priority }: { meal: MealCardData; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgb(0_0_0/0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <MealImage
          src={meal.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          {meal.category}
        </span>
        {meal.likeCount > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
            <Heart className="size-3.5 text-accent" fill="currentColor" aria-hidden />
            {meal.likeCount}
            <span className="sr-only">likes</span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <RatingSummary rating={meal.rating} count={meal.reviewCount} />
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Clock className="size-3.5" aria-hidden />
            {formatMinutes(meal.cookTime)}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold leading-snug">
          <Link href={`/meals/${meal.slug}`} className="after:absolute after:inset-0">
            {meal.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{meal.summary}</p>
        <p className="mt-auto pt-2 text-xs text-muted">
          by <span className="font-medium text-ink">{meal.creator}</span> · {meal.difficulty}
        </p>
      </div>
    </article>
  );
}

export function MealCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="aspect-[4/3] animate-pulse bg-surface-2" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}
