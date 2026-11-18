import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { renderMarkdown } from "@/lib/markdown";
import {
  formatIssues,
  projectSchema,
  type Project,
  type ProjectMeta,
} from "@/lib/schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

/** Drafts are visible locally and never in a production build. */
const includeDrafts = process.env.NODE_ENV !== "production";

function readProjectFile(filename: string): ProjectMeta {
  const fullPath = path.join(PROJECTS_DIR, filename);
  const relativePath = path.relative(process.cwd(), fullPath);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);

  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      formatIssues(parsed.error, `Invalid frontmatter in ${relativePath}`),
    );
  }

  const expectedSlug = filename.replace(/\.md$/, "");
  if (parsed.data.slug !== expectedSlug) {
    throw new Error(
      `${relativePath}: slug "${parsed.data.slug}" does not match the filename "${expectedSlug}.md"`,
    );
  }

  return { ...parsed.data, body: content.trim() };
}

/** Featured first, then `order`, then title — deterministic for every build. */
function byDisplayOrder(a: ProjectMeta, b: ProjectMeta) {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.order !== b.order) return a.order - b.order;
  return a.title.localeCompare(b.title);
}

/**
 * Every project that should be visible in this environment, already sorted.
 * No caching on purpose: a stale cache in `next dev` would hide edits to a
 * Markdown file, which is exactly the loop this site is built around.
 */
export function getProjects(): ProjectMeta[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map(readProjectFile)
    .filter((project) => includeDrafts || project.status === "published")
    .sort(byDisplayOrder);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const meta = getProjects().find((project) => project.slug === slug);
  if (!meta) return undefined;

  return {
    ...meta,
    bodyHtml: await renderMarkdown(meta.body),
  };
}

/** The project that follows `slug` in display order, wrapping to the first. */
export function getNextProject(slug: string): ProjectMeta | undefined {
  const projects = getProjects();
  if (projects.length < 2) return undefined;

  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

/** Unique tags in alphabetical order — the source for the filter controls. */
export function getTags(projects: ProjectMeta[]): string[] {
  return [...new Set(projects.flatMap((project) => project.tags))].sort((a, b) =>
    a.localeCompare(b),
  );
}
