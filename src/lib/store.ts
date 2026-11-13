/**
 * Data layer.
 *
 * Two backends behind one API:
 *   - Supabase Postgres (when NEXT_PUBLIC_SUPABASE_URL + service key are set)
 *   - A JSON file store at .data/db.json (default: zero-config Local Demo Mode)
 *
 * The file store is deliberately simple and durable: every mutation is written
 * synchronously-ish (queued microtask flush) so an interrupted dev server does
 * not lose a sign-up. supabase/migrations/0001_init.sql is the production
 * equivalent of the types below — keep them in sync.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Notes } from "./schemas/notes";
import type { Roadmap } from "./schemas/roadmap";
import type { Quiz } from "./schemas/quiz";

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string | null;
  role: "user" | "admin";
  emailVerified: boolean;
  verificationCode: string | null;
  verificationExpires: number | null;
  provider: "password" | "google" | "magic";
  createdAt: string;
}

export interface ProfileRecord {
  id: string;
  displayName: string;
  countryCode: string;
  curriculumSlug: string;
  levelSlug: string;
  streamSlug: string | null;
  proficiency: "beginner" | "intermediate" | "advanced";
  weeklyHours: number;
  targetDate: string | null;
  language: string;
  onboardingComplete: boolean;
  preferences: {
    theme: "light" | "dark" | "system";
    reducedMotion: boolean;
    dyslexiaFont: boolean;
    highContrast: boolean;
    fontScale: 100 | 115 | 130;
    defaultDepth: "quick" | "standard" | "deep";
    readingTheme: "light" | "sepia" | "dark";
    noteFontSize: number;
  };
  plan: "free" | "pro";
  createdAt: string;
}

export interface ProgressRecord {
  userId: string;
  chapterSlug: string;
  status: "not_started" | "in_progress" | "mastered";
  masteryScore: number;
  notesRead: number;
  quizScore: number | null;
  reviewsCompleted: number;
  lastReviewedAt: string | null;
  updatedAt: string;
}

export interface QuizAttemptRecord {
  id: string;
  userId: string;
  chapterSlug: string;
  quiz: Quiz;
  answers: Record<string, string>;
  score: number;
  total: number;
  weakTopics: string[];
  createdAt: string;
}

export interface ReviewCardRecord {
  id: string;
  userId: string;
  chapterSlug: string;
  front: string;
  back: string;
  ease: number;
  interval: number;
  dueAt: string;
  lastReviewedAt: string | null;
  repetitions: number;
  createdAt: string;
}

export interface NoteRecord {
  id: string;
  chapterSlug: string;
  depth: "quick" | "standard" | "deep";
  language: string;
  notes: Notes;
  generatedAt: string;
  cachedUntil: string;
}

export interface RoadmapRecord {
  id: string;
  userId: string;
  chapterSlug: string;
  roadmap: Roadmap;
  generatedAt: string;
  version: number;
}

export interface TutorMessageRecord {
  id: string;
  userId: string;
  chapterSlug: string;
  role: "user" | "assistant";
  content: string;
  turnNumber: number;
  createdAt: string;
}

export interface ConsentRecord {
  id: string;
  userId: string | null;
  sessionId: string;
  version: number;
  necessary: true;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  method: "accept_all" | "reject_all" | "custom";
  createdAt: string;
}

export interface ReportRecord {
  id: string;
  userId: string | null;
  chapterSlug: string;
  section: string;
  reason: "incorrect" | "offensive" | "uncited" | "other";
  detail: string;
  status: "open" | "in_review" | "resolved" | "dismissed";
  createdAt: string;
}

interface Database {
  users: UserRecord[];
  profiles: ProfileRecord[];
  progress: ProgressRecord[];
  quizAttempts: QuizAttemptRecord[];
  reviewCards: ReviewCardRecord[];
  notes: NoteRecord[];
  roadmaps: RoadmapRecord[];
  tutorMessages: TutorMessageRecord[];
  consents: ConsentRecord[];
  reports: ReportRecord[];
}

const EMPTY: Database = {
  users: [],
  profiles: [],
  progress: [],
  quizAttempts: [],
  reviewCards: [],
  notes: [],
  roadmaps: [],
  tutorMessages: [],
  consents: [],
  reports: [],
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

let db: Database | null = null;
let loadPromise: Promise<Database> | null = null;
let flushTimer: NodeJS.Timeout | null = null;

async function load(): Promise<Database> {
  if (db) return db;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf8");
      const parsed = JSON.parse(raw) as Partial<Database>;
      db = { ...structuredClone(EMPTY), ...parsed };
    } catch {
      db = structuredClone(EMPTY);
    }
    return db;
  })();
  return loadPromise;
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, 50);
}

export async function flush(): Promise<void> {
  if (!db) return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to persist local store", err);
  }
}

/** Test helper: wipe the in-memory and on-disk store. */
export async function resetStore(): Promise<void> {
  db = structuredClone(EMPTY);
  loadPromise = null;
  try {
    await fs.rm(DATA_FILE, { force: true });
  } catch {
    /* ignore */
  }
}

