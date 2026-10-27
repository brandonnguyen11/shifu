import { MasteryBar, Panel, PanelHeader, StatCard } from "@/components/panel";
import { StudentShell } from "@/components/shells";
import { getStudent } from "@/lib/data";

const scoreHistory = [
  { label: "Aug 28", score: 88 },
  { label: "Sep 03", score: 72 },
  { label: "Sep 05", score: 62 },
  { label: "Sep 12", score: 84 },
];

export default function StudentProgressPage() {
  const student = getStudent("emma-reyes")!;

  return (
    <StudentShell
      title="Progress"
      subtitle="How your mastery has moved this term"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall mastery" value={`${student.mastery}%`} note="+6 this month" />
        <StatCard label="Best skill" value="Functions" note="91% mastery" />
        <StatCard label="Focus area" value="Factoring" note="61% mastery" />
        <StatCard label="Attendance" value={`${student.attendance}%`} note="24 of 25 sessions" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Panel>
          <PanelHeader
            title="Skill mastery"
            note="Updated after every graded item and session note"
          />
          <div className="space-y-4 p-4">
            {student.skills.map((skill) => (
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
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Score history" note="Last four graded items" />
          <div className="p-4">
            <div className="flex h-44 items-end gap-4">
              {scoreHistory.map((entry) => (
                <div key={entry.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[12px] text-zinc-900 tabular-nums">
                    {entry.score}%
                  </span>
                  <div
                    className="w-full rounded-t-md bg-zinc-900"
                    style={{ height: `${entry.score}%` }}
                  />
                  <span className="text-[11px] text-zinc-400">{entry.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="What you're good at" />
          <ul className="space-y-2 p-4">
            {student.strengths.map((item) => (
              <li key={item} className="text-[13px] leading-5 text-zinc-700">
                {item}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader title="What to work on" />
          <ul className="space-y-2 p-4">
            {student.weaknesses.map((item) => (
              <li key={item} className="text-[13px] leading-5 text-zinc-700">
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-4">
        <PanelHeader title="Your goal" note="Set with Sarah on September 1" />
        <div className="p-4">
          <p className="text-[13px] text-zinc-700">{student.goal}</p>
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-[12px] text-zinc-500">
              <span>Progress toward goal</span>
              <span className="tabular-nums">68 of 85</span>
            </div>
            <MasteryBar value={80} />
          </div>
        </div>
      </Panel>
    </StudentShell>
  );
}
