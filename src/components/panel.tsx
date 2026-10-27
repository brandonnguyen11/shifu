import type { ReactNode } from "react";

import { cn } from "cn";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border border-zinc-200", className)}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  note,
  action,
}: {
  title: string;
  note?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 py-3">
      <div>
        <p className="text-[13px] font-medium text-zinc-900">{title}</p>
        {note ? <p className="text-[12px] text-zinc-500">{note}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <p className="text-[13px] text-zinc-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-zinc-950">
        {value}
      </p>
      {note ? <p className="mt-1 text-[12px] text-zinc-500">{note}</p> : null}
    </div>
  );
}

const toneStyles = {
  neutral: "border-zinc-200 text-zinc-600",
  positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  critical: "border-red-200 bg-red-50 text-red-700",
} as const;

export function StatusPill({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof toneStyles;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[12px] whitespace-nowrap",
        toneStyles[tone]
      )}
    >
      {children}
    </span>
  );
}

export function MasteryBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-100">
      <div className="h-full bg-zinc-900" style={{ width: `${value}%` }} />
    </div>
  );
}
