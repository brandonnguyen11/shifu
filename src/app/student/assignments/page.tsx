import { Panel, PanelHeader, StatCard, StatusPill } from "@/components/panel";
import { StudentShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { studentWork } from "@/lib/data";

const upNext = {
  title: "Factoring practice set 4",
  due: "Due tomorrow at 11:59 PM",
  detail:
    "12 questions on factoring with negative coefficients, built from your last two quizzes.",
  estimate: "About 25 minutes",
};

export default function StudentAssignmentsPage() {
  const graded = studentWork.filter((item) => item.state === "Graded");

  return (
    <StudentShell
      title="Assignments"
      subtitle="Practice sets, quizzes, and tests from Sarah"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Due now" value="1" note="factoring practice" />
        <StatCard label="Completed" value="12" note="this term" />
        <StatCard label="Average score" value="81%" note="last 5 graded" />
      </div>

      <Panel className="mt-4 bg-zinc-50">
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="max-w-xl">
            <p className="text-[13px] text-zinc-500">Up next</p>
            <p className="mt-1 text-lg font-medium tracking-[-0.01em] text-zinc-900">
              {upNext.title}
            </p>
            <p className="mt-1.5 text-[13px] leading-5 text-zinc-600">
              {upNext.detail}
            </p>
            <p className="mt-2 text-[12px] text-zinc-500">
              {upNext.due} · {upNext.estimate}
            </p>
          </div>
          <span className={buttonVariants({ size: "sm" })}>Start assignment</span>
        </div>
      </Panel>

      <Panel className="mt-4">
        <PanelHeader title="Graded work" note={`${graded.length} items`} />
        <div className="divide-y divide-zinc-100">
          {graded.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-4 px-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-zinc-900">
                  {item.title}
                </p>
                <p className="text-[12px] text-zinc-500">
                  {item.subject} · {item.due}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusPill
                  tone={
                    Number.parseInt(item.score ?? "0", 10) >= 80
                      ? "positive"
                      : "warning"
                  }
                >
                  {item.score}
                </StatusPill>
                <span className="text-[12px] text-zinc-400">Review</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-4">
        <PanelHeader
          title="Feedback from Sarah"
          note="On your most recent quiz"
        />
        <div className="space-y-3 p-4 text-[13px] leading-5 text-zinc-600">
          <p>
            <span className="font-medium text-zinc-900">What worked: </span>
            You set up every equation correctly and showed your steps on the
            word problems.
          </p>
          <p>
            <span className="font-medium text-zinc-900">What to fix: </span>
            Two of the three misses were sign errors on the middle term. Factor
            out the negative before splitting it.
          </p>
        </div>
      </Panel>
    </StudentShell>
  );
}
