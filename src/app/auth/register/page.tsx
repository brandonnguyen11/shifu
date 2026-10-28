import Link from "next/link";

import { signUp } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roles = [
  {
    value: "tutor",
    title: "I'm a tutor",
    detail: "Manage students, sessions, assignments, and payments.",
  },
  {
    value: "student",
    title: "I'm a student",
    detail: "Join sessions, complete work, and track your progress.",
  },
];

export default async function RegisterPage({
  searchParams,
}: PageProps<"/auth/register">) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
        Create your account
      </h1>
      <p className="mt-2 text-[13px] text-zinc-500">
        Free for your first two students. No card required.
      </p>

      <form action={signUp} className="mt-8 space-y-5">
        <fieldset className="space-y-2">
          <legend className="mb-2 text-[13px] font-medium text-zinc-700">
            How will you use Roomline?
          </legend>
          {roles.map((role, index) => (
            <label
              key={role.value}
              className="block cursor-pointer rounded-lg border border-zinc-200 p-3 transition-colors has-[:checked]:border-zinc-900 has-[:checked]:bg-zinc-50"
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                defaultChecked={index === 0}
                className="sr-only"
              />
              <span className="block text-[13px] font-medium text-zinc-900">
                {role.title}
              </span>
              <span className="mt-0.5 block text-[12px] leading-5 text-zinc-500">
                {role.detail}
              </span>
            </label>
          ))}
        </fieldset>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-[13px] text-zinc-700">
            Full name
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Sarah Wilson"
            className="h-10"
            required
          />
        </div>

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
            className="h-10"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[13px] text-zinc-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 12 characters"
            className="h-10"
            required
          />
        </div>

        {error === "email" ? (
          <p className="text-[12px] text-red-600">
            Enter a valid email address to continue.
          </p>
        ) : null}
        {error === "password" ? (
          <p className="text-[12px] text-red-600">
            Use a password of at least 8 characters.
          </p>
        ) : null}
        {error && error !== "email" && error !== "password" ? (
          <p className="text-[12px] text-red-600">{decodeURIComponent(error)}</p>
        ) : null}

        <Button type="submit" className="h-10 w-full">
          Create account
        </Button>

        <p className="text-[12px] leading-5 text-zinc-500">
          By continuing you agree to the{" "}
          <Link href="/trust#terms" className="text-zinc-700 hover:underline">
            terms
          </Link>{" "}
          and the{" "}
          <Link href="/trust#ferpa" className="text-zinc-700 hover:underline">
            FERPA data policy
          </Link>
          . Students under 13 need parental consent.
        </p>
      </form>

      <p className="mt-8 text-[13px] text-zinc-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-zinc-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
