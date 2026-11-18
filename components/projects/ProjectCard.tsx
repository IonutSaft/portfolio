import Image from "next/image";
import Link from "next/link";

import { Tag } from "@/components/ui/Tag";
import { formatPeriod } from "@/lib/format";
import type { ProjectMeta } from "@/lib/schema";

function initials(title: string) {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

/**
 * One card, one destination. The title link is stretched over the whole card
 * with a pseudo-element instead of wrapping everything in an <a> — an anchor
 * cannot contain the demo/repo anchors. Those sit on `relative z-10` so they
 * stay clickable above the overlay, and their tags are plain spans, so a
 * click anywhere else still opens the case study.
 */
export function ProjectCard({ project }: { project: ProjectMeta }) {
  const period = formatPeriod(project.date, project.endDate);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-foreground/25 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
      <div className="aspect-16/10 w-full border-b border-border bg-background">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail.src}
            alt={project.thumbnail.alt}
            width={project.thumbnail.width}
            height={project.thumbnail.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center"
          >
            <span className="font-mono text-3xl tracking-widest text-muted-foreground/60">
              {initials(project.title)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-sm text-pretty text-muted-foreground">
          {project.summary}
        </p>

        <ul className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-xs">
          <p className="font-mono text-muted-foreground">
            {period}
            {project.role ? ` · ${project.role}` : null}
          </p>

          {(project.demoUrl ?? project.repoUrl) ? (
            <ul className="relative z-10 ml-auto flex items-center gap-3">
              {project.demoUrl ? (
                <li>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    Live
                    <span className="sr-only">
                      {" "}
                      — {project.title} live site (opens in a new tab)
                    </span>
                  </a>
                </li>
              ) : null}
              {project.repoUrl ? (
                <li>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                  >
                    Code
                    <span className="sr-only">
                      {" "}
                      — {project.title} source (opens in a new tab)
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </div>
    </article>
  );
}
