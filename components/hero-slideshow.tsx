"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MealImage from "./meal-image";

type Slide = { slug: string; title: string; image: string; creator: string };

export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;
  const current = slides[index];

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-surface-2 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.45)] sm:aspect-square lg:aspect-[4/5]">
      {slides.map((s, i) => (
        <MealImage
          key={s.slug}
          src={s.image}
          alt={s.title}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 480px, 100vw"
          className={cn(
            "object-cover transition-all duration-1000 ease-out",
            i === index ? "scale-100 opacity-100" : "scale-110 opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

      <Link
        href={`/meals/${current.slug}`}
        className="group absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-surface/90 p-4 backdrop-blur-md transition hover:bg-surface"
      >
        <div className="min-w-0">
          <p className="text-xs text-muted">Cooking now · by {current.creator}</p>
          <p className="truncate font-display text-lg font-semibold">{current.title}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition group-hover:rotate-45">
          <ArrowUpRight className="size-5" aria-hidden />
        </span>
      </Link>

      <div className="absolute right-5 top-5 flex gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.title}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full bg-white/60 transition-all",
              i === index ? "w-6 bg-white" : "w-1.5 hover:bg-white/90"
            )}
          />
        ))}
      </div>
    </div>
  );
}
