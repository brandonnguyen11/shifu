export type WorkspaceRole = "tutor" | "student";

/**
 * Keeps post-login redirects on this site.
 * A value like "//example.com" starts with "/" but is a protocol-relative URL.
 */
export function safeInternalPath(
  value: string | null | undefined,
  fallback: string
) {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || value.includes("\0")) return fallback;

  try {
    const url = new URL(value, "http://local.test");
    if (url.origin !== "http://local.test") return fallback;
    if (url.username || url.password) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

function workspaceSection(path: string): WorkspaceRole | null {
  if (path.startsWith("/tutor")) return "tutor";
  if (path.startsWith("/student")) return "student";
  return null;
}

export function homeForRole(role: WorkspaceRole) {
  return role === "tutor" ? "/tutor" : "/student/room";
}

/** Role is already known. Ignore a return path that belongs to the other workspace. */
export function destinationFor(next: string, role: WorkspaceRole) {
  const destination = safeInternalPath(next, homeForRole(role));
  const section = workspaceSection(destination);
  if (section && section !== role) return homeForRole(role);
  return destination;
}

/**
 * Prefer the browser's loopback Host when Next's request URL says localhost.
 * Ignore every other Host value so this cannot be used as an open redirect.
 */
export function publicOrigin(requestOrigin: string, hostHeader: string | null) {
  let url: URL;
  try {
    url = new URL(requestOrigin);
  } catch {
    return "http://localhost:3000";
  }

  const host = hostHeader?.split(",")[0]?.trim() ?? "";
  if (!host || /[/\s@\\]/.test(host)) return url.origin;

  const hostname = host.replace(/:\d+$/, "").replace(/^\[|\]$/g, "").toLowerCase();
  if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "::1") {
    return url.origin;
  }

  const proto = url.protocol === "https:" ? "https" : "http";
  return `${proto}://${host}`;
}

/** Role is not known yet. Land on the chooser instead of a protected URL. */
export function continueTarget(next: string) {
  const destination = safeInternalPath(next, "");
  if (!workspaceSection(destination)) return "/auth/continue";
  return `/auth/continue?next=${encodeURIComponent(destination)}`;
}
