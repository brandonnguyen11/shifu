import Link from "next/link";

import { signIn } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: PageProps<"/auth/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "";
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
        Sign in
      </h1>
      <p className="mt-2 text-[13px] text-zinc-500">
        Tutors, students, and parents use the same sign in. You pick a workspace
        on the next step.
      </p>

      <form action={signIn} className="mt-8 space-y-4">
        <input type="hidden" name="next" value={next} />

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px] text-zinc-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@school.edu"
            defaultValue="sarah@roomline.com"
            className="h-10"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[13px] text-zinc-700">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-[12px] text-zinc-500 hover:text-zinc-900"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            defaultValue="demo-password"
            className="h-10"
            required
          />
        </div>

        {error === "email" ? (
          <p className="text-[12px] text-red-600">
            Enter a valid email address to continue.
          </p>
        ) : null}

        <Button type="submit" className="h-10 w-full">
          Continue
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-[12px] font-medium text-zinc-700">Demo accounts</p>
        <p className="mt-1 text-[12px] leading-5 text-zinc-500">
          sarah@roomline.com signs in as a tutor, emma@roomline.com as a
          student. Any email works and any password is accepted in this
          prototype.
        </p>
      </div>

      <p className="mt-8 text-[13px] text-zinc-500">
        New here?{" "}
        <Link href="/auth/register" className="text-zinc-900 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
