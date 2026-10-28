import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Role } from "@/lib/session";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  active_role: Role | null;
};

const DEMO_TUTOR_EMAIL = "sarah@roomline.com";
const DEMO_STUDENT_EMAIL = "emma@roomline.com";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, active_role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

export async function setActiveRole(role: Role) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase is not configured." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ active_role: role })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { error: null };
}

/** Links demo tutor/student profiles and ensures a conversation exists. */
export async function ensureDemoEnrollment() {
  if (!isSupabaseConfigured()) return;

  const admin = createAdminClient();

  const { data: tutor } = await admin
    .from("profiles")
    .select("id")
    .eq("email", DEMO_TUTOR_EMAIL)
    .maybeSingle();

  const { data: student } = await admin
    .from("profiles")
    .select("id")
    .eq("email", DEMO_STUDENT_EMAIL)
    .maybeSingle();

  if (!tutor?.id || !student?.id) return;

  let enrollmentId: string | undefined;

  const { data: existingEnrollment } = await admin
    .from("enrollments")
    .select("id")
    .eq("tutor_id", tutor.id)
    .eq("student_id", student.id)
    .maybeSingle();

  if (existingEnrollment?.id) {
    enrollmentId = existingEnrollment.id;
  } else {
    const { data: created } = await admin
      .from("enrollments")
      .insert({
        tutor_id: tutor.id,
        student_id: student.id,
        subject: "Algebra II",
      })
      .select("id")
      .single();
    enrollmentId = created?.id;
  }

  if (!enrollmentId) return;

  const { data: existingConvo } = await admin
    .from("conversations")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .maybeSingle();

  if (!existingConvo) {
    await admin.from("conversations").insert({ enrollment_id: enrollmentId });
  }
}
