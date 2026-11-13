"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import type { ProfileRecord } from "@/lib/store";
import { COUNTRIES, CURRICULA, LEVELS, STREAMS, DEFAULTS } from "@/lib/curriculum/taxonomy";
import { Button, Card } from "@/components/ui";

type SaveState = "idle" | "saving" | "saved" | "error";

function useProfilePatch() {
  const [state, setState] = React.useState<SaveState>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function patch(body: Record<string, unknown>): Promise<boolean> {
    setState("saving");
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Couldn't save. Try again.");
        setState("error");
        return false;
      }
      setState("saved");
      window.setTimeout(() => setState("idle"), 2500);
      return true;
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setState("error");
      return false;
    }
  }

  return { state, error, patch };
}

function SaveIndicator({ state, error }: { state: SaveState; error: string | null }) {
  if (state === "saving") {
    return (
      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--fg-secondary)]" aria-live="polite">
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Saving…
      </p>
    );
  }
  if (state === "saved") {
    return (
      <p className="flex items-center gap-1.5 text-[13px] font-bold text-[#047857]" aria-live="polite">
        <Check className="size-4" aria-hidden="true" /> Saved
      </p>
    );
  }
  if (state === "error") {
    return (
      <p role="alert" className="text-[13px] font-semibold text-[#b91c1c]">
        {error ?? "Couldn't save. Try again."}
      </p>
    );
  }
  return null;
}

