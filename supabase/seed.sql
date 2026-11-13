-- ============================================================================
-- Sherpa — seed.sql
-- Taxonomy (8 countries, 7 curricula, 9 levels, 7 streams, 7 subjects,
-- 8 chapters) + 20 allowlisted resources. Mirrors src/lib/curriculum/*.
-- Run after supabase/migrations/0001_init.sql.
--
-- NOTE: every resource URL below is the same string as in
-- src/lib/curriculum/resources.ts (human-reviewed allowlist). Live HTTP
-- re-verification from CI is configured in SETUP.md; sandbox egress could
-- not reach the internet during the build, so `verified` reflects the
-- editorial review date, and VERIFICATION_REPORT.md lists live curl checks
-- as a known gap.
-- ============================================================================

-- ── Countries ───────────────────────────────────────────────────────────────
insert into countries (code, name, flag, languages, popular) values
  ('IN', 'India', '🇮🇳', '{en,hi,ta,te,bn}', true),
  ('US', 'United States', '🇺🇸', '{en}', true),
  ('GB', 'United Kingdom', '🇬🇧', '{en}', true),
  ('AE', 'United Arab Emirates', '🇦🇪', '{en,ar}', false),
  ('SG', 'Singapore', '🇸🇬', '{en}', false),
  ('AU', 'Australia', '🇦🇺', '{en}', false),
  ('CA', 'Canada', '🇨🇦', '{en,fr}', false),
  ('ZA', 'South Africa', '🇿🇦', '{en}', false)
on conflict (code) do nothing;

-- ── Curricula ───────────────────────────────────────────────────────────────
insert into curricula (slug, country_id, name, description, is_international)
select 'cbse', id, 'CBSE', 'Central Board of Secondary Education — NCERT syllabus, board exams in Class 10 and 12.', false from countries where code='IN'
on conflict (slug) do nothing;
insert into curricula (slug, country_id, name, description, is_international)
select 'icse', id, 'ICSE / ISC', 'Council for the Indian School Certificate Examinations.', false from countries where code='IN'
on conflict (slug) do nothing;
insert into curricula (slug, country_id, name, description, is_international)
select 'jee', id, 'JEE Main & Advanced', 'India''s engineering entrance exams, built on the Class 11–12 PCM syllabus.', false from countries where code='IN'
on conflict (slug) do nothing;
insert into curricula (slug, country_id, name, description, is_international)
select 'common-core', id, 'Common Core', 'US K–12 standards for Mathematics and ELA, adopted by most states.', false from countries where code='US'
on conflict (slug) do nothing;
insert into curricula (slug, country_id, name, description, is_international)
select 'ap', id, 'Advanced Placement (AP)', 'College Board AP courses and exams, scored 1–5.', true from countries where code='US'
on conflict (slug) do nothing;
insert into curricula (slug, country_id, name, description, is_international)
select 'gcse', id, 'GCSE', 'UK examinations at 16, graded 9–1.', false from countries where code='GB'
on conflict (slug) do nothing;
insert into curricula (slug, country_id, name, description, is_international)
select 'a-level', id, 'A-Level', 'UK examinations at 18, the standard university entrance qualification.', true from countries where code='GB'
on conflict (slug) do nothing;

-- ── Levels ──────────────────────────────────────────────────────────────────
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'cbse-class-9', c.id, 'Class 9', 9, 'secondary' from curricula c where c.slug='cbse'
on conflict (slug) do nothing;
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'cbse-class-10', c.id, 'Class 10', 10, 'secondary' from curricula c where c.slug='cbse'
on conflict (slug) do nothing;
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'cbse-class-11', c.id, 'Class 11', 11, 'senior_secondary' from curricula c where c.slug='cbse'
on conflict (slug) do nothing;
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'cbse-class-12', c.id, 'Class 12', 12, 'senior_secondary' from curricula c where c.slug='cbse'
on conflict (slug) do nothing;
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'jee-main', c.id, 'JEE Main', 13, 'competitive' from curricula c where c.slug='jee'
on conflict (slug) do nothing;
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'us-high-school', c.id, 'High School', 10, 'secondary' from curricula c where c.slug='common-core'
on conflict (slug) do nothing;
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'ap', c.id, 'AP', 12, 'senior_secondary' from curricula c where c.slug='ap'
on conflict (slug) do nothing;
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'gcse-y11', c.id, 'Year 11 (GCSE)', 11, 'secondary' from curricula c where c.slug='gcse'
on conflict (slug) do nothing;
insert into levels (slug, curriculum_id, name, ordinal, stage)
select 'alevel-y12', c.id, 'Year 12 (AS)', 12, 'senior_secondary' from curricula c where c.slug='a-level'
on conflict (slug) do nothing;

-- ── Streams ─────────────────────────────────────────────────────────────────
insert into streams (slug, level_id, name)
select 'cbse-10-general', l.id, 'General (Science, Maths, Social Science)' from levels l where l.slug='cbse-class-10'
on conflict (slug) do nothing;
insert into streams (slug, level_id, name)
select 'cbse-12-pcm', l.id, 'Science — PCM' from levels l where l.slug='cbse-class-12'
on conflict (slug) do nothing;
insert into streams (slug, level_id, name)
select 'jee-pcm', l.id, 'Science — PCM' from levels l where l.slug='jee-main'
on conflict (slug) do nothing;
insert into streams (slug, level_id, name)
select 'us-hs-general', l.id, 'General' from levels l where l.slug='us-high-school'
on conflict (slug) do nothing;
insert into streams (slug, level_id, name)
select 'ap-general', l.id, 'AP' from levels l where l.slug='ap'
on conflict (slug) do nothing;
insert into streams (slug, level_id, name)
select 'gcse-core', l.id, 'Core' from levels l where l.slug='gcse-y11'
on conflict (slug) do nothing;
insert into streams (slug, level_id, name)
select 'alevel-maths', l.id, 'Mathematics & Sciences' from levels l where l.slug='alevel-y12'
on conflict (slug) do nothing;

-- ── Subjects ────────────────────────────────────────────────────────────────
insert into subjects (slug, stream_id, name, icon, color, blurb)
select 'cbse10-physics', s.id, 'Science — Physics', 'atom', '#4F46E5', 'Light, electricity and magnetism — the Class 10 CBSE physics half of Science.' from streams s where s.slug='cbse-10-general'
on conflict (slug) do nothing;
insert into subjects (slug, stream_id, name, icon, color, blurb)
select 'cbse10-chemistry', s.id, 'Science — Chemistry', 'flask', '#0EA5E9', 'Reactions, acids and metals — the chemistry half of Class 10 Science.' from streams s where s.slug='cbse-10-general'
on conflict (slug) do nothing;
insert into subjects (slug, stream_id, name, icon, color, blurb)
select 'cbse10-maths', s.id, 'Mathematics', 'ruler', '#F59E0B', 'Trigonometry, quadratics and coordinate geometry for the Class 10 board paper.' from streams s where s.slug='cbse-10-general'
on conflict (slug) do nothing;
insert into subjects (slug, stream_id, name, icon, color, blurb)
select 'cbse12-physics', s.id, 'Physics', 'atom', '#4F46E5', 'Electrostatics to optics — Class 12 CBSE Physics and the JEE overlap.' from streams s where s.slug='cbse-12-pcm'
on conflict (slug) do nothing;
insert into subjects (slug, stream_id, name, icon, color, blurb)
select 'us-algebra1', s.id, 'Algebra I', 'function', '#10B981', 'Linear relationships, systems and functions against Common Core standards.' from streams s where s.slug='us-hs-general'
on conflict (slug) do nothing;
insert into subjects (slug, stream_id, name, icon, color, blurb)
select 'gcse-biology', s.id, 'Biology', 'microscope', '#22C55E', 'Cells, organisation and infection response for GCSE Year 11.' from streams s where s.slug='gcse-core'
on conflict (slug) do nothing;
insert into subjects (slug, stream_id, name, icon, color, blurb)
select 'alevel-maths', s.id, 'Pure Mathematics', 'sigma', '#8B5CF6', 'Calculus and algebra for A-Level Year 12.' from streams s where s.slug='alevel-maths'
on conflict (slug) do nothing;

-- ── Chapters ────────────────────────────────────────────────────────────────
insert into chapters (slug, subject_id, name, "order", syllabus_weight, estimated_hours)
select 'light-reflection-refraction', s.id, 'Light: Reflection & Refraction', 1, 'high', 6 from subjects s where s.slug='cbse10-physics'
on conflict (slug) do nothing;
insert into chapters (slug, subject_id, name, "order", syllabus_weight, estimated_hours)
select 'electricity', s.id, 'Electricity', 2, 'high', 6 from subjects s where s.slug='cbse10-physics'
on conflict (slug) do nothing;
insert into chapters (slug, subject_id, name, "order", syllabus_weight, estimated_hours)
select 'chemical-reactions-equations', s.id, 'Chemical Reactions & Equations', 1, 'high', 5 from subjects s where s.slug='cbse10-chemistry'
on conflict (slug) do nothing;
insert into chapters (slug, subject_id, name, "order", syllabus_weight, estimated_hours)
select 'trigonometry-intro', s.id, 'Introduction to Trigonometry', 1, 'high', 5 from subjects s where s.slug='cbse10-maths'
on conflict (slug) do nothing;
insert into chapters (slug, subject_id, name, "order", syllabus_weight, estimated_hours)
select 'current-electricity', s.id, 'Current Electricity', 1, 'high', 7 from subjects s where s.slug='cbse12-physics'
on conflict (slug) do nothing;
insert into chapters (slug, subject_id, name, "order", syllabus_weight, estimated_hours)
select 'linear-equations-graphs', s.id, 'Linear Equations & Their Graphs', 1, 'high', 4 from subjects s where s.slug='us-algebra1'
on conflict (slug) do nothing;
insert into chapters (slug, subject_id, name, "order", syllabus_weight, estimated_hours)
select 'cell-biology', s.id, 'Cell Biology', 1, 'high', 5 from subjects s where s.slug='gcse-biology'
on conflict (slug) do nothing;
insert into chapters (slug, subject_id, name, "order", syllabus_weight, estimated_hours)
select 'differentiation', s.id, 'Differentiation', 1, 'high', 6 from subjects s where s.slug='alevel-maths'
on conflict (slug) do nothing;

-- Topics for each chapter (spot seed; the app composes from src/lib/curriculum/chapters.ts)
insert into topics (chapter_id, name, difficulty)
select c.id, t.name, t.diff::difficulty from chapters c, (values
  ('Laws of reflection','easy'),('Spherical mirrors and ray diagrams','medium'),
  ('Mirror formula and magnification','medium'),('Refraction and Snell''s law','medium'),
  ('Lens formula and power','hard')
) as t(name,diff) where c.slug='light-reflection-refraction'
on conflict do nothing;

-- ── Resource allowlist (20 entries; URLs identical to src/lib/curriculum/resources.ts) ──
insert into resources (provider, title, url, type, language, cost, subjects, quality_score, verified, verified_at, disclosure) values
  ('NCERT', 'NCERT official textbook downloads', 'https://ncert.nic.in/textbook.php', 'pdf', 'en', 'free', '{cbse10-physics,cbse10-chemistry,cbse10-maths,cbse12-physics}', 9.6, true, '2026-10-02', 'Government of India — free, official source.'),
  ('Khan Academy', 'Physics — full course library', 'https://www.khanacademy.org/science/physics', 'course', 'en', 'free', '{cbse10-physics,cbse12-physics}', 9.4, true, '2026-10-02', null),
  ('Khan Academy', 'Algebra course', 'https://www.khanacademy.org/math/algebra', 'course', 'en', 'free', '{cbse10-maths,us-algebra1,alevel-maths}', 9.3, true, '2026-10-02', null),
  ('Khan Academy', 'Biology library', 'https://www.khanacademy.org/science/biology', 'course', 'en', 'free', '{gcse-biology}', 9.2, true, '2026-10-02', null),
  ('OpenStax', 'College Physics 2e', 'https://openstax.org/details/books/college-physics-2e', 'book', 'en', 'free', '{cbse10-physics,cbse12-physics}', 9.5, true, '2026-10-02', 'Non-profit open textbook (Rice University).'),
  ('OpenStax', 'Chemistry 2e', 'https://openstax.org/details/books/chemistry-2e', 'book', 'en', 'free', '{cbse10-chemistry}', 9.4, true, '2026-10-02', 'Non-profit open textbook (Rice University).'),
  ('OpenStax', 'Elementary Algebra 2e', 'https://openstax.org/details/books/elementary-algebra-2e', 'book', 'en', 'free', '{cbse10-maths,us-algebra1}', 9.2, true, '2026-10-02', 'Non-profit open textbook (Rice University).'),
  ('OpenStax', 'Biology 2e', 'https://openstax.org/details/books/biology-2e', 'book', 'en', 'free', '{gcse-biology}', 9.3, true, '2026-10-02', 'Non-profit open textbook (Rice University).'),
  ('MIT OCW', '8.01SC Classical Mechanics', 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/', 'course', 'en', 'free', '{cbse12-physics}', 9.7, true, '2026-09-18', null),
  ('MIT OCW', '18.01SC Single Variable Calculus', 'https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/', 'course', 'en', 'free', '{alevel-maths,us-algebra1}', 9.7, true, '2026-09-18', null),
  ('NPTEL', 'NPTEL course catalogue', 'https://nptel.ac.in/courses', 'course', 'en', 'free', '{cbse12-physics}', 8.8, true, '2026-09-18', null),
  ('Physics Wallah', 'Physics Wallah (YouTube)', 'https://www.youtube.com/@PhysicsWallah', 'video', 'hi', 'free', '{cbse10-physics,cbse10-maths,cbse12-physics}', 8.2, true, '2026-09-18', 'Free YouTube channel; no paid placement.'),
  ('3Blue1Brown', 'Calculus series', 'https://www.3blue1brown.com/topics/calculus', 'video', 'en', 'free', '{alevel-maths,us-algebra1}', 9.8, true, '2026-10-02', null),
  ('3Blue1Brown', 'Linear algebra series', 'https://www.3blue1brown.com/topics/linear-algebra', 'video', 'en', 'free', '{alevel-maths,us-algebra1}', 9.8, true, '2026-10-02', null),
  ('CrashCourse', 'CrashCourse playlists', 'https://www.youtube.com/@crashcourse/playlists', 'video', 'en', 'free', '{gcse-biology,cbse10-chemistry}', 8.6, true, '2026-09-18', null),
  ('SWAYAM', 'SWAYAM MOOC platform', 'https://swayam.gov.in/', 'course', 'en', 'free', '{cbse12-physics}', 8.5, true, '2026-09-18', 'Government of India initiative.'),
  ('DIKSHA', 'DIKSHA portal', 'https://diksha.gov.in/', 'course', 'en', 'free', '{cbse10-physics,cbse10-chemistry,cbse10-maths}', 8.4, true, '2026-09-18', 'Government of India initiative.'),
  ('Britannica', 'Cell biology overview', 'https://www.britannica.com/science/cell-biology', 'book', 'en', 'free', '{gcse-biology}', 8.9, true, '2026-10-02', null),
  ('Desmos', 'Graphing calculator', 'https://www.desmos.com/calculator', 'practice', 'en', 'free', '{cbse10-maths,us-algebra1,alevel-maths}', 9.0, true, '2026-10-02', null),
  ('Khan Academy', 'All math courses', 'https://www.khanacademy.org/math', 'course', 'en', 'free', '{cbse10-maths,us-algebra1,alevel-maths}', 9.3, true, '2026-10-02', null)
on conflict (url) do nothing;
