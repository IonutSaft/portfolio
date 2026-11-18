"use client";

import { useState, type ReactNode } from "react";

import { tagStyles } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

export type FilterItem = {
  slug: string;
  title: string;
  tags: string[];
};

/**
 * The only client island on the home page. It receives frontmatter metadata
 * (slug/title/tags) and the already-rendered server cards, so filtering costs
 * no data fetching and no client-side Markdown: switching a tag just picks a
 * different subset of nodes React already has.
 */
export function TagFilter({
  projects,
  tags,
  cards,
  gridClassName,
  showFilter,
}: {
  projects: FilterItem[];
  tags: string[];
  cards: Record<string, ReactNode>;
  gridClassName: string;
  showFilter: boolean;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const visible = activeTag
    ? projects.filter((project) => project.tags.includes(activeTag))
    : projects;

  return (
    <div className="flex flex-col gap-6">
      {showFilter ? (
        <div className="flex flex-wrap items-center gap-2">
          <span
            id="tag-filter-label"
            className="mr-1 font-mono text-xs tracking-widest text-muted-foreground uppercase"
          >
            Filter
          </span>
          <div
            role="group"
            aria-labelledby="tag-filter-label"
            className="flex flex-wrap gap-2"
          >
            <FilterButton
              active={activeTag === null}
              onClick={() => setActiveTag(null)}
            >
              All
            </FilterButton>
            {tags.map((tag) => (
              <FilterButton
                key={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </FilterButton>
            ))}
          </div>
        </div>
      ) : null}

      <p role="status" className="text-sm text-muted-foreground">
        {activeTag
          ? `${visible.length} of ${projects.length} projects tagged “${activeTag}”`
          : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
      </p>

      {visible.length > 0 ? (
        <ul className={gridClassName}>
          {visible.map((project) => (
            <li key={project.slug} className="flex">
              {cards[project.slug]}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">
            No projects match{" "}
            <span className="font-medium text-foreground">{activeTag}</span>.
          </p>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className="mt-3 text-sm font-medium text-accent underline underline-offset-4"
          >
            Show all projects
          </button>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        tagStyles({ interactive: true }),
        "aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background",
      )}
    >
      {children}
    </button>
  );
}
