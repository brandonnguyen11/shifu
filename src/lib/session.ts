import { cookies } from "next/headers";

export type Role = "tutor" | "student";

export const USER_COOKIE = "roomline_user";
export const ROLE_COOKIE = "roomline_role";

export type SessionUser = {
  name: string;
  email: string;
};

/**
 * Demo directory. A real build replaces this with the auth provider's user
 * record and the tutor/student rows it maps to.
 */
export const demoAccounts: Record<string, SessionUser> = {
  "sarah@roomline.com": { name: "Sarah Wilson", email: "sarah@roomline.com" },
  "emma@roomline.com": { name: "Emma Reyes", email: "emma@roomline.com" },
};

export function resolveUser(email: string): SessionUser {
  const normalized = email.trim().toLowerCase();
  if (demoAccounts[normalized]) return demoAccounts[normalized];

  const handle = normalized.split("@")[0] || "there";
  const name = handle
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");

  return { name: name || "New user", email: normalized };
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export async function getUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;

  try {
    const [email, name] = decodeURIComponent(raw).split("|");
    if (!email) return null;
    return { email, name: name || resolveUser(email).name };
  } catch {
    return null;
  }
}

export async function getRole(): Promise<Role | null> {
  const store = await cookies();
  const value = store.get(ROLE_COOKIE)?.value;
  return value === "tutor" || value === "student" ? value : null;
}

export function homeFor(role: Role) {
  return role === "tutor" ? "/tutor" : "/student/room";
}
