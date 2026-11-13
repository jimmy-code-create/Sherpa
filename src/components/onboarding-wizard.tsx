"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Globe2,
  GraduationCap,
  Layers,
  GitBranch,
  Sprout,
  Target,
  Languages,
  PartyPopper,
  ArrowRight,
  SkipForward,
  Loader2,
} from "lucide-react";
import type { ProfileRecord } from "@/lib/store";
import { COUNTRIES, CURRICULA, LEVELS, STREAMS } from "@/lib/curriculum/taxonomy";
import { allSubjectsOnPath } from "@/lib/curriculum/catalog";
import { Button, Card, ProgressBar } from "@/components/ui";

import { STEPS as STEP_DEFS, STEP_INDEX, type StepSlug } from "@/lib/onboarding-steps";

const STEPS = STEP_DEFS.map((s) => ({
  ...s,
  icon: (
    {
      welcome: PartyPopper,
      country: Globe2,
      curriculum: GraduationCap,
      level: Layers,
      stream: GitBranch,
      proficiency: Sprout,
      goals: Target,
      language: Languages,
      complete: PartyPopper,
    } as const
  )[s.slug],
}));

export { STEPS };
export type { StepSlug };

export function OnboardingWizard({ step, profile }: { step: StepSlug; profile: ProfileRecord }) {
  const router = useRouter();
  const index = STEP_INDEX[step];

  // Local working copy of the profile fields the wizard edits.
  const [countryCode, setCountryCode] = React.useState(profile.countryCode);
  const [curriculumSlug, setCurriculumSlug] = React.useState(profile.curriculumSlug);
  const [levelSlug, setLevelSlug] = React.useState(profile.levelSlug);
  const [streamSlug, setStreamSlug] = React.useState(profile.streamSlug ?? "");
  const [proficiency, setProficiency] = React.useState(profile.proficiency);
  const [weeklyHours, setWeeklyHours] = React.useState(profile.weeklyHours);
  const [targetDate, setTargetDate] = React.useState(profile.targetDate ?? "");
  const [language, setLanguage] = React.useState(profile.language);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [roadmapPreview, setRoadmapPreview] = React.useState<{
    title: string;
    total_weeks: number;
    phases: { name: string }[];
    chapterSlug: string;
    chapterName: string;
  } | null>(null);

  const curricula = CURRICULA.filter((c) => c.countryCode === countryCode);
  const levels = LEVELS.filter((l) => l.curriculumSlug === curriculumSlug);
  const streams = STREAMS.filter((s) => s.levelSlug === levelSlug);
  const languages = COUNTRIES.find((c) => c.code === countryCode)?.languages ?? ["en"];

  async function patchProfile(extra: Record<string, unknown> = {}) {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        countryCode,
        curriculumSlug,
        levelSlug,
        streamSlug: streamSlug || null,
        proficiency,
        weeklyHours,
        targetDate: targetDate || null,
        language,
        ...extra,
      }),
    });
    if (!res.ok) throw new Error("save failed");
    return res.json();
  }

  async function goTo(next: StepSlug, extra: Record<string, unknown> = {}) {
    setSaving(true);
    setError(null);
    try {
      await patchProfile(next === "complete" ? { onboardingComplete: true, ...extra } : extra);
      router.push(`/onboarding/${next}`);
      router.refresh();
    } catch {
      setError("Couldn't save. Check your connection — your answers are kept on this screen.");
      setSaving(false);
    }
  }

  function skip() {
    const next = STEPS[Math.min(index + 1, STEPS.length - 1)]!;
    void goTo(next.slug);
  }

  // On the final step, build the first roadmap for the first chapter on the path.
  React.useEffect(() => {
    if (step !== "complete") return;
    const subjects = allSubjectsOnPath(countryCode, curriculumSlug, levelSlug);
    const firstChapter = subjects[0]?.chapters[0];
    if (!firstChapter) return;
    void fetch("/api/ai/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterSlug: firstChapter.slug }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((body: { roadmap?: { title: string; total_weeks: number; phases: { name: string }[] } }) => {
        if (body.roadmap) {
          setRoadmapPreview({
            title: body.roadmap.title,
            total_weeks: body.roadmap.total_weeks,
            phases: body.roadmap.phases,
            chapterSlug: firstChapter.slug,
            chapterName: firstChapter.name,
          });
        }
      })
      .catch(() => {});

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      void confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 }, disableForReducedMotion: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const progressPct = Math.round(((index + 1) / STEPS.length) * 100);

  return (
    <div className="w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-[12.5px] font-bold text-[var(--fg-muted)]">
          <span>
            Step {index + 1} of {STEPS.length} · {STEPS[index]!.label}
          </span>
          <span>{progressPct}%</span>
        </div>
        <ProgressBar value={progressPct} label="Onboarding progress" />
        <ol className="mt-3 flex gap-1.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <li
              key={s.slug}
              className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-[var(--brand-primary)]" : "bg-[var(--border-default)]"}`}
            />
          ))}
        </ol>
      </div>

      <Card className="p-6 sm:p-8">
        {step === "welcome" ? (
          <WelcomeStep />
        ) : step === "country" ? (
          <PickerStep
            icon={<Globe2 className="size-8 text-[var(--brand-primary)]" aria-hidden="true" />}
            title="Where are you studying?"
            description="This decides which boards and curricula we show you."
            value={countryCode}
            onPick={(v) => {
              setCountryCode(v);
              const first = CURRICULA.find((c) => c.countryCode === v);
              if (first) setCurriculumSlug(first.slug);
              const firstLevel = LEVELS.find((l) => l.curriculumSlug === first?.slug);
              if (firstLevel) setLevelSlug(firstLevel.slug);
            }}
            options={COUNTRIES.map((c) => ({ value: c.code, label: `${c.flag} ${c.name}`, popular: c.popular }))}
          />
        ) : step === "curriculum" ? (
          <PickerStep
            icon={<GraduationCap className="size-8 text-[var(--brand-primary)]" aria-hidden="true" />}
            title="Which board or curriculum?"
            description={`Boards available for ${COUNTRIES.find((c) => c.code === countryCode)?.name ?? "your country"}.`}
            value={curriculumSlug}
            onPick={(v) => {
              setCurriculumSlug(v);
              const firstLevel = LEVELS.find((l) => l.curriculumSlug === v);
              if (firstLevel) setLevelSlug(firstLevel.slug);
            }}
            options={curricula.map((c) => ({ value: c.slug, label: c.name, hint: c.description }))}
          />
        ) : step === "level" ? (
          <PickerStep
            icon={<Layers className="size-8 text-[var(--brand-primary)]" aria-hidden="true" />}
            title="Which class or level?"
            description="Roadmaps and notes are written for this level's exams."
            value={levelSlug}
            onPick={setLevelSlug}
            options={levels.map((l) => ({ value: l.slug, label: l.name, hint: l.stage.replace(/_/g, " ") }))}
          />
        ) : step === "stream" ? (
          streams.length === 0 ? (
            <AutoAdvance
              message="No stream choice needed at this level — moving on."
              onDone={() => void goTo("proficiency")}
            />
          ) : (
            <PickerStep
              icon={<GitBranch className="size-8 text-[var(--brand-primary)]" aria-hidden="true" />}
              title="Which stream or field?"
              description="Only relevant for senior secondary and above."
              value={streamSlug}
              onPick={setStreamSlug}
              options={streams.map((s) => ({ value: s.slug, label: s.name }))}
              allowEmpty
            />
          )
        ) : step === "proficiency" ? (
          <PickerStep
            icon={<Sprout className="size-8 text-[var(--brand-primary)]" aria-hidden="true" />}
            title="How much do you already know?"
            description="This sizes your roadmap — beginners get more foundation time."
            value={proficiency}
            onPick={(v) => setProficiency(v as ProfileRecord["proficiency"])}
            options={[
              { value: "beginner", label: "🌱 Beginner", hint: "I'm starting from zero." },
              { value: "intermediate", label: "🌿 Intermediate", hint: "I know the basics but struggle with problems." },
              { value: "advanced", label: "🌳 Advanced", hint: "I want exam-level mastery." },
            ]}
          />
        ) : step === "goals" ? (
          <GoalsStep
            weeklyHours={weeklyHours}
            setWeeklyHours={setWeeklyHours}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
          />
        ) : step === "language" ? (
          <PickerStep
            icon={<Languages className="size-8 text-[var(--brand-primary)]" aria-hidden="true" />}
            title="Preferred language"
            description="Notes can be generated in your language. UI translations land progressively."
            value={language}
            onPick={setLanguage}
            options={["en", "hi", "ta", "te", "bn"]
              .filter((l) => languages.includes(l) || l === "en")
              .map((l) => ({ value: l, label: { en: "English", hi: "Hindi (हिन्दी)", ta: "Tamil (தமிழ்)", te: "Telugu (తెలుగు)", bn: "Bengali (বাংলা)" }[l] ?? l }))}
          />
        ) : (
          <CompleteStep roadmapPreview={roadmapPreview} />
        )}

        {error ? (
          <p role="alert" className="mt-4 rounded-[var(--radius-md)] bg-[#fef2f2] px-3 py-2 text-[13.5px] font-semibold text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        {step !== "complete" && step !== "welcome" ? (
          <div className="mt-7 flex items-center justify-between gap-3 border-t border-[var(--border-default)] pt-5">
            <button
              type="button"
              onClick={skip}
              disabled={saving}
              className="flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] px-4 py-2 text-[14px] font-bold text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
            >
              <SkipForward className="size-4" aria-hidden="true" /> Skip for now
            </button>
            <Button onClick={() => void goTo(STEPS[Math.min(index + 1, STEPS.length - 1)]!.slug)} loading={saving}>
              Continue <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}

        {step === "welcome" ? (
          <div className="mt-7 flex items-center justify-between gap-3 border-t border-[var(--border-default)] pt-5">
            <button
              type="button"
              onClick={() => void goTo("complete")}
              disabled={saving}
              className="flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] px-4 py-2 text-[14px] font-bold text-[var(--fg-secondary)] hover:bg-[var(--bg-subtle)]"
            >
              <SkipForward className="size-4" aria-hidden="true" /> Skip for now
            </button>
            <Button onClick={() => void goTo("country")} loading={saving}>
              Let&apos;s go <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </Card>

      <p className="mt-4 text-center text-[12.5px] text-[var(--fg-muted)]">
        Every step is skippable — skipping uses sensible defaults (India · CBSE · Class 10) you can change anytime
        in Settings.{" "}
        <Link href="/app" className="font-bold text-[var(--brand-primary)] underline">
          Go straight to the app →
        </Link>
      </p>
    </div>
  );
}

/* ── Step bodies ─────────────────────────────────────────────────── */

function WelcomeStep() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[20px] bg-[#eef2ff]">
        <PartyPopper className="size-8 text-[var(--brand-primary)]" aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl font-extrabold text-[var(--fg-primary)]">Welcome to Sherpa</h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[var(--fg-secondary)]">
        Nine quick steps (all skippable) so we can tailor roadmaps, notes and practice to your board and level.
        Takes under a minute.
      </p>
      <div className="mx-auto mt-5 grid max-w-md gap-2 text-left">
        {[
          "Pick your country and class",
          "Get a roadmap that fits your week",
          "Learn with notes, a Socratic tutor and practice",
        ].map((t) => (
          <p key={t} className="flex items-center gap-2.5 rounded-[var(--radius-md)] bg-[var(--bg-subtle)] px-3.5 py-2.5 text-[14px] font-semibold text-[var(--fg-primary)]">
            <span className="flex size-5 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[11px] font-extrabold text-white">✓</span>
            {t}
          </p>
        ))}
      </div>
    </div>
  );
}

