"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { addReview, type FormState } from "@/lib/actions";
import { cn } from "@/lib/utils";
import FieldError from "./field-error";

export default function ReviewForm({ mealId, slug }: { mealId: number; slug: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    addReview.bind(null, mealId, slug),
    {}
  );
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <form
      action={action}
      onReset={() => setRating(0)}
      className="card space-y-4 p-6"
    >
      <h3 className="font-display text-xl font-semibold">Made it? Leave a review</h3>
      {state.ok && (
        <p role="status" className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
          {state.message}
        </p>
      )}

      <fieldset>
        <legend className="label">Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                className="peer sr-only"
              />
              <Star
                className={cn(
                  "size-7 transition peer-focus-visible:scale-110",
                  n <= shown ? "text-gold" : "text-line"
                )}
                fill="currentColor"
                strokeWidth={0}
              />
              <span className="sr-only">{n} star{n > 1 && "s"}</span>
            </label>
          ))}
        </div>
        <FieldError errors={state.errors?.rating} />
      </fieldset>

      <div>
        <label htmlFor="author" className="label">Name</label>
        <input
          id="author"
          name="author"
          className="field"
          defaultValue={state.values?.author}
          aria-invalid={!!state.errors?.author}
          required
          maxLength={60}
        />
        <FieldError errors={state.errors?.author} />
      </div>
      <div>
        <label htmlFor="body" className="label">Review</label>
        <textarea
          id="body"
          name="body"
          rows={3}
          className="field resize-y"
          placeholder="How did it turn out? Any tweaks?"
          defaultValue={state.values?.body}
          aria-invalid={!!state.errors?.body}
          required
          maxLength={1000}
        />
        <FieldError errors={state.errors?.body} />
      </div>
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
