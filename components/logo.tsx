import Link from "next/link";
import LogoMark from "./logo-mark";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Forkful home">
      <LogoMark className="size-9 shrink-0 transition group-hover:rotate-[-8deg]" />
      <span className="sr-only whitespace-nowrap font-display text-xl font-semibold tracking-tight sm:not-sr-only">
        Fork<span className="italic text-accent">ful</span>
      </span>
    </Link>
  );
}
