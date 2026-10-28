import { NextResponse, type NextRequest } from "next/server";

import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { ROLE_COOKIE, USER_COOKIE } from "@/lib/session";

async function gateWithSupabase(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { supabase, response } = createMiddlewareClient(request);

  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("active_role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.active_role;

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

  return response;
}

function gateWithDemoCookies(request: NextRequest) {
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

export async function middleware(request: NextRequest) {
  const supabaseGate = await gateWithSupabase(request);
  if (supabaseGate) return supabaseGate;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }

  return gateWithDemoCookies(request);
}

export const config = {
  matcher: ["/tutor/:path*", "/student/:path*"],
};
