import { Panel, PanelHeader, StatCard, StatusPill } from "@/components/panel";
import { TutorShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { tutorAssignments } from "@/lib/data";

const gradingQueue = [
  {
    student: "Ava Mitchell",
    title: "Chain rule mixed review",
    submitted: "Submitted 2h ago",
    suggested: "92%",
    confidence: "High confidence",
  },
  {
    student: "Noah Patel",
    title: "Circle theorems proof set",
    submitted: "Submitted yesterday",
    suggested: "88%",
    confidence: "Needs your read on proof 3",
  },
];

export default function AssignmentsPage() {
  return (
    <TutorShell
      title="Assignments"
      subtitle="Quizzes, tests, and practice sets across your roster"
      actions={
        <>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Generate with AI
          </span>
          <span className={buttonVariants({ size: "sm" })}>New assignment</span>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active" value="4" note="assigned and in progress" />
        <StatCard label="Needs grading" value="2" note="suggested grades ready" />
        <StatCard label="Overdue" value="1" note="James Keller" />
        <StatCard label="Completion rate" value="86%" note="last 30 days" />
      </div>

      <Panel className="mt-4">
        <PanelHeader
          title="Grading queue"
          note="Suggested grades are drafts. Nothing reaches a student until you approve it."
        />
        <div className="divide-y divide-zinc-100">
          {gradingQueue.map((item) => (
            <div key={item.title} className="px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium text-zinc-900">
                    {item.title}
                  </p>
                  <p className="text-[12px] text-zinc-500">
                    {item.student} · {item.submitted}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-medium text-zinc-900">
                    Suggested {item.suggested}
                  </p>
                  <p className="text-[12px] text-zinc-500">{item.confidence}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className={buttonVariants({ size: "xs" })}>
                  Approve grade
                </span>
                <span className={buttonVariants({ variant: "outline", size: "xs" })}>
                  Edit grade
                </span>
                <span className={buttonVariants({ variant: "outline", size: "xs" })}>
                  Edit feedback
                </span>
                <span className={buttonVariants({ variant: "ghost", size: "xs" })}>
                  Reject
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-4 overflow-hidden">
        <PanelHeader title="All assignments" note={`${tutorAssignments.length} items`} />
        <div className="hidden grid-cols-[1.6fr_1fr_100px_140px_130px] gap-4 border-b border-zinc-200 bg-zinc-50/60 px-4 py-2.5 text-[12px] font-medium text-zinc-500 lg:grid">
          <span>Assignment</span>
          <span>Student</span>
          <span>Due</span>
          <span>Progress</span>
          <span className="text-right">Status</span>
        </div>
        <div className="divide-y divide-zinc-100">
          {tutorAssignments.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 px-4 py-3.5 lg:grid-cols-[1.6fr_1fr_100px_140px_130px] lg:items-center lg:gap-4"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-zinc-900">
                  {item.title}
                </p>
                <p className="text-[12px] text-zinc-500">{item.subject}</p>
              </div>
              <span className="text-[13px] text-zinc-600">{item.student}</span>
              <span className="text-[13px] text-zinc-600 tabular-nums">
                {item.due}
              </span>
              <span className="text-[13px] text-zinc-600 tabular-nums">
                {item.submitted}/{item.total} submitted
              </span>
              <span className="lg:justify-self-end">
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
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </TutorShell>
  );
}
