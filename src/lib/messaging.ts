import { createClient } from "@/lib/supabase/server";
import { initialsOf } from "@/lib/session";

export type MessageRow = {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
};

export type ConversationPreview = {
  id: string;
  subject: string;
  peerName: string;
  peerInitials: string;
  peerRole: string;
  preview: string;
  time: string;
  unread: number;
};

export type ThreadMessage = {
  from: "me" | "them";
  time: string;
  body: string;
};

function formatMessageTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function listConversationsForTutor(
  tutorId: string
): Promise<ConversationPreview[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select("id, subject, student_id")
    .eq("tutor_id", tutorId);

  if (error || !enrollments?.length) return [];

  const previews: ConversationPreview[] = [];

  for (const row of enrollments) {
    const { data: studentProfile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", row.student_id)
      .maybeSingle();

    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("enrollment_id", row.id)
      .maybeSingle();

    if (!conversation?.id) continue;

    const { data: latest } = await supabase
      .from("messages")
      .select("body, created_at")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const name = studentProfile?.full_name ?? "Student";
    previews.push({
      id: conversation.id,
      subject: row.subject ?? "General",
      peerName: name,
      peerInitials: initialsOf(name),
      peerRole: "Student",
      preview: latest?.body ?? "No messages yet.",
      time: latest?.created_at ? formatMessageTime(latest.created_at) : "",
      unread: 0,
    });
  }

  return previews;
}

export async function getConversationThread(
  conversationId: string,
  viewerId: string
): Promise<ThreadMessage[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, body, created_at, sender_id")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error || !messages) return [];

  return messages.map((message: MessageRow) => ({
    from: message.sender_id === viewerId ? "me" : "them",
    time: formatMessageTime(message.created_at),
    body: message.body,
  }));
}

export async function getStudentConversation(
  studentId: string
): Promise<{ conversationId: string; tutorName: string } | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, tutor_id")
    .eq("student_id", studentId)
    .limit(1)
    .maybeSingle();

  if (!enrollment) return null;

  const { data: tutorProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", enrollment.tutor_id)
    .maybeSingle();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("enrollment_id", enrollment.id)
    .maybeSingle();

  if (!conversation?.id) return null;

  return {
    conversationId: conversation.id,
    tutorName: tutorProfile?.full_name ?? "Your tutor",
  };
}
