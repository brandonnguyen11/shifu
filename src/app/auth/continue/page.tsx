import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { chooseWorkspace, signOut } from "@/app/auth/actions";
import { getUser } from "@/lib/session";

const workspaces = [
  {
    value: "tutor",
    title: "Tutor workspace",
    detail:
      "Roster, calendar, assignments, grading, messages, and payments for your tutoring business.",
    points: ["18 active students", "4 sessions today", "9 items awaiting review"],
  },
  {
    value: "student",
    title: "Student room",
    detail:
      "Your sessions, assignments, grades, notes, and progress with your tutor.",
    points: ["Next session today at 4:00 PM", "1 assignment due", "Algebra II"],
  },
];

export default async function ContinuePage({
  searchParams,
}: PageProps<"/auth/continue">) {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "";

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
        Choose your workspace
      </h1>
      <p className="mt-2 text-[13px] text-zinc-500">
        Signed in as {user.email}. You can switch at any time from the sidebar.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {workspaces.map((workspace) => (
          <form key={workspace.value} action={chooseWorkspace}>
            <input type="hidden" name="role" value={workspace.value} />
            <input type="hidden" name="next" value={next} />
            <button
              type="submit"
              className="group flex h-full w-full cursor-pointer flex-col rounded-lg border border-zinc-200 p-5 text-left transition-colors hover:border-zinc-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-zinc-900">
                  {workspace.title}
                </span>
                <ArrowRight className="size-4 text-zinc-400 transition-colors group-hover:text-zinc-900" />
              </div>
              <span className="mt-2 text-[13px] leading-6 text-zinc-500">
                {workspace.detail}
              </span>
              <span className="mt-4 space-y-1.5 border-t border-zinc-100 pt-4">
                {workspace.points.map((point) => (
                  <span
                    key={point}
                    className="block text-[12px] text-zinc-500"
                  >
                    {point}
                  </span>
                ))}
              </span>
            </button>
          </form>
        ))}
      </div>

      <form action={signOut} className="mt-8">
        <button
          type="submit"
          className="cursor-pointer text-[13px] text-zinc-500 hover:text-zinc-900"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
