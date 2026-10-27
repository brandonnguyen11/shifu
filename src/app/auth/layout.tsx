import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-6 place-items-center rounded-[7px] bg-zinc-900">
            <span className="size-2 rounded-[2px] bg-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-900">
            Roomline
          </span>
        </Link>
      </header>

      <div className="flex flex-1 items-start justify-center px-6 py-12 sm:items-center sm:py-16">
        {children}
      </div>

      <footer className="px-6 py-6">
        <div className="mx-auto flex max-w-sm items-center justify-center gap-5 text-[12px] text-zinc-500">
          <Link href="/trust#terms" className="hover:text-zinc-900">
            Terms
          </Link>
          <Link href="/trust#privacy" className="hover:text-zinc-900">
            Privacy
          </Link>
          <Link href="/trust#ferpa" className="hover:text-zinc-900">
            FERPA
          </Link>
        </div>
      </footer>
    </div>
  );
}
