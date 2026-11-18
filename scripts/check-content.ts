/**
 * Prints what the content pipeline parsed, in display order, plus anything
 * that will look unfinished on the site. Run with:
 *
 *   npm run check:content
 *
 * Exits non-zero if validation fails, so it also works as a pre-deploy gate.
 */
import { getProjects, getTags } from "../lib/projects";
import { siteSettings } from "../lib/site";

function main() {
  const projects = getProjects();

  console.log(
    `Site: ${siteSettings.name} — ${siteSettings.role} (${siteSettings.location})`,
  );
  console.log(
    `      ${siteSettings.about.length} about paragraph(s), ${siteSettings.skills.length} skill group(s), ${siteSettings.education.length} education entr(ies)`,
  );
  console.log(
    `\nProjects: ${projects.length} (${process.env.NODE_ENV === "production" ? "production: drafts hidden" : "dev: drafts included"})`,
  );

  const warnings: string[] = [];

  projects.forEach((project, index) => {
    const lineCount = project.body
      .split("\n")
      .filter((line) => line.trim()).length;
    const links = [
      project.demoUrl ? "demo" : null,
      project.repoUrl ? "repo" : null,
    ].filter(Boolean);

    const period = project.endDate
      ? `${project.date}–${project.endDate}`
      : (project.date ?? "—");

    console.log(
      `  ${String(index + 1).padStart(2)}. ${project.featured ? "★" : " "} ${project.title.padEnd(16)} ${project.slug.padEnd(16)} order=${project.order} ${project.status} ${period}`,
    );
    console.log(
      `      tags:  ${project.tags.join(", ")}\n      links: ${links.join(", ") || "none"}\n      body:  ${lineCount} non-empty lines`,
    );

    if (!project.thumbnail) warnings.push(`${project.slug}: no thumbnail yet`);
    if (project.body.includes("_TODO")) {
      warnings.push(`${project.slug}: case-study body is still TODO`);
    }
  });

  const tags = getTags(projects);
  console.log(`\nFilter tags (${tags.length}):\n  ${tags.join(", ")}`);

  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const warning of warnings) console.log(`  ! ${warning}`);
  } else {
    console.log("\nNo warnings.");
  }
}

try {
  main();
} catch (error) {
  console.error(
    `\nContent check failed:\n\n${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
}
