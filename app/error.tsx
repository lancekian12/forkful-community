"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-32 text-center">
      <p className="eyebrow">Something burned</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">We couldn&apos;t load this page</h1>
      <p className="mt-3 text-muted">Give it another try in a moment.</p>
      <button type="button" onClick={reset} className="btn-primary mt-8">Try again</button>
    </div>
  );
}
