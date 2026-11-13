"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, SlidersHorizontal, Bell, ShieldCheck, CreditCard, AlertTriangle } from "lucide-react";

const TABS = [
  { href: "/app/settings/profile", label: "Profile", icon: User },
  { href: "/app/settings/preferences", label: "Preferences", icon: SlidersHorizontal },
  { href: "/app/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/app/settings/privacy", label: "Privacy", icon: ShieldCheck },
  { href: "/app/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings/danger", label: "Danger Zone", icon: AlertTriangle },
] as const;

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {TABS.map((t) => {
        const Icon = t.icon;
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center gap-2.5 rounded-[var(--radius-md)] px-3 text-[14px] font-bold ${
              active
                ? "bg-[#eef2ff] text-[var(--brand-primary)]"
                : "text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
