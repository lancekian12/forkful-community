"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { shareMeal, type FormState } from "@/lib/actions";
import { CATEGORIES, DIFFICULTIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import FieldError from "./field-error";
import ImagePicker from "./image-picker";

export default function ShareMealForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(shareMeal, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};

  const field = (name: string) => ({
    id: name,
    name,
    defaultValue: v[name],
    "aria-invalid": !!e[name] || undefined,
    "aria-describedby": e[name] ? `${name}-error` : undefined,
  });

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-[1fr_20rem]" noValidate>
      <div className="space-y-8">
        <Section title="The dish">
          <div>
            <label htmlFor="title" className="label">Recipe title</label>
            <input {...field("title")} className="field" placeholder="e.g. Grandma's Sunday lasagne" maxLength={80} />
            <FieldError errors={e.title} />
          </div>
          <div>
            <label htmlFor="summary" className="label">Short summary</label>
            <textarea {...field("summary")} rows={2} className="field resize-y" maxLength={220} placeholder="What makes it special? One or two sentences." />
            <FieldError errors={e.summary} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="label">Category</label>
              <select {...field("category")} defaultValue={v.category ?? ""} className="field">
                <option value="" disabled>Choose…</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <FieldError errors={e.category} />
            </div>
            <fieldset>
              <legend className="label">Difficulty</legend>
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-surface p-1">
                {DIFFICULTIES.map((d) => (
                  <label key={d} className="cursor-pointer">
                    <input type="radio" name="difficulty" value={d} defaultChecked={(v.difficulty ?? "Easy") === d} className="peer sr-only" />
                    <span className="block rounded-lg py-2 text-center text-sm font-medium text-muted transition peer-checked:bg-ink peer-checked:text-bg peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                      {d}
                    </span>
                  </label>
                ))}
              </div>
              <FieldError errors={e.difficulty} />
            </fieldset>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cookTime" className="label">Total time (minutes)</label>
              <input {...field("cookTime")} type="number" inputMode="numeric" min={1} className="field" placeholder="45" />
              <FieldError errors={e.cookTime} />
            </div>
            <div>
              <label htmlFor="servings" className="label">Servings</label>
              <input {...field("servings")} type="number" inputMode="numeric" min={1} className="field" placeholder="4" />
              <FieldError errors={e.servings} />
            </div>
          </div>
        </Section>

        <Section title="Ingredients & method" hint="One item per line. Numbers and bullets are cleaned up for you.">
          <div>
            <label htmlFor="ingredients" className="label">Ingredients</label>
            <textarea {...field("ingredients")} rows={6} className="field resize-y font-mono text-[13px]" placeholder={"500g pasta\n2 cloves garlic\n…"} />
            <FieldError errors={e.ingredients} />
          </div>
          <div>
            <label htmlFor="steps" className="label">Steps</label>
            <textarea {...field("steps")} rows={8} className="field resize-y" placeholder={"Bring a large pot of salted water to the boil.\nMeanwhile, gently fry the garlic…"} />
            <FieldError errors={e.steps} />
          </div>
        </Section>

        <Section title="About you" hint="Your email is never shown publicly.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="creator" className="label">Your name</label>
              <input {...field("creator")} className="field" autoComplete="name" maxLength={60} />
              <FieldError errors={e.creator} />
            </div>
            <div>
              <label htmlFor="creatorEmail" className="label">Email</label>
              <input {...field("creatorEmail")} type="email" className="field" autoComplete="email" />
              <FieldError errors={e.creatorEmail} />
            </div>
          </div>
        </Section>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div>
          <p className="label">Photo</p>
          <ImagePicker name="image" invalid={!!e.image} />
          <FieldError errors={e.image} />
          {e.image === undefined && state.errors && (
            <p className="mt-1.5 text-xs text-muted">Re-select your photo before submitting again.</p>
          )}
        </div>
        {state.message && !state.ok && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {state.message}
          </p>
        )}
        <button type="submit" disabled={pending} className={cn("btn-primary w-full py-3 text-base")}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {pending ? "Publishing…" : "Publish recipe"}
        </button>
      </aside>
    </form>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="card space-y-5 p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <div>
        <h2 className="font-display text-xl font-semibold" aria-hidden>{title}</h2>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </div>
      {children}
    </fieldset>
  );
}
