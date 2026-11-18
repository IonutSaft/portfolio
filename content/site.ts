import type { SiteSettings } from "@/lib/schema";

/**
 * Site-wide copy and settings. Everything the shell renders comes from here —
 * no strings hardcoded in components.
 *
 * Fields marked TODO are placeholders: they are shaped and validated, but the
 * words have to be yours. Fill them in before launch (M5).
 */
export const site = {
  name: "Xevon",
  role: "Junior Web Developer",
  valueStatement:
    "TODO (max 220 chars) — what you build, for whom, plus one concrete result.",
  location: "Bucharest, Romania",
  avatar: {
    // Set `src` to "/images/avatar.webp" once a photo exists; without it the
    // hero renders the initials monogram.
    alt: "Portrait of Xevon",
    initials: "X",
  },
  email: "you@example.com", // TODO: real address (used by the mailto: CTA)
  cvUrl: "/cv/xevon-cv.pdf", // TODO: put the PDF in public/cv/
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/IonutSaft",
      icon: "github",
    },
    // TODO: { label: "LinkedIn", href: "...", icon: "linkedin" },
  ],
  about: [
    "TODO — first bio paragraph. Two to four paragraphs, written by you, no adjectives doing the work of evidence.",
  ],
  skills: [
    {
      group: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      group: "Data & backend",
      items: ["Supabase (PostgreSQL)", "Upstash Redis"],
    },
    {
      group: "Testing",
      items: ["Vitest"],
    },
    {
      group: "APIs",
      items: ["Google Gemini API"],
    },
  ],
  education: [
    // TODO: { title, org, period, note?, url? }
  ],
  seo: {
    defaultTitle: "Xevon — Junior Web Developer",
    titleTemplate: "%s · Xevon",
    description:
      "Portfolio of Xevon, a junior web developer: selected projects, case studies and how to get in touch.",
  },
} satisfies SiteSettings;
