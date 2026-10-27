import { Panel, PanelHeader, StatCard, StatusPill } from "@/components/panel";
import { StudentShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { studentSessions } from "@/lib/data";

const summary = {
  date: "September 11",
  covered: ["Quadratic formula", "Discriminant", "Choosing a solving method"],
  performance: "Solved 7 of 10 practice problems without help.",
  weakness: "Sign errors when the leading coefficient is negative.",
  next: "Ten targeted factoring questions, then mixed quadratics.",
};

export default function StudentSessionsPage() {
  const upcoming = studentSessions.filter((item) => item.state === "Upcoming");
  const past = studentSessions.filter((item) => item.state !== "Upcoming");

  return (
    <StudentShell
      title="Sessions"
      subtitle="Upcoming and past sessions with Sarah Wilson"
      actions={
        <>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Request reschedule
          </span>
          <span className={buttonVariants({ size: "sm" })}>Book a session</span>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Completed" value="24" note="this term" />
        <StatCard label="Attendance" value="96%" note="1 missed session" />
        <StatCard label="Sessions left" value="3" note="in your 5 session package" />
      </div>

      <Panel className="mt-4">
        <PanelHeader title="Upcoming" note={`${upcoming.length} scheduled`} />
        <div className="divide-y divide-zinc-100">
          {upcoming.map((session) => (
            <div
              key={session.date}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
            >
              <div>
                <p className="text-[13px] font-medium text-zinc-900">
                  {session.date}
                </p>
                <p className="text-[12px] text-zinc-500">{session.topic}</p>
              </div>
              <span className={buttonVariants({ size: "xs" })}>Join session</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-4">
        <PanelHeader title="Past sessions" note={`${past.length} sessions`} />
        <div className="divide-y divide-zinc-100">
          {past.map((session) => (
            <div
              key={session.date}
              className="flex items-center justify-between gap-4 px-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-zinc-900">
                  {session.date}
                </p>
                <p className="truncate text-[12px] text-zinc-500">
                  {session.topic}
                </p>
              </div>
              <StatusPill tone={session.state === "Missed" ? "critical" : "neutral"}>
                {session.state}
              </StatusPill>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-4">
        <PanelHeader
          title={`Session summary — ${summary.date}`}
          note="Written by Sarah after your last session"
        />
        <div className="space-y-4 p-4 text-[13px] leading-5 text-zinc-600">
          <div>
            <p className="text-[12px] font-medium text-zinc-500">
              Topics covered
            </p>
            <p className="mt-1 text-zinc-700">{summary.covered.join(" · ")}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium text-zinc-500">Performance</p>
            <p className="mt-1 text-zinc-700">{summary.performance}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium text-zinc-500">
              What to work on
            </p>
            <p className="mt-1 text-zinc-700">{summary.weakness}</p>
          </div>
          <div>
            <p className="text-[12px] font-medium text-zinc-500">Next session</p>
            <p className="mt-1 text-zinc-700">{summary.next}</p>
          </div>
        </div>
      </Panel>
    </StudentShell>
  );
}
