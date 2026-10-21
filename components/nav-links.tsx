"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/meals", label: "Recipes" },
  { href: "/community", label: "Community" },
];

export default function NavLinks() {
  const path = usePathname();

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-1">
        {links.map(({ href, label }) => {
          const active = path === href || (path.startsWith(href + "/") && !path.startsWith("/meals/share"));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition",
                  active ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