function PickerStep({
  icon,
  title,
  description,
  options,
  value,
  onPick,
  allowEmpty,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  options: { value: string; label: string; hint?: string; popular?: boolean }[];
  value: string;
  onPick: (v: string) => void;
  allowEmpty?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 className="font-display text-xl font-extrabold text-[var(--fg-primary)]">{title}</h2>
          <p className="text-[13.5px] text-[var(--fg-secondary)]">{description}</p>
        </div>
      </div>
      <div role="radiogroup" aria-label={title} className="mt-5 grid gap-2 sm:grid-cols-2">
        {allowEmpty ? (
          <button
            type="button"
            role="radio"
            aria-checked={value === ""}
            onClick={() => onPick("")}
            className={`min-h-11 rounded-[var(--radius-md)] border-2 px-3.5 py-2.5 text-left ${value === "" ? "border-[var(--brand-primary)] bg-[#eef2ff]" : "border-[var(--border-default)] hover:border-[var(--border-strong)]"}`}
          >
            <span className="block text-[14px] font-bold text-[var(--fg-primary)]">No stream</span>
          </button>
        ) : null}
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onPick(o.value)}
            className={`min-h-11 rounded-[var(--radius-md)] border-2 px-3.5 py-2.5 text-left transition-colors ${
              value === o.value
                ? "border-[var(--brand-primary)] bg-[#eef2ff]"
                : "border-[var(--border-default)] hover:border-[var(--border-strong)]"
            }`}
          >
            <span className="block text-[14.5px] font-bold text-[var(--fg-primary)]">
              {o.label}
              {o.popular ? <span className="ml-2 rounded-full bg-[#eef2ff] px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-[var(--brand-primary)]">popular</span> : null}
            </span>
            {o.hint ? <span className="mt-0.5 block text-[12px] leading-snug text-[var(--fg-muted)]">{o.hint}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function GoalsStep({
  weeklyHours,
  setWeeklyHours,
  targetDate,
  setTargetDate,
}: {
  weeklyHours: number;
  setWeeklyHours: (n: number) => void;
  targetDate: string;
  setTargetDate: (d: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Target className="size-8 text-[var(--brand-primary)]" aria-hidden="true" />
        <div>
          <h2 className="font-display text-xl font-extrabold text-[var(--fg-primary)]">How much time do you have?</h2>
          <p className="text-[13.5px] text-[var(--fg-secondary)]">
            Roadmaps are sized to this. You can change it any time.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor="weekly-hours" className="field-label">
          {weeklyHours} hours per week
        </label>
        <input
          id="weekly-hours"
          type="range"
          min={1}
          max={30}
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(Number(e.target.value))}
          className="w-full accent-[var(--brand-primary)]"
        />
        <div className="flex justify-between text-[11.5px] font-semibold text-[var(--fg-muted)]">
          <span>1h</span>
          <span>30h</span>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="target-date" className="field-label">
          Target exam date (optional — unlocks the exam-readiness gauge)
        </label>
        <input
          id="target-date"
          type="date"
          className="input max-w-xs"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
        />
      </div>
    </div>
  );
}

function CompleteStep({
  roadmapPreview,
}: {
  roadmapPreview: { title: string; total_weeks: number; phases: { name: string }[]; chapterSlug: string; chapterName: string } | null;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[20px] bg-[#ecfdf5]">
        <PartyPopper className="size-8 text-[#059669]" aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl font-extrabold text-[var(--fg-primary)]">Your first roadmap is ready 🎉</h2>
      {roadmapPreview ? (
        <div className="mx-auto mt-4 max-w-md rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 text-left">
          <p className="font-display text-[15px] font-extrabold text-[var(--fg-primary)]">{roadmapPreview.title}</p>
          <p className="mt-0.5 text-[13px] text-[var(--fg-secondary)]">
            {roadmapPreview.total_weeks} weeks · {roadmapPreview.phases.length} phases
          </p>
          <ol className="mt-3 space-y-1.5">
            {roadmapPreview.phases.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-[13.5px] font-semibold text-[var(--fg-primary)]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[10.5px] font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="truncate">{p.name}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="mx-auto mt-3 max-w-md text-[14.5px] text-[var(--fg-secondary)]">
          <Loader2 className="mr-1 inline size-4 animate-spin" aria-hidden="true" />
          Building your first roadmap…
        </p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {roadmapPreview ? (
          <Link href={`/app/chapters/${roadmapPreview.chapterSlug}?tab=roadmap`} className="btn btn-primary">
            View roadmap <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
        <Link href="/app" className="btn btn-secondary">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

function AutoAdvance({ message, onDone }: { message: string; onDone: () => void }) {
  React.useEffect(() => {
    const t = window.setTimeout(onDone, 900);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div className="py-6 text-center">
      <Loader2 className="mx-auto size-6 animate-spin text-[var(--brand-primary)]" aria-hidden="true" />
      <p className="mt-3 text-[14.5px] font-semibold text-[var(--fg-secondary)]">{message}</p>
    </div>
  );
}
