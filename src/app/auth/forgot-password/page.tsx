import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
        Reset your password
      </h1>
      <p className="mt-2 text-[13px] text-zinc-500">
        We&apos;ll email a reset link that expires in 30 minutes.
      </p>

      <form className="mt-8 space-y-4">
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

        <Button type="submit" className="h-10 w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-8 text-[13px] text-zinc-500">
        <Link href="/auth/login" className="text-zinc-900 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
