"use server";

import { revalidatePath } from "next/cache";

import { getProfile } from "@/lib/personas";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function sendMessage(formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  const conversationId = String(formData.get("conversationId") ?? "");
  const returnPath = String(formData.get("returnPath") ?? "/");

  if (!body || !conversationId) return;

  if (!isSupabaseConfigured()) return;

  const profile = await getProfile();
  if (!profile) return;

  const supabase = await createClient();
  if (!supabase) return;

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: profile.id,
    body,
  });

  if (error) {
    console.error("sendMessage", error.message);
    return;
  }

  revalidatePath(returnPath);
}