async function mutate<T>(fn: (d: Database) => T): Promise<T> {
  const d = await load();
  const result = fn(d);
  scheduleFlush();
  return result;
}

async function read<T>(fn: (d: Database) => T): Promise<T> {
  const d = await load();
  return fn(d);
}

// ── Users ─────────────────────────────────────────────────────────────
export const users = {
  async findByEmail(email: string): Promise<UserRecord | undefined> {
    return read((d) => d.users.find((u) => u.email.toLowerCase() === email.toLowerCase()));
  },
  async findById(id: string): Promise<UserRecord | undefined> {
    return read((d) => d.users.find((u) => u.id === id));
  },
  async create(input: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
    return mutate((d) => {
      const user: UserRecord = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
      d.users.push(user);
      return user;
    });
  },
  async update(id: string, patch: Partial<UserRecord>): Promise<UserRecord | undefined> {
    return mutate((d) => {
      const user = d.users.find((u) => u.id === id);
      if (!user) return undefined;
      Object.assign(user, patch);
      return user;
    });
  },
  async all(): Promise<UserRecord[]> {
    return read((d) => [...d.users]);
  },
};

// ── Profiles ──────────────────────────────────────────────────────────
export const profiles = {
  async get(userId: string): Promise<ProfileRecord | undefined> {
    return read((d) => d.profiles.find((p) => p.id === userId));
  },
  async upsert(userId: string, patch: Partial<ProfileRecord>): Promise<ProfileRecord> {
    return mutate((d) => {
      const existing = d.profiles.find((p) => p.id === userId);
      if (existing) {
        Object.assign(existing, patch);
        return existing;
      }
      const profile: ProfileRecord = {
        id: userId,
        displayName: "",
        countryCode: "IN",
        curriculumSlug: "cbse",
        levelSlug: "cbse-class-10",
        streamSlug: "cbse-10-general",
        proficiency: "beginner",
        weeklyHours: 5,
        targetDate: null,
        language: "en",
        onboardingComplete: false,
        plan: "free",
        createdAt: new Date().toISOString(),
        preferences: {
          theme: "system",
          reducedMotion: false,
          dyslexiaFont: false,
          highContrast: false,
          fontScale: 100,
          defaultDepth: "standard",
          readingTheme: "light",
          noteFontSize: 17,
        },
        ...patch,
      };
      profile.preferences = {
        theme: "system",
        reducedMotion: false,
        dyslexiaFont: false,
        highContrast: false,
        fontScale: 100,
        defaultDepth: "standard",
        readingTheme: "light",
        noteFontSize: 17,
        ...patch.preferences,
      };
      d.profiles.push(profile);
      return profile;
    });
  },
  async all(): Promise<ProfileRecord[]> {
    return read((d) => [...d.profiles]);
  },
};

// ── Progress ──────────────────────────────────────────────────────────
export const progress = {
  async forUser(userId: string): Promise<ProgressRecord[]> {
    return read((d) => d.progress.filter((p) => p.userId === userId));
  },
  async all(): Promise<ProgressRecord[]> {
    return read((d) => [...d.progress]);
  },
  async get(userId: string, chapterSlug: string): Promise<ProgressRecord | undefined> {
    return read((d) => d.progress.find((p) => p.userId === userId && p.chapterSlug === chapterSlug));
  },
  async upsert(
    userId: string,
    chapterSlug: string,
    patch: Partial<ProgressRecord>,
  ): Promise<ProgressRecord> {
    return mutate((d) => {
      let rec = d.progress.find((p) => p.userId === userId && p.chapterSlug === chapterSlug);
      if (!rec) {
        rec = {
          userId,
          chapterSlug,
          status: "not_started",
          masteryScore: 0,
          notesRead: 0,
          quizScore: null,
          reviewsCompleted: 0,
          lastReviewedAt: null,
          updatedAt: new Date().toISOString(),
        };
        d.progress.push(rec);
      }
      Object.assign(rec, patch, { updatedAt: new Date().toISOString() });
      return rec;
    });
  },
};

