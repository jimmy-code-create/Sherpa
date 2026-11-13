-- ============================================================================
-- Sherpa — 0001_init.sql
-- Full schema for the Supabase (Postgres) backend. Mirrors the local demo
-- store types in src/lib/store.ts — keep the two in sync.
--
-- Run:  supabase db push   (or paste into the SQL editor)
-- Then: psql -f supabase/seed.sql
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ── Taxonomy ────────────────────────────────────────────────────────────────
create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  code char(2) not null unique,
  name text not null,
  flag text,
  languages text[] not null default '{en}',
  popular boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists curricula (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  country_id uuid not null references countries(id) on delete cascade,
  name text not null,
  description text,
  is_international boolean not null default false,
  created_at timestamptz not null default now()
);

do $$ begin
  create type level_stage as enum (
  'primary','middle','secondary','senior_secondary','ug','pg','doctorate','competitive'
);
exception when duplicate_object then null; end $$;

create table if not exists levels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  curriculum_id uuid not null references curricula(id) on delete cascade,
  name text not null,
  ordinal int not null,
  stage level_stage not null,
  created_at timestamptz not null default now()
);

create table if not exists streams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  level_id uuid not null references levels(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  stream_id uuid not null references streams(id) on delete cascade,
  name text not null,
  icon text,
  color text,
  blurb text,
  created_at timestamptz not null default now()
);

do $$ begin
  create type syllabus_weight as enum ('low','medium','high');
exception when duplicate_object then null; end $$;

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  subject_id uuid not null references subjects(id) on delete cascade,
  name text not null,
  "order" int not null,
  syllabus_weight syllabus_weight not null default 'medium',
  estimated_hours numeric not null default 4,
  prerequisites uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

do $$ begin
  create type difficulty as enum ('easy','medium','hard');
exception when duplicate_object then null; end $$;

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  name text not null,
  difficulty difficulty not null default 'medium',
  created_at timestamptz not null default now()
);

-- ── Resources (allowlist) ───────────────────────────────────────────────────
do $$ begin
  create type resource_type as enum ('video','course','book','pdf','practice');
exception when duplicate_object then null; end $$;
do $$ begin
  create type cost_type as enum ('free','freemium','paid');
exception when duplicate_object then null; end $$;

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  title text not null,
  url text not null unique,               -- allowlist: only these may render
  type resource_type not null,
  language text not null default 'en',
  cost cost_type not null default 'free',
  countries text[] not null default '{}',
  levels text[] not null default '{}',
  subjects text[] not null default '{}',  -- subject slugs
  chapters uuid[] not null default '{}',
  quality_score numeric(3,1) not null default 5.0 check (quality_score between 0 and 10),
  verified_at timestamptz,
  verified boolean not null default false,
  disclosure text,
  created_at timestamptz not null default now()
);

-- ── Profiles (extends auth.users) ───────────────────────────────────────────
do $$ begin
  create type proficiency as enum ('beginner','intermediate','advanced');
exception when duplicate_object then null; end $$;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  country_id uuid references countries(id),
  curriculum_id uuid references curricula(id),
  level_id uuid references levels(id),
  stream_id uuid references streams(id),
  proficiency proficiency not null default 'beginner',
  weekly_hours int not null default 5 check (weekly_hours between 1 and 30),
  target_date date,
  language text not null default 'en',
  onboarding_complete boolean not null default false,
  plan text not null default 'free' check (plan in ('free','pro')),
  role text not null default 'user' check (role in ('user','admin')),
  preferences jsonb not null default '{
    "theme": "system", "reducedMotion": false, "dyslexiaFont": false,
    "highContrast": false, "fontScale": 100, "defaultDepth": "standard",
    "readingTheme": "light", "noteFontSize": 17
  }'::jsonb,
  created_at timestamptz not null default now()
);

-- ── Learning artifacts ──────────────────────────────────────────────────────
create table if not exists roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references chapters(id) on delete cascade,
  phases_json jsonb not null,              -- RoadmapSchema
  generated_at timestamptz not null default now(),
  version int not null default 1,
  unique (user_id, chapter_id)
);

do $$ begin
  create type note_depth as enum ('quick','standard','deep');
exception when duplicate_object then null; end $$;

create table if not exists note_artifacts (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  depth note_depth not null,
  language text not null default 'en',
  content_md text,
  sections_json jsonb not null,            -- NotesSchema
  citations_json jsonb not null default '[]'::jsonb,
  version int not null default 1,
  generated_at timestamptz not null default now(),
  cached_until timestamptz not null default now() + interval '30 days',
  unique (chapter_id, depth, language, version)
);

do $$ begin
  create type progress_status as enum ('not_started','in_progress','mastered');
exception when duplicate_object then null; end $$;

create table if not exists progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references chapters(id) on delete cascade,
  status progress_status not null default 'not_started',
  mastery_score int not null default 0 check (mastery_score between 0 and 100),
  notes_read int not null default 0 check (notes_read between 0 and 3),
  quiz_score int check (quiz_score between 0 and 100),
  reviews_completed int not null default 0,
  last_reviewed timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references chapters(id) on delete cascade,
  questions_json jsonb not null,           -- QuizSchema
  answers_json jsonb not null default '{}'::jsonb,
  score int not null,
  total int not null,
  weak_topics text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ── Spaced repetition (SM-2) ────────────────────────────────────────────────
