import { Panel, PanelHeader, StatCard, StatusPill } from "@/components/panel";
import { TutorShell } from "@/components/shells";
import { buttonVariants } from "@/components/ui/button";
import { packages, payments } from "@/lib/data";

export default function PaymentsPage() {
  return (
    <TutorShell
      title="Payments"
      subtitle="Packages, invoices, and payouts"
      actions={
        <>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>
            Export CSV
          </span>
          <span className={buttonVariants({ size: "sm" })}>New package</span>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="This month" value="$3,240" note="+18% vs August" />
        <StatCard label="Outstanding" value="$190" note="2 unpaid invoices" />
        <StatCard label="Next payout" value="$1,755" note="Sep 16" />
        <StatCard label="Refund rate" value="1.2%" note="last 90 days" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Panel className="overflow-hidden">
          <PanelHeader title="Recent transactions" note="Last 30 days" />
          <div className="hidden grid-cols-[90px_1.2fr_1.4fr_110px_110px] gap-4 border-b border-zinc-200 bg-zinc-50/60 px-4 py-2.5 text-[12px] font-medium text-zinc-500 sm:grid">
            <span>Date</span>
            <span>Student</span>
            <span>Item</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {payments.map((payment) => (
              <div
                key={`${payment.date}-${payment.student}-${payment.item}`}
                className="grid gap-1 px-4 py-3.5 sm:grid-cols-[90px_1.2fr_1.4fr_110px_110px] sm:items-center sm:gap-4"
              >
                <span className="text-[13px] text-zinc-500 tabular-nums">
                  {payment.date}
                </span>
                <span className="text-[13px] font-medium text-zinc-900">
                  {payment.student}
                </span>
                <span className="text-[13px] text-zinc-600">{payment.item}</span>
                <span className="text-[13px] text-zinc-900 tabular-nums sm:text-right">
                  {payment.amount}
                </span>
                <span className="sm:justify-self-end">
                  <StatusPill
                    tone={
                      payment.state === "Paid"
                        ? "positive"
                        : payment.state === "Failed"
                          ? "critical"
                          : "warning"
                    }
                  >
                    {payment.state}
                  </StatusPill>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Your packages"
            note="What students can buy from your booking page"
          />
          <div className="divide-y divide-zinc-100">
            {packages.map((item) => (
              <div key={item.name} className="px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-zinc-900">
                    {item.name}
                  </p>
                  <p className="text-[13px] text-zinc-900 tabular-nums">
                    {item.price}
                  </p>
                </div>
                <p className="mt-0.5 text-[12px] text-zinc-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </TutorShell>
  );
}
