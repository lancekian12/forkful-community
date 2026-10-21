"use client";

import { useActionState } from "react";
import { subscribe, type FormState } from "@/lib/actions";

export default function SubscribeForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, {});

  if (state.ok) {
    return (
      <p role="status" className="rounded-full bg-accent-ink/15 px-5 py-3 text-sm font-medium">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="w-full max-w-md" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="sub-email" className="sr-only">Email address</label>
        <input
          id="sub-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.values?.email}
          aria-invalid={!!state.errors?.email || undefined}
          className="w-full flex-1 rounded-full border-0 bg-white/95 px-5 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-500 focus:ring-4 focus:ring-white/40"
        />
        <button type="submit" disabled={pending} className="btn bg-accent-ink px-6 py-3 text-accent hover:opacity-90">
          {pending ? "Joining…" : "Join the club"}
        </button>
      </div>
      {state.errors?.email && (
        <p role="alert" className="mt-2 text-sm font-medium">{state.errors.email[0]}</p>
      )}
    </form>
  );
}
