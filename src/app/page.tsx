import Link from "next/link";
import {
  CreditCard,
  Layers,
  LineChart,
  NotebookPen,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const mastery = [
  { skill: "Factoring", value: 61 },
  { skill: "Quadratic equations", value: 82 },
  { skill: "Functions", value: 91 },
];

const timeline = [
  { date: "Sep 12", event: "Quiz graded — 84%, up from 62%" },
  { date: "Sep 10", event: "Assignment assigned — targeted factoring" },
  { date: "Sep 07", event: "Session note — sign errors under time pressure" },
  { date: "Sep 05", event: "Quiz graded — 62%" },
];

const features = [
  {
    icon: Layers,
    title: "Persistent student rooms",
    description:
      "Every student keeps one room with their sessions, notes, assignments, grades, and files. Nothing resets between weeks.",
  },
  {
    icon: NotebookPen,
    title: "Sessions that leave a record",
    description:
      "Run video sessions with notes and a whiteboard, then save a structured summary of what was covered and what comes next.",
  },
  {
    icon: LineChart,
    title: "Mastery from real evidence",
    description:
      "Skill levels are built from quizzes, assignments, and tutor notes together, so progress reflects more than one bad test.",
  },
  {
    icon: CreditCard,
    title: "Trials, packages, payments",
    description:
      "Publish a booking page, run paid trials, sell session packages, and keep the roster and invoices in the same system.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-[13px] text-zinc-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Private beta for independent tutors
            </div>

            <h1 className="mt-7 text-[2.75rem] leading-[1.05] font-semibold tracking-[-0.04em] text-zinc-950 text-balance sm:text-6xl">
              The operating system for tutoring.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Our mission is simple: give every tutor one workspace, every
              student one room, and make sure nothing about a student&apos;s
              learning gets lost between sessions.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/tutor"
                className={buttonVariants({ size: "lg", className: "h-11 px-5 text-[15px]" })}
              >
                Enter tutor workspace
              </Link>
              <Link
                href="/student/room"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-11 border-zinc-300 px-5 text-[15px]",
                })}
              >
                Open student room
              </Link>
            </div>

            <p className="mt-6 text-[13px] text-zinc-500">
              Free for your first two students. FERPA-aligned data handling.
            </p>
          </div>
        </section>

        <section id="demo" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[13px] font-medium text-zinc-500">
                Product demo
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-zinc-950">
                One place for the whole relationship.
              </h2>
            </div>
            <Link
              href="/tutor"
              className="text-sm text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline"
            >
              Explore the live prototype
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.18)]">
            <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-zinc-300" />
                <span className="size-2.5 rounded-full bg-zinc-300" />
                <span className="size-2.5 rounded-full bg-zinc-300" />
              </div>
              <div className="mx-auto w-full max-w-sm rounded-md border border-zinc-200 bg-white px-3 py-1 text-center text-[11px] text-zinc-500">
                app.roomline.com/tutor/students/emma-reyes
              </div>
            </div>

            <div className="grid md:grid-cols-[180px_1fr]">
              <div className="hidden border-r border-zinc-200 bg-zinc-50/60 p-4 md:block">
                <p className="px-2 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                  Workspace
                </p>
                <div className="mt-3 space-y-0.5">
                  {[
                    "Dashboard",
                    "Students",
                    "Calendar",
                    "Assignments",
                    "Messages",
                    "Payments",
                  ].map((item) => (
                    <div
                      key={item}
                      className={`rounded-md px-2 py-1.5 text-[13px] ${
                        item === "Students"
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-600"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-full bg-zinc-100 text-[13px] font-medium text-zinc-700">
                      ER
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-zinc-900">
                        Emma Reyes
                      </p>
                      <p className="text-[13px] text-zinc-500">
                        Algebra II · Grade 10 · Tuesdays and Thursdays
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-zinc-600">
                    Next session in 2h
                  </Badge>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Overall mastery", value: "68%", note: "+6 this month" },
                    { label: "Attendance", value: "96%", note: "24 of 25 sessions" },
                    { label: "Assignments", value: "12/14", note: "1 overdue" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-zinc-200 p-4"
                    >
                      <p className="text-[13px] text-zinc-500">{stat.label}</p>
                      <p className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-zinc-950">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[12px] text-zinc-500">{stat.note}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div className="rounded-lg border border-zinc-200 p-4">
                    <p className="text-[13px] font-medium text-zinc-900">
                      Skill mastery
                    </p>
                    <div className="mt-4 space-y-4">
                      {mastery.map((item) => (
                        <div key={item.skill}>
                          <div className="mb-2 flex items-center justify-between text-[13px]">
                            <span className="text-zinc-600">{item.skill}</span>
                            <span className="text-zinc-900 tabular-nums">
                              {item.value}%
                            </span>
                          </div>
                          <Progress value={item.value} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-200 p-4">
                    <p className="text-[13px] font-medium text-zinc-900">
                      Recent activity
                    </p>
                    <div className="mt-4 space-y-3">
                      {timeline.map((item) => (
                        <div key={item.date} className="flex gap-3">
                          <span className="w-12 shrink-0 text-[12px] text-zinc-400 tabular-nums">
                            {item.date}
                          </span>
                          <span className="text-[13px] leading-5 text-zinc-600">
                            {item.event}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-lg">
                      <p className="text-[13px] font-medium text-zinc-900">
                        Suggested next lesson
                      </p>
                      <p className="mt-1.5 text-[13px] leading-5 text-zinc-600">
                        Factoring accuracy is the outlier at 61%. Spend the first
                        20 minutes on sign errors, then move to mixed quadratics
                        practice.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={buttonVariants({ size: "sm" })}>
                        Add to lesson plan
                      </span>
                      <span
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Dismiss
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50/60">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-[13px] font-medium text-zinc-500">
                Key features
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-zinc-950">
                Four things the platform is built around.
              </h2>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="bg-white p-6">
                  <feature.icon
                    className="size-5 text-zinc-900"
                    strokeWidth={1.75}
                  />
                  <h3 className="mt-5 text-[15px] font-medium tracking-[-0.01em] text-zinc-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-zinc-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
