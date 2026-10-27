import Link from "next/link";

import { MasteryBar, Panel, PanelHeader, StatCard, StatusPill } from "@/components/panel";
import { TutorShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { students, todaySchedule, tutorAssignments } from "@/lib/data";

const attention = [
  {
    student: "Emma Reyes",
    id: "emma-reyes",
    signal: "Factoring mastery fell 9 points after the Sep 5 quiz.",
    suggestion: "Open today's session with sign-error drills, then mixed practice.",
  },
  {
    student: "Michael Tran",
    id: "michael-tran",
    signal: "Trial finished yesterday with no follow-up booked.",
    suggestion: "Send package options while the session is still fresh.",
  },
  {
    student: "James Keller",
    id: "james-keller",
    signal: "SAT practice section 3 is three days overdue.",
    suggestion: "Send a reminder and split the set into two shorter ones.",
  },
];

export default function TutorDashboard() {
  const needsGrading = tutorAssignments.filter(
    (item) => item.state === "Needs grading"
  ).length;

  return (
    <TutorShell
      title="Today"
      subtitle="Sunday, September 13"
      actions={
        <>
          <Link
            href="/tutor/calendar"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Open calendar
          </Link>
          <Link href="/tutor/students" className={buttonVariants({ size: "sm" })}>
            Add student
          </Link>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sessions today" value="4" note="2 need prep" />
        <StatCard label="Active students" value="18" note="+3 this month" />
        <StatCard
          label="Awaiting review"
          value={`${needsGrading + 8}`}
          note="grades and session notes"
        />
        <StatCard label="Revenue this month" value="$3,240" note="+18% vs August" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <Panel>
          <PanelHeader
            title="Today's schedule"
            note="4 sessions, 3.5 hours booked"
            action={
              <Link
                href="/tutor/calendar"
                className="text-[12px] text-zinc-500 hover:text-zinc-900"
              >
                View week
              </Link>
            }
          />
          <div className="divide-y divide-zinc-100">
            {todaySchedule.map((item) => (
              <Link
                key={item.time}
                href={`/tutor/students/${item.studentId}`}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-zinc-50"
              >
                <span className="w-16 shrink-0 text-[13px] text-zinc-500 tabular-nums">
                  {item.time}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-zinc-900">
                    {item.student}
                  </span>
                  <span className="block text-[12px] text-zinc-500">
                    {item.subject} · {item.length}
                  </span>
                </span>
                <StatusPill
                  tone={item.state === "Needs plan" ? "warning" : "neutral"}
                >
                  {item.state}
                </StatusPill>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Needs your attention"
            note="Suggestions stay drafts until you approve them."
          />
          <div className="divide-y divide-zinc-100">
            {attention.map((item) => (
              <div key={item.id} className="px-4 py-4">
                <Link
                  href={`/tutor/students/${item.id}`}
                  className="text-[13px] font-medium text-zinc-900 hover:underline"
                >
                  {item.student}
                </Link>
                <p className="mt-1 text-[13px] leading-5 text-zinc-500">
                  {item.signal}
                </p>
                <p className="mt-2 text-[13px] leading-5 text-zinc-900">
                  {item.suggestion}
                </p>
                <div className="mt-3 flex gap-2">
                  <span className={buttonVariants({ size: "xs" })}>Approve</span>
                  <span className={buttonVariants({ variant: "outline", size: "xs" })}>
                    Edit
                  </span>
                  <span className={buttonVariants({ variant: "ghost", size: "xs" })}>
                    Dismiss
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-4">
        <PanelHeader
          title="Roster"
          note="18 active students"
          action={
            <Link
              href="/tutor/students"
              className="text-[12px] text-zinc-500 hover:text-zinc-900"
            >
              View all
            </Link>
          }
        />
        <div className="divide-y divide-zinc-100">
          {students.slice(0, 4).map((student) => (
            <Link
              key={student.id}
              href={`/tutor/students/${student.id}`}
              className="grid items-center gap-4 px-4 py-3.5 transition-colors hover:bg-zinc-50 sm:grid-cols-[1.2fr_1fr_200px_110px]"
            >
              <span className="text-[13px] font-medium text-zinc-900">
                {student.name}
              </span>
              <span className="hidden text-[13px] text-zinc-600 sm:block">
                {student.subject}
              </span>
              <span className="flex items-center gap-3">
                <MasteryBar value={student.mastery} />
                <span className="w-9 shrink-0 text-[12px] text-zinc-600 tabular-nums">
                  {student.mastery}%
                </span>
              </span>
              <span className="justify-self-start sm:justify-self-end">
                <StatusPill
                  tone={
                    student.status === "On track"
                      ? "positive"
                      : student.status === "Late work"
                        ? "critical"
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
