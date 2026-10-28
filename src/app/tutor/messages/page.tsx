import Link from "next/link";

import { MessageComposer } from "@/components/message-composer";
import { Panel, StatusPill } from "@/components/panel";
import { TutorShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import {
  getConversationThread,
  listConversationsForTutor,
} from "@/lib/messaging";
import { getProfile } from "@/lib/personas";
import { conversations as mockConversations } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type PageProps = {
  searchParams: Promise<{ c?: string }>;
};

export default async function MessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const profile = await getProfile();
  const useLive = isSupabaseConfigured() && profile?.id;

  const liveConversations = useLive
    ? await listConversationsForTutor(profile.id)
    : [];

  const activeId =
    (typeof params.c === "string" ? params.c : undefined) ??
    liveConversations[0]?.id;

  const activeLive = liveConversations.find((c) => c.id === activeId);
  const mockActive = mockConversations[0];

  const thread = useLive && activeId && profile
    ? await getConversationThread(activeId, profile.id)
    : mockActive.thread.map((message) => ({
        from: message.from as "me" | "them",
        time: message.time,
        body: message.body,
      }));

  return (
    <TutorShell
      title="Messages"
      subtitle={
        useLive
          ? "Live threads with your students"
          : "Conversations with students and parents (demo data)"
      }
      actions={
        <>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Compose email
          </span>
          <span className={buttonVariants({ size: "sm" })}>New message</span>
        </>
      }
    >
      {!useLive ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          Sign in with Supabase and run the SQL migration to enable live
          messaging. Until then you see sample threads only.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Panel className="overflow-hidden">
          <div className="divide-y divide-zinc-100">
            {useLive && liveConversations.length === 0 ? (
              <p className="px-4 py-6 text-[13px] text-zinc-500">
                No enrollments yet. Register{" "}
                <span className="font-medium">emma@roomline.com</span> as a
                student and <span className="font-medium">sarah@roomline.com</span>{" "}
                as a tutor, then sign in again to link the demo pair.
              </p>
            ) : null}

            {useLive
              ? liveConversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/tutor/messages?c=${conversation.id}`}
                    className={`flex gap-3 px-4 py-3.5 transition-colors hover:bg-zinc-50 ${
                      conversation.id === activeId ? "bg-zinc-50" : ""
                    }`}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700">
                      {conversation.peerInitials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-medium text-zinc-900">
                          {conversation.peerName}
                        </p>
                        <span className="shrink-0 text-[11px] text-zinc-400">
                          {conversation.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        {conversation.peerRole}
                      </p>
                      <p className="mt-1 truncate text-[12px] text-zinc-500">
                        {conversation.preview}
                      </p>
                    </div>
                  </Link>
                ))
              : mockConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex gap-3 px-4 py-3.5 ${
                      conversation.id === mockActive.id ? "bg-zinc-50" : ""
                    }`}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-[11px] font-medium text-zinc-700">
                      {conversation.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-zinc-900">
                        {conversation.name}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {conversation.role}
                      </p>
                      <p className="mt-1 truncate text-[12px] text-zinc-500">
                        {conversation.preview}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </Panel>

        <Panel className="flex min-h-[560px] flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <div>
              <p className="text-[13px] font-medium text-zinc-900">
                {useLive && activeLive
                  ? activeLive.peerName
                  : mockActive.name}
              </p>
              <p className="text-[12px] text-zinc-500">
                {useLive && activeLive
                  ? activeLive.peerRole
                  : mockActive.role}
              </p>
            </div>
            <StatusPill>
              {useLive && activeLive ? activeLive.subject : "Algebra II"}
            </StatusPill>
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

          {useLive && activeId ? (
            <MessageComposer
              conversationId={activeId}
              returnPath={`/tutor/messages?c=${activeId}`}
              showDraftAi
            />
          ) : (
            <div className="border-t border-zinc-200 p-4 text-[13px] text-zinc-500">
              Sending is disabled in demo mode.
            </div>
          )}
        </Panel>
      </div>
    </TutorShell>
  );
}
