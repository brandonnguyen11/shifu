import Link from "next/link";

import {
  MasteryBar,
  Panel,
  PanelHeader,
  StatCard,
  StatusPill,
} from "@/components/panel";
import { StudentShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { binder, getStudent, studentWork } from "@/lib/data";

export default function StudentRoomPage() {
  const student = getStudent("emma-reyes")!;
  const due = studentWork.filter((item) => item.state === "Not started");

  return (
    <StudentShell
      title="My room"
      subtitle={`${student.subject} with Sarah Wilson`}
      actions={
        <>
          <Link
            href="/student/messages"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Message tutor
          </Link>
          <span className={buttonVariants({ size: "sm" })}>Join session</span>
        </>
      }
    >
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[13px] text-zinc-500">Next session</p>
            <p className="mt-1 text-lg font-medium tracking-[-0.01em] text-zinc-900">
              Today at 4:00 PM with Sarah Wilson
            </p>
            <p className="mt-1 text-[13px] text-zinc-600">
              Planned: factoring accuracy, then mixed quadratics practice.
            </p>
          </div>
          <StatusPill tone="positive">Room open</StatusPill>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall mastery"
          value={`${student.mastery}%`}
          note="+6 this month"
        />
        <StatCard label="Attendance" value={`${student.attendance}%`} note="24 of 25 sessions" />
        <StatCard
          label="Assignments"
          value={student.assignmentsComplete}
          note={`${due.length} due now`}
        />
        <StatCard label="Current goal" value="85+" note={student.goal} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Panel>
          <PanelHeader
            title="Your work"
            note={`${due.length} due soon`}
            action={
              <Link
                href="/student/assignments"
                className="text-[12px] text-zinc-500 hover:text-zinc-900"
              >
                View all
              </Link>
            }
          />
          <div className="divide-y divide-zinc-100">
            {studentWork.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 px-4 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-zinc-900">
                    {item.title}
                  </p>
                  <p className="text-[12px] text-zinc-500">{item.due}</p>
                </div>
                <StatusPill
                  tone={item.state === "Not started" ? "warning" : "positive"}
                >
                  {item.score ?? item.state}
                </StatusPill>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Where you stand"
            action={
              <Link
                href="/student/progress"
                className="text-[12px] text-zinc-500 hover:text-zinc-900"
              >
                Details
              </Link>
            }
          />
          <div className="space-y-4 p-4">
            {student.skills.map((skill) => (
              <div key={skill.skill}>
                <div className="mb-2 flex items-center justify-between text-[13px]">
                  <span className="text-zinc-600">{skill.skill}</span>
                  <span className="text-zinc-900 tabular-nums">
                    {skill.mastery}%
                  </span>
                </div>
                <MasteryBar value={skill.mastery} />
              </div>
            ))}
            <p className="border-t border-zinc-100 pt-4 text-[13px] leading-5 text-zinc-600">
              Factoring is your weakest area right now. Sarah added one practice
              set to close the gap before the unit exam.
            </p>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4">
        <PanelHeader
          title="Binder"
          note="Everything your tutor has shared with you"
        />
        <div className="grid divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-y-0">
          {binder.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between gap-4 px-4 py-3.5 sm:border-b sm:border-zinc-100"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] text-zinc-700">{file.name}</p>
                <p className="text-[12px] text-zinc-400">
                  {file.type} · {file.size}
                </p>
              </div>
              <span className="shrink-0 text-[12px] text-zinc-400">Open</span>
            </div>
          ))}
        </div>
      </Panel>
    </StudentShell>
  );
}
