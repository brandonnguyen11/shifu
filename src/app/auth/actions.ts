"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

async function writeUser(email: string) {
  const user = resolveUser(email);
  const store = await cookies();
  store.set(USER_COOKIE, encodeURIComponent(`${user.email}|${user.name}`), {
    path: "/",
    maxAge: YEAR,
    sameSite: "lax",
  });
  return user;
}

async function writeRole(role: Role) {
  const store = await cookies();
  store.set(ROLE_COOKIE, role, { path: "/", maxAge: YEAR, sameSite: "lax" });
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  if (!email.includes("@")) redirect("/auth/login?error=email");

  await writeUser(email);

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/") ? next : "/auth/continue");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const role = readRole(formData.get("role"));
  if (!email.includes("@")) redirect("/auth/register?error=email");

  await writeUser(email);
  if (!role) redirect("/auth/continue");

  await writeRole(role);
  redirect(homeFor(role));
}

export async function chooseWorkspace(formData: FormData) {
  const role = readRole(formData.get("role"));
  if (!role) redirect("/auth/continue");

  await writeRole(role);

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/") ? next : homeFor(role));
}

export async function signOut() {
  const store = await cookies();
  store.delete(USER_COOKIE);
  store.delete(ROLE_COOKIE);
  redirect("/");
}