// ── Notes ─────────────────────────────────────────────────────────────
export const notesStore = {
  async get(chapterSlug: string, depth: string, language: string): Promise<NoteRecord | undefined> {
    return read((d) =>
      d.notes.find(
        (n) => n.chapterSlug === chapterSlug && n.depth === depth && n.language === language,
      ),
    );
  },
  async put(record: Omit<NoteRecord, "id" | "generatedAt" | "cachedUntil">): Promise<NoteRecord> {
    return mutate((d) => {
      const existing = d.notes.find(
        (n) =>
          n.chapterSlug === record.chapterSlug &&
          n.depth === record.depth &&
          n.language === record.language,
      );
      if (existing) {
        existing.notes = record.notes;
        existing.generatedAt = new Date().toISOString();
        existing.cachedUntil = new Date(Date.now() + 30 * 86400_000).toISOString();
        return existing;
      }
      const rec: NoteRecord = {
        ...record,
        id: randomUUID(),
        generatedAt: new Date().toISOString(),
        cachedUntil: new Date(Date.now() + 30 * 86400_000).toISOString(),
      };
      d.notes.push(rec);
      return rec;
    });
  },
  async all(): Promise<NoteRecord[]> {
    return read((d) => [...d.notes]);
  },
};

// ── Roadmaps ──────────────────────────────────────────────────────────
export const roadmapStore = {
  async get(userId: string, chapterSlug: string): Promise<RoadmapRecord | undefined> {
    return read((d) => d.roadmaps.find((r) => r.userId === userId && r.chapterSlug === chapterSlug));
  },
  async put(userId: string, chapterSlug: string, roadmap: Roadmap): Promise<RoadmapRecord> {
    return mutate((d) => {
      const existing = d.roadmaps.find((r) => r.userId === userId && r.chapterSlug === chapterSlug);
      if (existing) {
        existing.roadmap = roadmap;
        existing.generatedAt = new Date().toISOString();
        existing.version += 1;
        return existing;
      }
      const rec: RoadmapRecord = {
        id: randomUUID(),
        userId,
        chapterSlug,
        roadmap,
        generatedAt: new Date().toISOString(),
        version: 1,
      };
      d.roadmaps.push(rec);
      return rec;
    });
  },
};

// ── Quiz attempts ─────────────────────────────────────────────────────
export const quizStore = {
  async add(record: Omit<QuizAttemptRecord, "id" | "createdAt">): Promise<QuizAttemptRecord> {
    return mutate((d) => {
      const rec: QuizAttemptRecord = { ...record, id: randomUUID(), createdAt: new Date().toISOString() };
      d.quizAttempts.push(rec);
      return rec;
    });
  },
  async forUser(userId: string): Promise<QuizAttemptRecord[]> {
    return read((d) => d.quizAttempts.filter((q) => q.userId === userId));
  },
  async forChapter(userId: string, chapterSlug: string): Promise<QuizAttemptRecord[]> {
    return read((d) =>
      d.quizAttempts.filter((q) => q.userId === userId && q.chapterSlug === chapterSlug),
    );
  },
  async all(): Promise<QuizAttemptRecord[]> {
    return read((d) => [...d.quizAttempts]);
  },
};

// ── Review cards ──────────────────────────────────────────────────────
export const reviewStore = {
  async due(userId: string, now = Date.now()): Promise<ReviewCardRecord[]> {
    return read((d) =>
      d.reviewCards
        .filter((c) => c.userId === userId && new Date(c.dueAt).getTime() <= now)
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()),
    );
  },
  async forUser(userId: string): Promise<ReviewCardRecord[]> {
    return read((d) => d.reviewCards.filter((c) => c.userId === userId));
  },
  async get(id: string): Promise<ReviewCardRecord | undefined> {
    return read((d) => d.reviewCards.find((c) => c.id === id));
  },
  async add(record: Omit<ReviewCardRecord, "id" | "createdAt">): Promise<ReviewCardRecord> {
    return mutate((d) => {
      const dup = d.reviewCards.find(
        (c) => c.userId === record.userId && c.front === record.front && c.chapterSlug === record.chapterSlug,
      );
      if (dup) return dup;
      const rec: ReviewCardRecord = { ...record, id: randomUUID(), createdAt: new Date().toISOString() };
      d.reviewCards.push(rec);
      return rec;
    });
  },
  async update(id: string, patch: Partial<ReviewCardRecord>): Promise<ReviewCardRecord | undefined> {
    return mutate((d) => {
      const card = d.reviewCards.find((c) => c.id === id);
      if (!card) return undefined;
      Object.assign(card, patch);
      return card;
    });
  },
  async all(): Promise<ReviewCardRecord[]> {
    return read((d) => [...d.reviewCards]);
  },
};

