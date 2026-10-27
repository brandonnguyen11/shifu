import Link from "next/link";
import { Search } from "lucide-react";

import { MasteryBar, Panel, StatusPill } from "@/components/panel";
import { TutorShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { students } from "@/lib/data";

const filters = ["All", "Active", "Needs focus", "Trials", "Archived"];

export default function StudentsPage() {
  return (
    <TutorShell
      title="Students"
      subtitle={`${students.length} students on your roster`}
      actions={
        <>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Import
          </span>
          <span className={buttonVariants({ size: "sm" })}>Add student</span>
        </>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {filters.map((filter, index) => (
            <span
              key={filter}
              className={`cursor-default rounded-md px-2.5 py-1.5 text-[13px] ${
                index === 0
                  ? "bg-zinc-100 font-medium text-zinc-900"
                  : "text-zinc-600"
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search students, subjects, notes"
            className="h-9 pl-8"
          />
        </div>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <div className="hidden grid-cols-[1.4fr_1fr_1fr_200px_120px] gap-4 border-b border-zinc-200 bg-zinc-50/60 px-4 py-2.5 text-[12px] font-medium text-zinc-500 lg:grid">
          <span>Student</span>
          <span>Subject</span>
          <span>Next session</span>
          <span>Mastery</span>
          <span className="text-right">Status</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/tutor/students/${student.id}`}
              className="grid gap-3 px-4 py-4 transition-colors hover:bg-zinc-50 lg:grid-cols-[1.4fr_1fr_1fr_200px_120px] lg:items-center lg:gap-4"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700">
                  {student.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium text-zinc-900">
                    {student.name}
                  </span>
                  <span className="block truncate text-[12px] text-zinc-500">
                    {student.grade} · {student.cadence}
                  </span>
                </span>
              </span>

              <span className="text-[13px] text-zinc-600">{student.subject}</span>

              <span className="text-[13px] text-zinc-600">
                {student.nextSession}
              </span>

              <span className="flex items-center gap-3">
                <MasteryBar value={student.mastery} />
                <span className="w-9 shrink-0 text-[12px] text-zinc-600 tabular-nums">
                  {student.mastery ? `${student.mastery}%` : "—"}
                </span>
              </span>

              <span className="lg:justify-self-end">
                <StatusPill
                  tone={
                    student.status === "On track"
                      ? "positive"
                      : student.status === "Late work"
                        ? "critical"
                        : student.status === "Trial"
                          ? "warning"
                          : "neutral"
                  }
                >
                  {student.status}
                </StatusPill>
              </span>
            </Link>
          ))}
        </div>
      </Panel>
    </TutorShell>
  );
}