create table if not exists spaced_rep_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references chapters(id) on delete cascade,
  topic_id uuid references topics(id) on delete set null,
  front text not null,
  back text not null,
  ease numeric not null default 2.5 check (ease >= 1.3),
  interval int not null default 1,
  repetitions int not null default 0,
  due_at timestamptz not null default now(),
  last_reviewed timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists srs_due_idx on spaced_rep_cards (user_id, due_at);

-- ── Consent log ─────────────────────────────────────────────────────────────
do $$ begin
  create type consent_method as enum ('accept_all','reject_all','custom');
exception when duplicate_object then null; end $$;

create table if not exists consent_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  version int not null default 1,
  necessary boolean not null default true,
  analytics boolean not null default false,
  personalization boolean not null default false,
  marketing boolean not null default false,
  method consent_method not null,
  created_at timestamptz not null default now()
);

-- ── Content reports ─────────────────────────────────────────────────────────
do $$ begin
  create type report_reason as enum ('incorrect','offensive','uncited','other');
exception when duplicate_object then null; end $$;
do $$ begin
  create type report_status as enum ('open','in_review','resolved','dismissed');
exception when duplicate_object then null; end $$;

create table if not exists content_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  chapter_id uuid not null references chapters(id) on delete cascade,
  section text not null,
  reason report_reason not null,
  detail text,
  status report_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ── Tutor messages ──────────────────────────────────────────────────────────
create table if not exists tutor_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references chapters(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  turn_number int not null,
  created_at timestamptz not null default now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table roadmaps enable row level security;
alter table note_artifacts enable row level security;
alter table progress enable row level security;
alter table quiz_attempts enable row level security;
alter table spaced_rep_cards enable row level security;
alter table consent_log enable row level security;
alter table content_reports enable row level security;
alter table tutor_messages enable row level security;

-- Profiles: own row only; admins read all.

-- Roadmaps

-- Notes are shared, read-only for authenticated users.

-- Progress

-- Quizzes

-- Spaced repetition

-- Consent: anyone may insert (anonymous consent is allowed); users read their own.

-- Content reports: insert own, select own; admins handled via service role.

-- Tutor messages

-- Taxonomy + resources are public read.
do $$ begin
  create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
  create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
  create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
  create policy "roadmaps_select_own" on roadmaps for select using (auth.uid() = user_id);
  create policy "roadmaps_insert_own" on roadmaps for insert with check (auth.uid() = user_id);
  create policy "roadmaps_update_own" on roadmaps for update using (auth.uid() = user_id);
  create policy "roadmaps_delete_own" on roadmaps for delete using (auth.uid() = user_id);
  create policy "notes_select_any_auth" on note_artifacts for select using (auth.role() = 'authenticated');
  create policy "progress_select_own" on progress for select using (auth.uid() = user_id);
  create policy "progress_upsert_own" on progress for insert with check (auth.uid() = user_id);
  create policy "progress_update_own" on progress for update using (auth.uid() = user_id);
  create policy "quiz_select_own" on quiz_attempts for select using (auth.uid() = user_id);
  create policy "quiz_insert_own" on quiz_attempts for insert with check (auth.uid() = user_id);
  create policy "srs_select_own" on spaced_rep_cards for select using (auth.uid() = user_id);
  create policy "srs_insert_own" on spaced_rep_cards for insert with check (auth.uid() = user_id);
  create policy "srs_update_own" on spaced_rep_cards for update using (auth.uid() = user_id);
  create policy "srs_delete_own" on spaced_rep_cards for delete using (auth.uid() = user_id);
  create policy "consent_insert_any" on consent_log for insert with check (true);
  create policy "consent_select_own" on consent_log for select using (auth.uid() = user_id);
  create policy "reports_insert_own" on content_reports for insert with check (auth.uid() = user_id);
  create policy "reports_select_own" on content_reports for select using (auth.uid() = user_id);
  create policy "tutor_select_own" on tutor_messages for select using (auth.uid() = user_id);
  create policy "tutor_insert_own" on tutor_messages for insert with check (auth.uid() = user_id);
  create policy "tutor_delete_own" on tutor_messages for delete using (auth.uid() = user_id);
  create policy "public_read" on countries for select using (true);
  create policy "public_read" on curricula for select using (true);
  create policy "public_read" on levels for select using (true);
  create policy "public_read" on streams for select using (true);
  create policy "public_read" on subjects for select using (true);
  create policy "public_read" on chapters for select using (true);
  create policy "public_read" on topics for select using (true);
  create policy "resources_public_read" on resources for select using (verified = true);
exception when duplicate_object then null; end $$;

alter table countries enable row level security;
alter table curricula enable row level security;
alter table levels enable row level security;
alter table streams enable row level security;
alter table subjects enable row level security;
alter table chapters enable row level security;
alter table topics enable row level security;
alter table resources enable row level security;

-- KV table backing the app store when Supabase env vars are set
-- (serverless-safe persistence; accessed only with the service-role key,
-- which bypasses RLS).
create table if not exists sherpa_kv (
  key text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
alter table sherpa_kv enable row level security;
