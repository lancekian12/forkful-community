"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Props = { mealId: number; slug: string; liked: boolean; count: number };

export default function LikeButton({ mealId, slug, liked, count }: Props) {
  const [, startTransition] = useTransition();
  const [state, setOptimistic] = useOptimistic({ liked, count });

  return (
    <button
      type="button"
      aria-pressed={state.liked}
      onClick={() =>
        startTransition(async () => {
          setOptimistic({ liked: !state.liked, count: state.count + (state.liked ? -1 : 1) });
          await toggleLike(mealId, slug);
        })
      }
      className={cn(
        "btn border",
        state.liked
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-surface hover:border-accent/50"
      )}
    >
      <Heart
        className={cn("size-4 transition-transform", state.liked && "scale-110")}
        fill={state.liked ? "currentColor" : "none"}
        aria-hidden
      />
      {state.liked ? "Loved" : "Love it"}
      <span className="tabular-nums text-muted">{state.count}</span>
    </button>
  );
}