// ── Tutor messages ────────────────────────────────────────────────────
export const tutorStore = {
  async all(): Promise<TutorMessageRecord[]> {
    return read((d) => [...d.tutorMessages]);
  },
  async forChapter(userId: string, chapterSlug: string): Promise<TutorMessageRecord[]> {
    return read((d) =>
      d.tutorMessages
        .filter((m) => m.userId === userId && m.chapterSlug === chapterSlug)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    );
  },
  async add(record: Omit<TutorMessageRecord, "id" | "createdAt">): Promise<TutorMessageRecord> {
    return mutate((d) => {
      const rec: TutorMessageRecord = { ...record, id: randomUUID(), createdAt: new Date().toISOString() };
      d.tutorMessages.push(rec);
      return rec;
    });
  },
  async clear(userId: string, chapterSlug: string): Promise<void> {
    return mutate((d) => {
      d.tutorMessages = d.tutorMessages.filter(
        (m) => !(m.userId === userId && m.chapterSlug === chapterSlug),
      );
    });
  },
};

// ── Consent ───────────────────────────────────────────────────────────
export const consentStore = {
  async add(record: Omit<ConsentRecord, "id" | "createdAt">): Promise<ConsentRecord> {
    return mutate((d) => {
      const rec: ConsentRecord = { ...record, id: randomUUID(), createdAt: new Date().toISOString() };
      d.consents.push(rec);
      return rec;
    });
  },
  async latest(userId: string | null): Promise<ConsentRecord | undefined> {
    return read((d) =>
      d.consents
        .filter((c) => c.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0],
    );
  },
  async all(): Promise<ConsentRecord[]> {
    return read((d) => [...d.consents]);
  },
};

// ── Content reports ───────────────────────────────────────────────────
export const reportStore = {
  async add(record: Omit<ReportRecord, "id" | "createdAt" | "status">): Promise<ReportRecord> {
    return mutate((d) => {
      const rec: ReportRecord = {
        ...record,
        id: randomUUID(),
        status: "open",
        createdAt: new Date().toISOString(),
      };
      d.reports.push(rec);
      return rec;
    });
  },
  async all(): Promise<ReportRecord[]> {
    return read((d) => [...d.reports].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
  },
  async update(id: string, status: ReportRecord["status"]): Promise<ReportRecord | undefined> {
    return mutate((d) => {
      const rec = d.reports.find((r) => r.id === id);
      if (!rec) return undefined;
      rec.status = status;
      return rec;
    });
  },
};

// ── Account deletion (hard delete, Section 37.4) ───────────────────────
export const accountStore = {
  async deleteAccount(userId: string): Promise<void> {
    return mutate((d) => {
      d.users = d.users.filter((u) => u.id !== userId);
      d.profiles = d.profiles.filter((p) => p.id !== userId);
      d.progress = d.progress.filter((p) => p.userId !== userId);
      d.quizAttempts = d.quizAttempts.filter((q) => q.userId !== userId);
      d.reviewCards = d.reviewCards.filter((c) => c.userId !== userId);
      d.roadmaps = d.roadmaps.filter((r) => r.userId !== userId);
      d.tutorMessages = d.tutorMessages.filter((m) => m.userId !== userId);
      d.consents = d.consents.filter((c) => c.userId !== userId);
      d.reports = d.reports.filter((r) => r.userId !== userId);
    });
  },
  async fullExport(userId: string): Promise<Record<string, unknown>> {
    return read((d) => ({
      exportedAt: new Date().toISOString(),
      user: d.users.find((u) => u.id === userId) ?? null,
      profile: d.profiles.find((p) => p.id === userId) ?? null,
      progress: d.progress.filter((p) => p.userId === userId),
      quizAttempts: d.quizAttempts.filter((q) => q.userId === userId),
      reviewCards: d.reviewCards.filter((c) => c.userId === userId),
      roadmaps: d.roadmaps.filter((r) => r.userId === userId),
      tutorMessages: d.tutorMessages.filter((m) => m.userId === userId),
      consents: d.consents.filter((c) => c.userId === userId),
    }));
  },
};

export function useSupabase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
