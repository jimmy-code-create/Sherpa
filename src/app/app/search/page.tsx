import { requireUser } from "@/lib/session";
import { SearchPage } from "@/components/search-page";

export const dynamic = "force-dynamic";

export const metadata = { title: "Search" };

export default async function Page() {
  await requireUser("/app/search");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Search</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          Chapters, subjects and settings. Tip: press ⌘K / Ctrl+K anywhere in the app.
        </p>
      </div>
      <SearchPage />
    </div>
  );
}
