import type { Country, Curriculum, Level, Stream } from "./types";

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", languages: ["en", "hi", "ta", "te", "bn"], popular: true },
  { code: "US", name: "United States", flag: "🇺🇸", languages: ["en"], popular: true },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", languages: ["en"], popular: true },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", languages: ["en", "ar"], popular: false },
  { code: "SG", name: "Singapore", flag: "🇸🇬", languages: ["en"], popular: false },
  { code: "AU", name: "Australia", flag: "🇦🇺", languages: ["en"], popular: false },
  { code: "CA", name: "Canada", flag: "🇨🇦", languages: ["en", "fr"], popular: false },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", languages: ["en"], popular: false },
];

export const CURRICULA: Curriculum[] = [
  {
    slug: "cbse",
    countryCode: "IN",
    name: "CBSE",
    description: "Central Board of Secondary Education — NCERT syllabus, board exams in Class 10 and 12.",
    isInternational: false,
  },
  {
    slug: "icse",
    countryCode: "IN",
    name: "ICSE / ISC",
    description: "Council for the Indian School Certificate Examinations — broader, more application-heavy.",
    isInternational: false,
  },
  {
    slug: "jee",
    countryCode: "IN",
    name: "JEE Main & Advanced",
    description: "India's engineering entrance exams, built on the Class 11–12 PCM syllabus.",
    isInternational: false,
  },
  {
    slug: "common-core",
    countryCode: "US",
    name: "Common Core",
    description: "US K–12 standards for Mathematics and English Language Arts, adopted by most states.",
    isInternational: false,
  },
  {
    slug: "ap",
    countryCode: "US",
    name: "Advanced Placement (AP)",
    description: "College Board AP courses and exams, scored 1–5.",
    isInternational: true,
  },
  {
    slug: "gcse",
    countryCode: "GB",
    name: "GCSE",
    description: "UK examinations at 16, graded 9–1.",
    isInternational: false,
  },
  {
    slug: "a-level",
    countryCode: "GB",
    name: "A-Level",
    description: "UK examinations at 18, the standard university entrance qualification.",
    isInternational: true,
  },
];

export const LEVELS: Level[] = [
  { slug: "cbse-class-9", curriculumSlug: "cbse", name: "Class 9", ordinal: 9, stage: "secondary" },
  { slug: "cbse-class-10", curriculumSlug: "cbse", name: "Class 10", ordinal: 10, stage: "secondary" },
  { slug: "cbse-class-11", curriculumSlug: "cbse", name: "Class 11", ordinal: 11, stage: "senior_secondary" },
  { slug: "cbse-class-12", curriculumSlug: "cbse", name: "Class 12", ordinal: 12, stage: "senior_secondary" },
  { slug: "jee-main", curriculumSlug: "jee", name: "JEE Main", ordinal: 13, stage: "competitive" },
  { slug: "us-high-school", curriculumSlug: "common-core", name: "High School", ordinal: 10, stage: "secondary" },
  { slug: "ap", curriculumSlug: "ap", name: "AP", ordinal: 12, stage: "senior_secondary" },
  { slug: "gcse-y11", curriculumSlug: "gcse", name: "Year 11 (GCSE)", ordinal: 11, stage: "secondary" },
  { slug: "alevel-y12", curriculumSlug: "a-level", name: "Year 12 (AS)", ordinal: 12, stage: "senior_secondary" },
];

export const STREAMS: Stream[] = [
  { slug: "cbse-10-general", levelSlug: "cbse-class-10", name: "General (Science, Maths, Social Science)" },
  { slug: "cbse-12-pcm", levelSlug: "cbse-class-12", name: "Science — PCM" },
  { slug: "jee-pcm", levelSlug: "jee-main", name: "Science — PCM" },
  { slug: "us-hs-general", levelSlug: "us-high-school", name: "General" },
  { slug: "ap-general", levelSlug: "ap", name: "AP" },
  { slug: "gcse-core", levelSlug: "gcse-y11", name: "Core" },
  { slug: "alevel-maths", levelSlug: "alevel-y12", name: "Mathematics & Sciences" },
];

/** Default selection used when a learner skips onboarding. */
export const DEFAULTS = {
  countryCode: "IN",
  curriculumSlug: "cbse",
  levelSlug: "cbse-class-10",
  streamSlug: "cbse-10-general",
  proficiency: "beginner" as const,
  weeklyHours: 5,
  language: "en",
};
