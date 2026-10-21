import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative size-[1em]">
            <Star className="absolute inset-0 size-full text-line" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="size-[1em] text-gold" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function RatingSummary({ rating, count }: { rating: number; count: number }) {
  if (!count) return <span className="text-sm text-muted">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <Stars value={rating} />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      <span className="text-muted">({count})</span>
      <span className="sr-only">
        Rated {rating.toFixed(1)} out of 5 from {count} {count === 1 ? "review" : "reviews"}
      </span>
    </span>
  );
}
