import { ProjectCard } from "@/components/projects/ProjectCard";
import { TagFilter } from "@/components/projects/TagFilter";
import { getProjects, getTags } from "@/lib/projects";

/** Below this many distinct tags a filter bar is decoration, not a tool. */
const MIN_TAGS_FOR_FILTER = 4;

function gridClasses(count: number) {
  if (count <= 1) return "grid max-w-xl grid-cols-1 gap-6";
  if (count === 2) return "grid grid-cols-1 gap-6 sm:grid-cols-2";
  return "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";
}

/**
 * Server component: reads and validates the content, renders every card once,
 * and hands the client island only metadata plus the rendered nodes.
 */
export function ProjectGrid() {
  const projects = getProjects();

  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground">
        No projects published yet — the first one is one Markdown file away.
      </p>
    );
  }

  const cards = Object.fromEntries(
    projects.map((project) => [
      project.slug,
      <ProjectCard key={project.slug} project={project} />,
    ]),
  );

  const tags = getTags(projects);

  return (
    <TagFilter
      projects={projects.map(({ slug, title, tags: projectTags }) => ({
        slug,
        title,
        tags: projectTags,
      }))}
      tags={tags}
      cards={cards}
      gridClassName={gridClasses(projects.length)}
      showFilter={tags.length >= MIN_TAGS_FOR_FILTER}
    />
  );
}
