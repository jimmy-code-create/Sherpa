import Link from "next/link";
import { Check, CreditCard } from "lucide-react";
import { requireUser } from "@/lib/session";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { PlanSwitcher } from "@/components/plan-switcher";

export const dynamic = "force-dynamic";
export const metadata = { title: "Billing" };

const FREE_FEATURES = [
  "3 note generations per day",
  "1 roadmap per chapter",
  "Quick + Standard note depths",
  "5 practice questions per day",
  "Free allowlisted resources first",
  "Last 3 chapters cached offline",
];

const PRO_FEATURES = [
  "Unlimited notes at all three depths",
  "Unlimited roadmaps + 3 regenerations/day",
  "Previous-year-question bank",
  "PDF export of notes",
  "Last 20 chapters cached offline",
  "Advanced analytics & exam-readiness",
];

export default async function BillingPage() {
  const { profile } = await requireUser("/app/settings/billing");

  return (
    <div className="space-y-4">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <CreditCard className="size-5 text-[var(--brand-primary)]" aria-hidden="true" />
          <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">Current plan</h2>
          <Badge tone={profile.plan === "pro" ? "success" : "brand"}>
            {profile.plan === "pro" ? "Pro" : "Free"}
          </Badge>
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-secondary)]">
          {profile.plan === "pro"
            ? "Pro is active on this account. In this build payments are configured via Razorpay/Stripe keys (see SETUP.md); no live charge happens here."
            : "You're on the free tier — full core experience, generous limits. Upgrade only for deep dives and PYQs."}
        </p>
        <div className="mt-4">
          <PlanSwitcher current={profile.plan} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-display text-[15px] font-extrabold text-[var(--fg-primary)]">Free</h3>
          <ul className="mt-3 space-y-2">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13.5px] text-[var(--fg-secondary)]">
                <Check className="mt-0.5 size-4 shrink-0 text-[#059669]" aria-hidden="true" strokeWidth={3} />
                {f}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="border-[var(--brand-primary)] p-5">
          <h3 className="font-display text-[15px] font-extrabold text-[var(--fg-primary)]">
            Pro <span className="text-[12px] font-bold text-[var(--fg-muted)]">₹199/mo India · $4.99/mo elsewhere</span>
          </h3>
          <ul className="mt-3 space-y-2">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13.5px] text-[var(--fg-secondary)]">
                <Check className="mt-0.5 size-4 shrink-0 text-[#059669]" aria-hidden="true" strokeWidth={3} />
                {f}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="font-display text-[15px] font-extrabold text-[var(--fg-primary)]">Invoices</h2>
        <EmptyState
          title="No invoices yet"
          description="Invoices appear here after your first paid period. Cancel anytime — you keep read access until the end of the period."
          action={<Link href="/pricing" className="btn btn-secondary btn-sm">See pricing</Link>}
        />
      </Card>
    </div>
  );
}
