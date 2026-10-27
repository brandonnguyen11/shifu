import { Panel, StatusPill } from "@/components/panel";
import { TutorShell } from "@/components/shells";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { conversations } from "@/lib/data";

export default function MessagesPage() {
  const active = conversations[0];

  return (
    <TutorShell
      title="Messages"
      subtitle="Conversations with students and parents"
      actions={
        <>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Compose email
          </span>
          <span className={buttonVariants({ size: "sm" })}>New message</span>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Panel className="overflow-hidden">
          <div className="divide-y divide-zinc-100">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex gap-3 px-4 py-3.5 ${
                  conversation.id === active.id ? "bg-zinc-50" : ""
                }`}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700">
                  {conversation.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-medium text-zinc-900">
                      {conversation.name}
                    </p>
                    <span className="shrink-0 text-[11px] text-zinc-400">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">{conversation.role}</p>
                  <p className="mt-1 truncate text-[12px] text-zinc-500">
                    {conversation.preview}
                  </p>
                </div>
                {conversation.unread ? (
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-900" />
                ) : null}
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="flex min-h-[560px] flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <div>
              <p className="text-[13px] font-medium text-zinc-900">
                {active.name}
              </p>
              <p className="text-[12px] text-zinc-500">{active.role}</p>
            </div>
            <StatusPill>Algebra II</StatusPill>
          </div>

          <div className="flex-1 space-y-4 p-4">
            {active.thread.map((message) => (
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
              placeholder="Write a message"
              className="min-h-20 resize-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className={buttonVariants({ variant: "outline", size: "xs" })}>
                Draft with AI
              </span>
              <Button size="sm">Send</Button>
            </div>
          </div>
        </Panel>
      </div>
    </TutorShell>
  );
}
