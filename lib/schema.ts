import { z } from "zod";

/**
 * Single source of truth for content shapes. Everything in `content/` is
 * validated against these at build time, so a typo'd frontmatter field fails
 * the build instead of rendering a blank card.
 */

/** `YYYY-MM` — a partial ISO date is precise enough for a portfolio. */
const isoMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "expected YYYY-MM, e.g. 2026-09");

/** Slug must also equal the filename; lib/projects.ts checks that part. */
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "expected kebab-case, e.g. job-tracker");

export const socialSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  icon: z.enum(["github", "linkedin", "mail", "cv"]),
});

export const siteSettingsSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  roles: z.array(z.string().min(1)).optional(),
  valueStatement: z.string().min(1).max(220),
  location: z.string().min(1),
  avatar: z.object({
    src: z.string().min(1).optional(),
    alt: z.string().min(1),
    initials: z.string().min(1).max(3),
  }),
  email: z.email(),
  cvUrl: z.string().min(1),
  socials: z.array(socialSchema),
  about: z.array(z.string().min(1)).min(1),
  skills: z.array(
    z.object({
      group: z.string().min(1),
      items: z.array(z.string().min(1)).min(1),
    }),
  ),
  education: z.array(
    z.object({
      title: z.string().min(1),
      org: z.string().min(1),
      period: z.string().min(1),
      note: z.string().min(1).optional(),
      url: z.url().optional(),
    }),
  ),
  seo: z.object({
    defaultTitle: z.string().min(1),
    titleTemplate: z.string().min(1),
    description: z.string().min(1).max(300),
    ogImage: z.string().min(1).optional(),
  }),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug,
  /** Card one-liner: problem + what was built + one differentiator. */
  summary: z.string().min(1).max(120),
  tags: z.array(z.string().min(1)).min(1),
  /**
   * Optional while screenshots are missing: ProjectCard falls back to a
   * typographic tile. When a thumbnail *is* supplied, `alt` is mandatory so
   * "add an image" never means "add an unlabelled image".
   */
  thumbnail: z
    .object({
      src: z.string().min(1),
      alt: z.string().min(1),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .optional(),
  demoUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  featured: z.boolean().default(false),
  /** Ascending. Ties fall back to title, so order is deterministic. */
  order: z.number().int().nonnegative(),
  status: z.enum(["draft", "published"]),
  /** Start of the work, shown on the card and case study. */
  date: isoMonth.optional(),
  /** End of the work. Absent means "still ongoing". */
  endDate: isoMonth.optional(),
  role: z.string().min(1).optional(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type Social = z.infer<typeof socialSchema>;
export type ProjectFrontmatter = z.infer<typeof projectSchema>;

/** Frontmatter plus the body as written. */
export type ProjectMeta = ProjectFrontmatter & { body: string };

/** Frontmatter plus the body rendered to HTML at build time. */
export type Project = ProjectMeta & { bodyHtml: string };

/**
 * Turns a ZodError into one line per problem, prefixed with the file that
 * caused it — build output should say *which* file to fix, not just "invalid".
 */
export function formatIssues(error: z.ZodError, source: string): string {
  const lines = error.issues.map((issue) => {
    const where = issue.path.length ? issue.path.join(".") : "(frontmatter)";
    return `  • ${where}: ${issue.message}`;
  });
  return `${source}\n${lines.join("\n")}`;
}