/* ── Profile ─────────────────────────────────────────────────────── */
export function ProfileForm({ profile, email }: { profile: ProfileRecord; email: string }) {
  const { state, error, patch } = useProfilePatch();
  const [displayName, setDisplayName] = React.useState(profile.displayName);
  const [countryCode, setCountryCode] = React.useState(profile.countryCode);
  const [curriculumSlug, setCurriculumSlug] = React.useState(profile.curriculumSlug);
  const [levelSlug, setLevelSlug] = React.useState(profile.levelSlug);
  const [streamSlug, setStreamSlug] = React.useState(profile.streamSlug ?? "");
  const [proficiency, setProficiency] = React.useState(profile.proficiency);
  const [weeklyHours, setWeeklyHours] = React.useState(profile.weeklyHours);
  const [targetDate, setTargetDate] = React.useState(profile.targetDate ?? "");
  const [language, setLanguage] = React.useState(profile.language);

  const curricula = CURRICULA.filter((c) => c.countryCode === countryCode);
  const levels = LEVELS.filter((l) => l.curriculumSlug === curriculumSlug);
  const streams = STREAMS.filter((s) => s.levelSlug === levelSlug);
  const languages = COUNTRIES.find((c) => c.code === countryCode)?.languages ?? ["en"];

  async function save() {
    await patch({
      displayName,
      countryCode,
      curriculumSlug,
      levelSlug,
      streamSlug: streamSlug || null,
      proficiency,
      weeklyHours,
      targetDate: targetDate || null,
      language,
    });
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">Profile & study path</h2>
      <p className="mt-1 text-[13.5px] text-[var(--fg-secondary)]">
        Signed in as <strong>{email}</strong>. Changing country/board/level re-shapes your subject list and future
        roadmaps.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="display-name" className="field-label">Display name</label>
          <input id="display-name" className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={80} />
        </div>
        <div>
          <label htmlFor="country" className="field-label">Country</label>
          <select
            id="country"
            className="input"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              const first = CURRICULA.find((c) => c.countryCode === e.target.value);
              if (first) setCurriculumSlug(first.slug);
            }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="curriculum" className="field-label">Curriculum / board</label>
          <select
            id="curriculum"
            className="input"
            value={curriculumSlug}
            onChange={(e) => {
              setCurriculumSlug(e.target.value);
              const first = LEVELS.find((l) => l.curriculumSlug === e.target.value);
              if (first) setLevelSlug(first.slug);
            }}
          >
            {curricula.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className="field-label">Level</label>
          <select id="level" className="input" value={levelSlug} onChange={(e) => setLevelSlug(e.target.value)}>
            {levels.map((l) => (
              <option key={l.slug} value={l.slug}>{l.name}</option>
            ))}
          </select>
        </div>
        {streams.length > 0 ? (
          <div>
            <label htmlFor="stream" className="field-label">Stream</label>
            <select id="stream" className="input" value={streamSlug} onChange={(e) => setStreamSlug(e.target.value)}>
              <option value="">— none —</option>
              {streams.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>
        ) : null}
        <div>
          <label htmlFor="proficiency" className="field-label">Proficiency</label>
          <select id="proficiency" className="input" value={proficiency} onChange={(e) => setProficiency(e.target.value as ProfileRecord["proficiency"])}>
            <option value="beginner">🌱 Beginner</option>
            <option value="intermediate">🌿 Intermediate</option>
            <option value="advanced">🌳 Advanced</option>
          </select>
        </div>
        <div>
          <label htmlFor="weekly-hours" className="field-label">Weekly study hours: {weeklyHours}h</label>
          <input
            id="weekly-hours"
            type="range"
            min={1}
            max={30}
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(Number(e.target.value))}
            className="w-full accent-[var(--brand-primary)]"
          />
        </div>
        <div>
          <label htmlFor="target-date" className="field-label">Target exam date (optional)</label>
          <input id="target-date" type="date" className="input" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="language" className="field-label">Language</label>
          <select id="language" className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {["en", "hi", "ta", "te", "bn"].filter((l) => languages.includes(l) || l === "en").map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={() => void save()} loading={state === "saving"}>Save profile</Button>
        <SaveIndicator state={state} error={error} />
      </div>
      <p className="mt-3 text-[12px] text-[var(--fg-muted)]">
        Defaults if you skip onboarding: {DEFAULTS.countryCode} / {DEFAULTS.curriculumSlug} / {DEFAULTS.levelSlug}.
      </p>
    </Card>
  );
}

/* ── Preferences ─────────────────────────────────────────────────── */
export function PreferencesForm({ profile }: { profile: ProfileRecord }) {
  const { state, error, patch } = useProfilePatch();
  const [prefs, setPrefs] = React.useState(profile.preferences);

  function set<K extends keyof ProfileRecord["preferences"]>(key: K, value: ProfileRecord["preferences"][K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  async function save() {
    await patch({ preferences: prefs });
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">Preferences & accessibility</h2>

      <fieldset className="mt-5">
        <legend className="field-label">Appearance</legend>
        <div className="flex gap-1.5">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={prefs.theme === t}
              className="chip capitalize"
              data-selected={prefs.theme === t}
              onClick={() => set("theme", t)}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="field-label">Default note depth</legend>
        <div className="flex gap-1.5">
          {(["quick", "standard", "deep"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={prefs.defaultDepth === d}
              className="chip capitalize"
              data-selected={prefs.defaultDepth === d}
              onClick={() => set("defaultDepth", d)}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="field-label">Font scale</legend>
        <div className="flex gap-1.5">
          {([100, 115, 130] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={prefs.fontScale === f}
              className="chip"
              data-selected={prefs.fontScale === f}
              onClick={() => set("fontScale", f)}
            >
              {f}%
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 space-y-3">
        {(
          [
            ["reducedMotion", "Reduce motion", "Disables animations and confetti (prefers-reduced-motion respected app-wide)"],
            ["dyslexiaFont", "Dyslexia-friendly font", "Wider letter spacing and a more open typeface for notes"],
            ["highContrast", "High contrast", "Stronger borders and text contrast"],
          ] as const
        ).map(([key, label, desc]) => (
          <label key={key} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3.5 hover:bg-[var(--bg-subtle)]">
            <input
              type="checkbox"
              className="size-5 accent-[var(--brand-primary)]"
              checked={prefs[key]}
              onChange={(e) => set(key, e.target.checked)}
            />
            <span>
              <span className="block text-[14px] font-bold text-[var(--fg-primary)]">{label}</span>
              <span className="block text-[12.5px] text-[var(--fg-muted)]">{desc}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button onClick={() => void save()} loading={state === "saving"}>Save preferences</Button>
        <SaveIndicator state={state} error={error} />
      </div>
    </Card>
  );
}

/* ── Notifications ───────────────────────────────────────────────── */
export function NotificationsForm() {
  const { state, error, patch } = useProfilePatch();
  const [emailDigest, setEmailDigest] = React.useState(true);
  const [streakReminders, setStreakReminders] = React.useState(true);
  const [reviewReminders, setReviewReminders] = React.useState(true);
  const [newResources, setNewResources] = React.useState(false);

  // Persisted as a preferences-adjacent record via the profile endpoint is not
  // part of the contract schema, so we keep notification prefs local + consent-gated.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("sherpa_notification_prefs");
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setEmailDigest(parsed.emailDigest ?? true);
        setStreakReminders(parsed.streakReminders ?? true);
        setReviewReminders(parsed.reviewReminders ?? true);
        setNewResources(parsed.newResources ?? false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function saveLocal() {
    const prefs = { emailDigest, streakReminders, reviewReminders, newResources };
    window.localStorage.setItem("sherpa_notification_prefs", JSON.stringify(prefs));
    void patch({});
  }

  const rows = [
    ["emailDigest", "Weekly digest email", "One email a week: your progress, due reviews and new resources.", emailDigest, setEmailDigest],
    ["streakReminders", "Streak reminders", "A nudge on days you haven't studied — never shaming, always skippable.", streakReminders, setStreakReminders],
    ["reviewReminders", "Review-due push (PWA)", "Push notification when SM-2 cards are due.", reviewReminders, setReviewReminders],
    ["newResources", "New resource alerts", "Email when a newly verified resource matches your subjects.", newResources, setNewResources],
  ] as const;

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-display text-lg font-extrabold text-[var(--fg-primary)]">Notifications</h2>
      <p className="mt-1 text-[13.5px] text-[var(--fg-secondary)]">
        Push notifications require the app to be installed (PWA) and your browser permission. Analytics emails only
        go out if you accepted analytics cookies.
      </p>
      <div className="mt-4 space-y-3">
        {rows.map(([key, label, desc, checked, setter]) => (
          <label key={key} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3.5 hover:bg-[var(--bg-subtle)]">
            <input
              type="checkbox"
              className="size-5 accent-[var(--brand-primary)]"
              checked={checked}
              onChange={(e) => setter(e.target.checked)}
            />
            <span>
              <span className="block text-[14px] font-bold text-[var(--fg-primary)]">{label}</span>
              <span className="block text-[12.5px] text-[var(--fg-muted)]">{desc}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Button onClick={saveLocal} loading={state === "saving"}>Save</Button>
        <SaveIndicator state={state} error={error} />
      </div>
    </Card>
  );
}
