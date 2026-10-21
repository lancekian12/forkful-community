"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IngredientChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <>
      <ul className="divide-y divide-line">
        {items.map((item, i) => {
          const done = checked.has(i);
          return (
            <li key={i}>
              <label className="flex cursor-pointer items-start gap-3 py-3 text-sm">
                <input type="checkbox" className="peer sr-only" checked={done} onChange={() => toggle(i)} />
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
                    done ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface"
                  )}
                >
                  {done && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                </span>
                <span className={cn("transition", done && "text-muted line-through")}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">
        {checked.size} of {items.length} ready
      </p>
    </>
  );
}
