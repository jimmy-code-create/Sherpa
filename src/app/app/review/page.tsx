import { requireUser } from "@/lib/session";
import { reviewStore } from "@/lib/store";
import { ReviewSession } from "@/components/review-session";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const { user } = await requireUser("/app/review");
  const due = await reviewStore.due(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.8rem] font-extrabold text-[var(--fg-primary)]">Review queue</h1>
        <p className="mt-1 text-[15px] text-[var(--fg-secondary)]">
          Spaced repetition (SM-2). {due.length} card{due.length === 1 ? "" : "s"} due today — wrong quiz answers
          land here automatically.
        </p>
      </div>
      <ReviewSession />
    </div>
  );
}
