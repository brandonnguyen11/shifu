import { MessageComposer } from "@/components/message-composer";
import { Panel, StatusPill } from "@/components/panel";
import { StudentShell } from "@/components/shells";
import { getConversationThread, getStudentConversation } from "@/lib/messaging";
import { getProfile } from "@/lib/personas";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { initialsOf } from "@/lib/session";

const demoThread = [
  {
    from: "me" as const,
    time: "Yesterday, 6:12 PM",
    body: "I got stuck on question 4 of the factoring set.",
  },
  {
    from: "them" as const,
    time: "Yesterday, 6:40 PM",
    body: "Look at the sign on the middle term first. Factor out the negative before you split it.",
  },
  {
    from: "me" as const,
    time: "Today, 8:05 AM",
    body: "That worked, thanks. I'll redo questions 4 and 7 before Thursday.",
  },
];

export default async function StudentMessagesPage() {
  const profile = await getProfile();
  const useLive = isSupabaseConfigured() && profile?.id;

  const pairing = useLive
    ? await getStudentConversation(profile.id)
    : null;

  const thread =
    useLive && pairing
      ? await getConversationThread(pairing.conversationId, profile.id)
      : demoThread;

  const tutorName = pairing?.tutorName ?? "Sarah Wilson";
  const tutorInitials = initialsOf(tutorName);

  return (
    <StudentShell
      title="Messages"
      subtitle={
        useLive && pairing
          ? `Live conversation with ${tutorName}`
          : "Your conversation with Sarah Wilson (demo)"
      }
    >
      {!useLive || !pairing ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          {useLive && !pairing
            ? "No tutor enrollment found for this account. Use emma@roomline.com (student) after linking with sarah@roomline.com (tutor)."
            : "Run the Supabase migration and register to enable live messaging."}
        </p>
      ) : null}

      <Panel className="flex min-h-[560px] flex-col">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700">
              {tutorInitials}
            </span>
            <div>
              <p className="text-[13px] font-medium text-zinc-900">{tutorName}</p>
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
              key={`${message.time}-${message.body}`}
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

        {useLive && pairing ? (
          <MessageComposer
            conversationId={pairing.conversationId}
            returnPath="/student/messages"
            placeholder="Ask your tutor a question"
          />
        ) : (
          <div className="border-t border-zinc-200 p-4 text-[13px] text-zinc-500">
            Sending is disabled until live messaging is connected.
          </div>
        )}
      </Panel>
    </StudentShell>
  );
}
