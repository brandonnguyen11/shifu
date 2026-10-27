import Link from "next/link";
import { Check } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";

const plans = [
  {
    name: "Solo",
    price: "$0",
    cadence: "for your first two students",
    description: "Everything you need to run a small roster end to end.",
    features: [
      "2 student rooms",
      "Sessions, notes, and assignments",
      "Progress and mastery tracking",
      "Booking page and paid trials",
    ],
    cta: "Start free",
    href: "/tutor",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    cadence: "per month, unlimited students",
    description: "For full-time tutors running a real book of business.",
    features: [
      "Unlimited student rooms",
      "AI lesson plans, assignments, and quizzes",
      "Assisted grading with tutor approval",
      "Packages, invoicing, and payments",
      "Parent access with visibility controls",
    ],
    cta: "Start 14-day trial",
    href: "/tutor",
    highlighted: true,
  },
  {
    name: "Practice",
    price: "Custom",
    cadence: "for teams and tutoring centers",
    description: "Multiple tutors, shared students, and org-level reporting.",
    features: [
      "Multi-tutor roster management",
      "Organization analytics and billing",
      "Role and permission controls",
      "Data processing agreement and SSO",
    ],
    cta: "Talk to us",
    href: "/about#contact",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-24">
          <div className="max-w-2xl">
            <p className="text-[13px] font-medium text-zinc-500">Pricing</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-zinc-950">
              Priced per tutor, not per student.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Students and parents never pay for access to their room. Payment
              processing fees are passed through at cost.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-xl border p-6 ${
                  plan.highlighted
                    ? "border-zinc-900 shadow-[0_24px_48px_-32px_rgba(0,0,0,0.35)]"
                    : "border-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-medium text-zinc-900">
                    {plan.name}
                  </p>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[11px] font-medium text-white">
                      Most popular
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-[-0.03em] text-zinc-950">
                    {plan.price}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] text-zinc-500">
                  {plan.cadence}
                </p>
                <p className="mt-4 text-[13px] leading-6 text-zinc-600">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-zinc-900"
                        strokeWidth={2}
                      />
                      <span className="text-[13px] leading-5 text-zinc-600">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={buttonVariants({
                    variant: plan.highlighted ? "default" : "outline",
                    className: "mt-8 h-10 w-full",
                  })}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
