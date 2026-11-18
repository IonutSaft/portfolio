# Portfolio

Personal developer portfolio for **Xevon** — a single-page site with a project
grid and one case-study page per project.

Stack: Next.js (App Router, fully static) · TypeScript · Tailwind CSS v4 ·
Markdown in Git, validated with Zod · deployed on Vercel.

## Running locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_SITE_URL` is the public origin used for canonical URLs,
`sitemap.xml`, `robots.txt` and OG images. Locally it stays
`http://localhost:3000`; in production it must match the deployed domain.

## Non-goals (read this before adding a feature)

This site is deliberately small. It will **not** get:

- a CMS, database, or admin panel — content is Markdown in this repo
- a contact form backend — the contact section is `mailto:` plus social links
- testimonials, a blog, or a comments system
- an animation library, custom illustrations, or a component kit

If a change needs any of those, it belongs in a different project. The whole
point is a fast, static, four-file-to-update portfolio.

## Adding a project

1. Create `content/projects/<slug>.md`. **The filename and the `slug` field must match** — a mismatch fails the build with a message naming the file.

```yaml
---
title: "Task Board"
slug: "task-board"
summary: "One line, ≤120 characters: problem + what you built + one differentiator."
tags: ["React", "TypeScript"]          # also feeds the tag filter
thumbnail:                              # optional; omit for a typographic tile
  src: "/images/projects/task-board/thumb.webp"
  alt: "Task Board kanban board with three columns of cards"
  width: 1200
  height: 750
demoUrl: "https://task-board.vercel.app"  # optional
repoUrl: "https://github.com/xevon/task-board"  # optional
featured: false                          # true pins it to the top of the grid
order: 3                                 # ascending
status: "published"                      # "draft" is hidden in production
date: "2026-09"                          # YYYY-MM, start of the work
endDate: "2026-11"                       # optional; omit for a single month
role: "Solo build"                       # optional
---
```

2. Write the body in Markdown. Suggested sections: **What it is**, **My role**, **Stack and why**, **The hard part**, **What I'd do differently**.
3. If you added a thumbnail, put it at `public/images/projects/<slug>/thumb.webp` (≤200 KB, real pixel dimensions in the frontmatter).
4. Run `npm run check:content` — it prints the parsed projects in order and warns about missing thumbnails or placeholder bodies.
5. `npm run dev` — the card, the tag list and `/projects/<slug>` appear with no code changes.

Validation runs before every build (`prebuild`), so a typo in frontmatter fails `npm run build` instead of rendering a blank card.

