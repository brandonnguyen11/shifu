"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ensureDemoEnrollment, setActiveRole } from "@/lib/personas";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  ROLE_COOKIE,
  USER_COOKIE,
  homeFor,
  resolveUser,
  type Role,
} from "@/lib/session";

const YEAR = 60 * 60 * 24 * 365;

function readRole(value: FormDataEntryValue | null): Role | null {
  return value === "tutor" || value === "student" ? value : null;
}

async function writeDemoUser(email: string) {
  const user = resolveUser(email);
  const store = await cookies();
  store.set(USER_COOKIE, encodeURIComponent(`${user.email}|${user.name}`), {
    path: "/",
    maxAge: YEAR,
    sameSite: "lax",
  });
  return user;
}

async function writeDemoRole(role: Role) {
  const store = await cookies();
  store.set(ROLE_COOKIE, role, { path: "/", maxAge: YEAR, sameSite: "lax" });
}

async function clearDemoSession() {
  const store = await cookies();
  store.delete(USER_COOKIE);
  store.delete(ROLE_COOKIE);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email.includes("@")) redirect("/auth/login?error=email");

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (!supabase) redirect("/auth/login?error=auth");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) redirect("/auth/login?error=credentials");

    await ensureDemoEnrollment();

    const { data: profile } = await supabase
      .from("profiles")
      .select("active_role")
      .eq("email", email)
      .maybeSingle();

    if (profile?.active_role) {
      redirect(
        next.startsWith("/") ? next : homeFor(profile.active_role as Role)
      );
    }

    redirect(next.startsWith("/") ? next : "/auth/continue");
  }

  await writeDemoUser(email);
  redirect(next.startsWith("/") ? next : "/auth/continue");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const role = readRole(formData.get("role"));

  if (!email.includes("@")) redirect("/auth/register?error=email");
  if (password.length < 8) redirect("/auth/register?error=password");

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (!supabase) redirect("/auth/register?error=auth");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role ?? undefined,
        },
      },
    });

    if (error) redirect(`/auth/register?error=${encodeURIComponent(error.message)}`);

    if (data.user && !data.session) {
      redirect("/auth/login?notice=confirm");
    }

    await ensureDemoEnrollment();

    if (!role) redirect("/auth/continue");

    await setActiveRole(role);
    redirect(homeFor(role));
  }

  await writeDemoUser(email);
  if (!role) redirect("/auth/continue");

  await writeDemoRole(role);
  redirect(homeFor(role));
}

export async function chooseWorkspace(formData: FormData) {
  const role = readRole(formData.get("role"));
  if (!role) redirect("/auth/continue");

  const next = String(formData.get("next") ?? "");

  if (isSupabaseConfigured()) {
    const result = await setActiveRole(role);
    if (result.error) redirect("/auth/continue?error=role");
    redirect(next.startsWith("/") ? next : homeFor(role));
  }

  await writeDemoRole(role);
  redirect(next.startsWith("/") ? next : homeFor(role));
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) await supabase.auth.signOut();
  }

  await clearDemoSession();
  redirect("/");
}
