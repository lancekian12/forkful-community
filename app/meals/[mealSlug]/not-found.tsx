import Link from "next/link";

export default function MealNotFound() {
  return (
    <div className="container-page py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">This recipe has left the kitchen</h1>
      <p className="mt-3 text-muted">It may have been renamed or never existed.</p>
      <Link href="/meals" className="btn-primary mt-8">Browse recipes</Link>
    </div>
  );
}
