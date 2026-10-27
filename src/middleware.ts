import { NextResponse, type NextRequest } from "next/server";

import { ROLE_COOKIE, USER_COOKIE } from "@/lib/session";

/**
 * Gate-keeps the two workspaces. Signed-out visitors land on login, signed-in
 * visitors without a chosen workspace land on the role picker, and a role can
 * never open the other role's section.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const user = request.cookies.get(USER_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;

  if (!user) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  if (role !== "tutor" && role !== "student") {
    const choose = new URL("/auth/continue", request.url);
    choose.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(choose);
  }

  const section = pathname.startsWith("/tutor") ? "tutor" : "student";
  if (role !== section) {
    const home = role === "tutor" ? "/tutor" : "/student/room";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tutor/:path*", "/student/:path*"],
};
