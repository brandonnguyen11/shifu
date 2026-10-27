import { Panel, StatusPill } from "@/components/panel";
import { StudentShell } from "@/components/shells";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const thread = [
  {
    from: "me",
    time: "Yesterday, 6:12 PM",
    body: "I got stuck on question 4 of the factoring set.",
  },
  {
    from: "them",
    time: "Yesterday, 6:40 PM",
    body: "Look at the sign on the middle term first. Factor out the negative before you split it.",
  },
  {
    from: "me",
    time: "Today, 8:05 AM",
    body: "That worked, thanks. I'll redo questions 4 and 7 before Thursday.",
  },
  {
    from: "them",
    time: "Today, 8:20 AM",
    body: "Perfect. Bring your work to the session and we'll go through the ones that still feel shaky.",
  },
];

export default function StudentMessagesPage() {
  return (
    <StudentShell
      title="Messages"
      subtitle="Your conversation with Sarah Wilson"
    >
      <Panel className="flex min-h-[560px] flex-col">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700">
              SW
            </span>
            <div>
              <p className="text-[13px] font-medium text-zinc-900">
                Sarah Wilson
              </p>
              <p className="text-[12px] text-zinc-500">
                Algebra II tutor · replies within a few hours
              </p>
            </div>
          </div>
          <StatusPill tone="positive">Online</StatusPill>
        </div>

        <div className="flex-1 space-y-4 p-4">
          {thread.map((message) => (
            <div
              key={message.time}
              className={message.from === "me" ? "flex justify-end" : "flex"}
            >
              <div className="max-w-md">
                <div
                  className={`rounded-lg px-3 py-2 text-[13px] leading-5 ${
                    message.from === "me"
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 text-zinc-700"
                  }`}
                >
                  {message.body}
                </div>
                <p
                  className={`mt-1 text-[11px] text-zinc-400 ${
                    message.from === "me" ? "text-right" : ""
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-200 p-4">
          <Textarea
            placeholder="Ask Sarah a question"
            className="min-h-20 resize-none"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[12px] text-zinc-400">
              Messages are visible to you and your tutor.
            </p>
            <Button size="sm">Send</Button>
          </div>
        </div>
      </Panel>
    </StudentShell>
  );
}
