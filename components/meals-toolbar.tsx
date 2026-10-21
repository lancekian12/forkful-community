"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SORTS = [
  ["newest", "Newest"],
  ["top", "Top rated"],
  ["popular", "Most loved"],
  ["quick", "Quickest"],
] as const;

export default function MealsToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const category = params.get("category");
  const sort = params.get("sort") ?? "newest";

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  // Debounce search-as-you-type.
  useEffect(() => {
    if (query === (params.get("q") ?? "")) return;
    const id = setTimeout(() => update({ q: query.trim() || null }), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search recipes</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes, ingredients or cooks…"
            className="field rounded-full pl-11 pr-11"
          />
          {pending && (
            <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted" aria-label="Loading" />
          )}
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          Sort
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
            className="field w-auto rounded-full py-2.5 pr-8"
          >
            {SORTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {[null, ...CATEGORIES].map((c) => {
          const active = category === c;
          return (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={active}
              onClick={() => update({ category: c })}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                active
                  ? "border-ink bg-ink text-bg"
                  : "border-line bg-surface text-muted hover:border-ink/40 hover:text-ink"
              )}
            >
              {c ?? "All"}
            </button>
          );
        })}
        {(category || params.get("q")) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              update({ category: null, q: null });
            }}
            className="inline-flex items-center gap-1 px-2 text-sm text-accent hover:underline"
          >
            <X className="size-3.5" aria-hidden /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
