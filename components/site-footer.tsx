import Link from "next/link";
import Logo from "./logo";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted">
            A community cookbook of dishes people actually make at home.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <p className="font-semibold">Explore</p>
          <p className="font-semibold">Community</p>
          <Link className="text-muted hover:text-ink" href="/meals">All recipes</Link>
          <Link className="text-muted hover:text-ink" href="/community">Our cooks</Link>
          <Link className="text-muted hover:text-ink" href="/meals?sort=top">Top rated</Link>
          <Link className="text-muted hover:text-ink" href="/meals/share">Share a recipe</Link>
        </nav>
      </div>
      <div className="container-page border-t border-line py-6 text-xs text-muted">
        © {new Date().getFullYear()} Forkful. Made with butter and TypeScript.
      </div>
    </footer>
  );
}
