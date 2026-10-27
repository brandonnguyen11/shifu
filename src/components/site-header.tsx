import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

const links = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/trust", label: "Trust & FERPA" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-6 place-items-center rounded-[7px] bg-zinc-900">
            <span className="size-2 rounded-[2px] bg-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-900">
            Roomline
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/auth/login"
            className={buttonVariants({ variant: "ghost", className: "text-zinc-600" })}
          >
            Sign in
          </Link>
          <Link href="/auth/register" className={buttonVariants()}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
