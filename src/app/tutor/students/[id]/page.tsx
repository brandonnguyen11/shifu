import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  MasteryBar,
  Panel,
  PanelHeader,
  StatCard,
  StatusPill,
} from "@/components/panel";
import { TutorShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { getStudent, students, tutorAssignments } from "@/lib/data";

export function generateStaticParams() {
  return students.map((student) => ({ id: student.id }));
}

export default async function StudentDetailPage({
  params,
}: PageProps<"/tutor/students/[id]">) {
  const { id } = await params;
  const student = getStudent(id);
  if (!student) notFound();

  const work = tutorAssignments.filter((item) => item.student === student.name);

  return (
    <TutorShell
      title={student.name}
      subtitle={`${student.subject} · ${student.grade} · Parent: ${student.parent}`}
      actions={
        <>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Message
          </span>
          <span className={buttonVariants({ size: "sm" })}>Start session</span>
        </>
      }
    >
      <Link
        href="/tutor/students"
        className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 transition-colors hover:text-zinc-900"
      >
        <ArrowLeft className="size-3.5" />
        All students
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall mastery"
          value={student.mastery ? `${student.mastery}%` : "—"}
          note={student.goal}
        />
        <StatCard
          label="Attendance"
          value={`${student.attendance}%`}
          note={student.cadence}
        />
        <StatCard
          label="Assignments"
          value={student.assignmentsComplete}
          note="completed this term"
        />
        <StatCard
          label="Next session"
          value={student.nextSession.split(",")[0]}
          note={student.nextSession}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-4">
          <Panel>
            <PanelHeader
              title="Skill mastery"
              note="Built from quizzes, assignments, and session notes"
            />
            <div className="space-y-4 p-4">
              {student.skills.length === 0 ? (
                <p className="text-[13px] text-zinc-500">
                  No assessments yet. Mastery starts tracking after the first
                  graded assignment.
                </p>
              ) : (
                student.skills.map((skill) => (
                  <div key={skill.skill}>
                    <div className="mb-2 flex items-center justify-between text-[13px]">
                      <span className="text-zinc-600">{skill.skill}</span>
                      <span className="flex items-center gap-2">
                        <span
                          className={`text-[12px] tabular-nums ${
                            skill.trend > 0
                              ? "text-emerald-600"
                              : skill.trend < 0
                                ? "text-red-600"
                                : "text-zinc-400"
                          }`}
                        >
                          {skill.trend > 0 ? "+" : ""}
                          {skill.trend}
                        </span>
                        <span className="w-9 text-right text-zinc-900 tabular-nums">
                          {skill.mastery}%
                        </span>
                      </span>
                    </div>
                    <MasteryBar value={skill.mastery} />
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Assigned work" note={`${work.length} items`} />
            <div className="divide-y divide-zinc-100">
              {work.length === 0 ? (
                <p className="px-4 py-6 text-[13px] text-zinc-500">
                  Nothing assigned yet.
                </p>
              ) : (
                work.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-4 py-3.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-zinc-900">
                        {item.title}
                      </p>
                      <p className="text-[12px] text-zinc-500">
                        Due {item.due} · {item.submitted}/{item.total} submitted
                      </p>
                    </div>
                    <StatusPill
                      tone={
                        item.state === "Overdue"
                          ? "critical"
                          : item.state === "Needs grading"
                            ? "warning"
                            : item.state === "Graded"
                              ? "positive"
                              : "neutral"
                      }
                    >
                      {item.state}
                    </StatusPill>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="Notes"
              note="Private notes are never shown to students or parents"
              action={
                <span className={buttonVariants({ variant: "outline", size: "xs" })}>
                  New note
                </span>
              }
            />
            <div className="divide-y divide-zinc-100">
              {student.notes.map((note) => (
                <div key={note.date} className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-zinc-500">{note.date}</span>
                    <StatusPill
                      tone={note.visibility === "Private" ? "warning" : "neutral"}
                    >
                      {note.visibility}
                    </StatusPill>
                  </div>
                  <p className="mt-2 text-[13px] leading-5 text-zinc-700">
                    {note.body}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Strengths and weaknesses" />
            <div className="space-y-4 p-4">
              <div>
                <p className="text-[12px] font-medium text-zinc-500">Strengths</p>
                <ul className="mt-2 space-y-1.5">
                  {student.strengths.map((item) => (
                    <li key={item} className="text-[13px] leading-5 text-zinc-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-zinc-100 pt-4">
                <p className="text-[12px] font-medium text-zinc-500">
                  Needs work
                </p>
                <ul className="mt-2 space-y-1.5">
                  {student.weaknesses.map((item) => (
                    <li key={item} className="text-[13px] leading-5 text-zinc-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Timeline" note="Permanent learning history" />
            <div className="p-4">
              {student.timeline.map((event, index) => (
                <div key={`${event.date}-${event.title}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 size-1.5 rounded-full bg-zinc-900" />
                    {index < student.timeline.length - 1 ? (
                      <span className="w-px flex-1 bg-zinc-200" />
                    ) : null}
                  </div>
                  <div className={index < student.timeline.length - 1 ? "pb-5" : ""}>
                    <p className="text-[12px] text-zinc-400 tabular-nums">
                      {event.date}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium text-zinc-900">
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-[13px] leading-5 text-zinc-500">
                      {event.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </TutorShell>
  );
}
