"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import type { NavItem } from "@/lib/nav";

type WorkspaceShellProps = {
  role: string;
  name: string;
  initials: string;
  nav: NavItem[];
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function WorkspaceShell({
  role,
  name,
  initials,
  nav,
  title,
  subtitle,
  actions,
  children,
}: WorkspaceShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === pathname || (href !== "/tutor" && pathname.startsWith(`${href}/`));

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-zinc-200 lg:w-60 lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center justify-between border-zinc-200 px-5 lg:border-b">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-6 place-items-center rounded-[7px] bg-zinc-900">
              <span className="size-2 rounded-[2px] bg-white" />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-900">
              Roomline
            </span>
          </Link>
          <span className="text-[11px] tracking-wide text-zinc-400 uppercase">
            {role}
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-zinc-200 p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:border-t-0">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                isActive(item.href)
                  ? "bg-zinc-100 font-medium text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden border-t border-zinc-200 p-3 lg:block">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-zinc-900">
                {name}
              </p>
              <p className="truncate text-[11px] text-zinc-500">{role}</p>
            </div>
          </div>
          <div className="mt-1 flex flex-col items-start">
            <Link
              href="/auth/continue"
              className="rounded-md px-2 py-1 text-[12px] text-zinc-500 transition-colors hover:text-zinc-900"
            >
              Switch workspace
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="cursor-pointer rounded-md px-2 py-1 text-[12px] text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-6 py-4 lg:h-16 lg:py-0">
          <div>
            <h1 className="text-[15px] font-medium tracking-[-0.01em] text-zinc-900">
              {title}
            </h1>
            <p className="text-[13px] text-zinc-500">{subtitle}</p>
          </div>
          {actions ? <div className="flex gap-2">{actions}</div> : null}
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
