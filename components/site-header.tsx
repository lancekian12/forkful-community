import Link from "next/link";
import { Plus } from "lucide-react";
import Logo from "./logo";
import NavLinks from "./nav-links";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-6">
          <NavLinks />
          <Link href="/meals/share" className="btn-primary px-3 sm:px-5">
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Share a recipe</span>
            <span className="sr-only sm:hidden">Share a recipe</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
