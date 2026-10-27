import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/tutor", label: "Tutor workspace" },
      { href: "/student/room", label: "Student room" },
      { href: "/#demo", label: "Product demo" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/about#mission", label: "Mission" },
      { href: "/about#careers", label: "Careers" },
      { href: "/about#contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/trust#ferpa", label: "FERPA" },
      { href: "/trust#coppa", label: "COPPA" },
      { href: "/trust#terms", label: "Terms of service" },
      { href: "/trust#privacy", label: "Privacy policy" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/trust#security", label: "Security" },
      { href: "/trust#dpa", label: "Data processing" },
      { href: "/trust#subprocessors", label: "Subprocessors" },
      { href: "/trust#status", label: "Status" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr] lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-[7px] bg-zinc-900">
                <span className="size-2 rounded-[2px] bg-white" />
              </span>
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-900">
                Roomline
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              A tutoring operating system built around the student room, the
              tutor workspace, and the work that connects them.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:contents">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[13px] font-medium text-zinc-900">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-zinc-500">
            © {new Date().getFullYear()} Roomline, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[13px] text-zinc-500">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
            <div className="flex items-center gap-5">
              {["X", "LinkedIn", "GitHub"].map((social) => (
                <Link
                  key={social}
                  href="/"
                  className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
