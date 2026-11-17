# Project Plan — "Xevon" developer portfolio

**Locked decisions:** Next.js (App Router) · TypeScript · Tailwind · Markdown in Git · Vercel Hobby · English only · light + dark · no CMS, no DB, no admin panel, no contact form, no testimonials, no AI-written copy.

---

## 1. Stack, with justification and alternatives

| Choice | Why | Main alternative, and why not |
|---|---|---|
| **Next.js (App Router) + SSG** | You already know it; highest frequency in your local junior ads; static rendering gives a JS-poor, fast site; one repo, one mental model. | **Astro** — better fit technically for a content site, but it's a new tool for the sake of a new tool. **Vite + React SPA** — worse SEO and slower first paint for no benefit. |
| **TypeScript** | The `Project` type is what makes "add one file and everything updates" safe; a typo'd frontmatter field fails the build instead of rendering blank. | Plain JS: faster to type, slower to debug. |
| **Tailwind CSS** | Consistent spacing/colour scale across 4 sections + case studies; tiny CSS output; recruiter-recognised. | **CSS Modules**: cleaner markup, more hand-written layout code. **shadcn/ui**: fast and pretty, but it will make the site look like every other 2025-era portfolio and adds components you don't need. |
| **Markdown files + Zod validation** | 2–12 projects, one author: files are free, versioned, diffable, and live in the same repo as the code. Zod turns frontmatter into a typed, validated `Project`. | **Sanity/Contentful**: a second system, schema code, free-tier limits, network dependency — for one editor. **Custom admin + DB**: weeks of auth/CRUD work with zero portfolio value. |
| **`gray-matter` + `remark` → HTML** | Plain Markdown was your choice; build-time rendering means zero JS on case-study pages. | `next-mdx-remote` only if you later want components inside bodies. `marked` is a 1-dependency alternative if you'd rather not wire a unified pipeline. |
| **`next/font` + `next/image`** | Self-hosted fonts (no third-party request), automatic AVIF/WebP + responsive `sizes`, prevents CLS. | Plain `<img>`: you'd hand-manage formats/sizes and lose the Lighthouse score. |
| **`next-themes`** | Handles system preference, persistence, and the pre-hydration flash correctly in ~2 KB. | Hand-rolled inline script: doable, and a classic source of a white flash bug. |
| **Vercel + GitHub** | Push-to-deploy, PR previews, free TLS/CDN. CI/CD is already solved — no GitHub Actions. | Netlify (comparable), Cloudflare Pages (needs an adapter for App Router). |
| **Vercel Web Analytics** | Cookieless → no consent banner needed. | Plausible (nice, €9/mo), or nothing. |

**Rendering model:** every page is statically generated at build time. The only client-side JavaScript is the theme toggle, the tag filter, and (later) "load more". That is what makes Lighthouse 90+ achievable without tricks.

**Routing decision (worth stating):** Layout A's About/Contact are *sections on the home page*, not separate routes. Nav links are anchors (`#work`, `#about`, `#contact`); only `/projects/[slug]` are real routes. This keeps the site one scroll for recruiters and avoids four near-empty pages. Trade-off: a blog would later need real routes — fine, it's additive.

---

## 2. Architecture and the "add a project" flow

```
content/site.ts ─┐
content/projects/*.md ─┴→ lib/projects.ts (read → Zod validate → sort) ─→ app/
                                                        │
                          ┌─────────────────────────────┼──────────────────────────┐
                          ▼                             ▼                          ▼
                   home page (server)            /projects/[slug]           sitemap.ts
                   ProjectGrid (server)          generateStaticParams       + metadata
                          │
                          ▼
                   TagFilter (client) ← receives plain array, no fetching
```

**Adding a project, end to end:**

1. Create `content/projects/my-app.md` with frontmatter + body; add `public/images/projects/my-app/thumb.webp`.
2. `lib/projects.ts` reads the folder, validates each file with Zod, drops `status: "draft"` in production, sorts by `order`.
3. Home page renders a new card automatically — filter tags now include any new tag.
4. `generateStaticParams` emits `/projects/my-app` at build time, with `generateMetadata` producing title/description/OG tags.
5. `sitemap.ts` includes the new URL.
6. `git push` → Vercel rebuilds. Nothing else is edited.

**Deleting/editing** is the inverse: delete or edit the file. **Reordering** is changing `order` (and `featured` pins a project to the top row). No layout code is ever touched.

---

## 3. Data model

```ts
// lib/schema.ts — zod schemas mirror these types; frontmatter is validated at build

type Social = { label: string; href: string; icon: "github" | "linkedin" | "mail" | "cv" };

type SiteSettings = {
  name: string;                      // "Xevon"
  role: string;                      // "Junior Web Developer"
  roles?: string[];                  // future rotation; v1 renders `role`, renders `roles.join(" · ")` if set
  valueStatement: string;            // 1–2 sentences, ≤ 220 chars
  location: string;                  // "Bucharest, Romania"
  avatar: { src?: string; alt: string; initials: string };   // src absent → monogram
  email: string;                     // used by mailto: CTA
  cvUrl: string;                     // "/cv/xevon-cv.pdf"
  socials: Social[];
  about: string[];                   // one string per paragraph
  skills: { group: string; items: string[] }[];              // e.g. "Frontend" → ["React", ...]
  education: { title: string; org: string; period: string; note?: string; url?: string }[];
  seo: { defaultTitle: string; titleTemplate: string; description: string; ogImage?: string };
};

type Project = {
  title: string;
  slug: string;                      // must equal filename; validated
  summary: string;                   // one line, ≤ 120 chars
  tags: string[];                    // tech tags, also the filter source
  thumbnail: { src: string; alt: string; width: number; height: number };
  demoUrl?: string;                  // omit → no live link rendered
  repoUrl?: string;                  // omit → no source link rendered
  featured: boolean;
  order: number;                     // ascending
  status: "draft" | "published";     // drafts hidden in prod, visible in dev
  date?: string;                     // "2026-03", ISO partial, shown on card/case study
  role?: string;                     // "Solo build", "Team of 3 — frontend"
  body: string;                      // parsed Markdown, not frontmatter
};
```

**Example entry — `content/projects/task-board.md`:**

```md
---
title: "Task Board"
slug: "task-board"
summary: "Drag-and-drop kanban app with offline persistence and optimistic updates."
tags: ["React", "TypeScript", "IndexedDB", "Tailwind"]
thumbnail:
  src: "/images/projects/task-board/thumb.webp"
  alt: "Task Board kanban interface with three columns of cards"
  width: 1200
  height: 750
demoUrl: "https://task-board.vercel.app"
repoUrl: "https://github.com/xevon/task-board"
featured: true
order: 1
status: "published"
date: "2026-09"
role: "Solo build"
---

## What it is
...
## My role
...
## Stack and why
...
## The hard part
...
## What I'd do differently
...
```

Note `thumbnail.alt` is **required** by the schema — accessibility enforced by the type system, not by memory.

---

## 4. Pages and components mapped to Layout A

**Route: `/` (single page, anchored sections)**

| Wireframe slot | Component | Notes |
|---|---|---|
| 1. Nav | `components/layout/Nav.tsx` | Name as text wordmark; anchor links; `ThemeToggle`; mobile menu is a `<details>`-style disclosure or small client island; sticky with backdrop blur |
| 2. Hero left | `hero/Hero.tsx` | `h1` = name, role line, value statement, primary "View work" → `#work`, secondary "Get in touch" → `#contact` |
| 2. Hero right | `hero/Avatar.tsx` | `next/image` if `avatar.src`, else initials monogram in a bounded circle — fixed aspect ratio, no layout shift |
| 3. Grid | `projects/ProjectGrid.tsx` (server) + `TagFilter.tsx` (client) + `ProjectCard.tsx` | Grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; card is a single wrapping link with visible focus ring; tags and demo/source links stop propagation so they don't hijack the card |
| 4. About | `sections/About.tsx` | Renders `site.about` paragraphs via `Prose` |
| Skills | `sections/Skills.tsx` | Grouped lists, not a progress-bar chart (bars encode fake precision) |
| Education & Learning | `sections/Education.tsx` | Timeline list from `site.education` |
| Contact | `sections/Contact.tsx` | `mailto:` button + social links; no form |
| Footer | `layout/Footer.tsx` | Year computed at build, CV link, "built with" line |

**Route: `/projects/[slug]`** → `app/projects/[slug]/page.tsx`
Back link, title, summary, meta row (date, role, stack), hero screenshot, rendered Markdown in `Prose`, demo/repo buttons, "next project" link.

**Shared:** `ui/Button.tsx`, `ui/Tag.tsx`, `ui/SectionHeading.tsx`, `ui/Prose.tsx` (typographic styles for Markdown), `layout/SkipLink.tsx`, `theme/ThemeProvider.tsx`, `app/not-found.tsx`.

**Accessibility baked into components (not a later pass):** skip link, visible `focus-visible` rings on every interactive element, filter buttons with `aria-pressed`, result count in `aria-live="polite"`, real `<button>`/`<a>` semantics, `prefers-reduced-motion` guard, AA contrast on the dark palette, 24px minimum target size.

---

## 5. Roadmap — milestones, estimates, definition of done

Assumes ~10 h/week. Total **36–46 h ≈ 4 weeks.**

**M0 · Scaffold and prove the pipeline (2–3 h)**
`create-next-app` (TS, Tailwind, App Router), strip boilerplate, deploy the empty page to Vercel from GitHub, set `NEXT_PUBLIC_SITE_URL` env var + `metadataBase`.
*Done when:* pushing to `main` updates a live URL, and a PR produces a preview URL.

**M1 · Data layer + content fixtures (5–7 h)**
`content/site.ts`, `lib/schema.ts`, `lib/projects.ts`, `lib/markdown.ts`, 3 real project files, 3 real thumbnails.
*Done when:* a deliberately broken frontmatter field fails `npm run build` with a readable error, and a script/log lists the 3 parsed projects in order.

**M2 · Shell, tokens, theme (6–8 h)**
Layout, nav, footer, skip link, colour/type tokens, `next/font`, light + dark via `next-themes`, responsive breakpoints.
*Done when:* no theme flash on reload, layout holds at 320/768/1280px, keyboard tab order is logical, Lighthouse a11y ≥ 95.

**M3 · Project grid, cards, filters (6–8 h)**
`ProjectCard`, `ProjectGrid`, `TagFilter`, empty state ("No projects match"), card hover/focus states.
*Done when:* filtering by every tag works with keyboard only, count updates, and adding a 4th file produces a 4th card with no code change.

**M4 · Case-study pages (4–6 h)**
Route, `generateStaticParams`, `generateMetadata`, `not-found`, `Prose` styles, next-project link.
*Done when:* every published project has a reachable page; an unpublished slug returns 404 in prod; unknown slug returns the styled 404.

**M5 · About, Skills, Education, Contact, Footer content (4–5 h)**
Wire `site.ts`, write the real bio, CV PDF in `/public/cv/`.
*Done when:* all content comes from `site.ts` — grepping the components finds no hardcoded copy.

**M6 · Design polish and a11y audit (4–6 h)**
Spacing rhythm, typographic scale, hover/fade-in only, mobile nav, focus states, axe/Lighthouse pass, screen-reader smoke test.
*Done when:* axe reports 0 violations, AA contrast verified in both themes, reduced-motion respected, all images have meaningful alt text.

**M7 · SEO, performance, images (4–6 h)**
Per-page metadata, OG image via `next/og` (static per project is fine), `sitemap.ts`, `robots.ts`, Person JSON-LD on the home page, image compression + explicit dimensions, font subsetting.
*Done when:* Lighthouse mobile ≥ 90 on all four categories, OG preview renders correctly in a link checker, sitemap lists every route.

**M8 · Launch (2–3 h)**
Final copy read-through, CV link check, analytics live, 404 and mailto tested on a real phone, README with "how to add a project".
*Done when:* the README's instructions can be followed by someone who has never seen the repo, and the site is linked from your CV/GitHub/LinkedIn.

**Copywriting checklist (write these yourself, in this order — it's the real bottleneck):**

1. **Value statement** = what you build + for whom + one proof point. Formula: *"I build [kind of thing] with [stack]. Recently I [concrete result]."* Ban the words "passionate", "modern", "cutting-edge".
2. **One-line project summary** = problem + what you built + one differentiator, ≤ 120 chars. No "a beautiful app".
3. **"The hard part"** must name a *real* bug, trade-off, or decision — that section is what separates you from tutorial-clone portfolios.
4. **"What I'd do differently"** — one honest limitation. Admitting a weakness reads as seniority; juniors who claim perfection read as unaware.
5. **Evidence over adjectives:** "cut initial load from 3.1s to 0.9s" beats "optimised for performance".
6. **Read it aloud.** If you wouldn't say the sentence to an interviewer, delete it.
7. Draft in one sitting per project, then leave it 24 h before editing. Do not let writing block milestones M0–M4.

---

## 6. Folder structure

```
portfolio/
├─ app/
│  ├─ layout.tsx            # fonts, theme provider, metadata defaults
│  ├─ page.tsx              # nav + hero + grid + about + skills + education + contact + footer
│  ├─ globals.css           # Tailwind layers, tokens, prose styles
│  ├─ not-found.tsx
│  ├─ sitemap.ts
│  ├─ robots.ts
│  ├─ opengraph-image.tsx
│  └─ projects/[slug]/
│     ├─ page.tsx
│     └─ opengraph-image.tsx
├─ components/
│  ├─ layout/   Nav.tsx  Footer.tsx  SkipLink.tsx
│  ├─ hero/     Hero.tsx  Avatar.tsx
│  ├─ projects/ ProjectGrid.tsx  ProjectCard.tsx  TagFilter.tsx
│  ├─ sections/ About.tsx  Skills.tsx  Education.tsx  Contact.tsx
│  ├─ theme/    ThemeProvider.tsx  ThemeToggle.tsx
│  └─ ui/       Button.tsx  Tag.tsx  SectionHeading.tsx  Prose.tsx
├─ content/
│  ├─ site.ts
│  └─ projects/ task-board.md  …
├─ lib/
│  ├─ schema.ts       # zod schemas + inferred types
│  ├─ projects.ts     # read, validate, sort, filter
│  ├─ markdown.ts     # md → html
│  └─ site.ts         # typed export of content/site.ts
├─ public/
│  ├─ images/projects/<slug>/thumb.webp
│  ├─ cv/xevon-cv.pdf
│  └─ favicon.ico
└─ (config: next.config.ts, tailwind/postcss, tsconfig, .env.local)
```

---

## 7. Risks, and what to postpone

| Risk | Mitigation |
|---|---|
| **Writing case studies stalls the build** (most likely failure) | Build all UI against 3 fixture projects; write copy in M5/M8. Never let writing block code. |
| **Scope creep back toward a CMS/admin panel** | Write the non-goals list into the README so future-you sees it before starting a "quick" Sanity integration. |
| **Never shipping** | M0 deploys a live URL in week one; every milestone ends deployed. A finished 4-project site beats a perfect 12-project one. |
| **Junior over-design** | Tokens + two fonts + one accent. No custom illustrations, no animation library. |
| **Image weight** | Every thumbnail ≤ 200 KB WebP, explicit dimensions, `sizes` set per breakpoint. |
| **Dark-mode contrast failures** | Verify both palettes with a contrast checker at M2, not at the end. |
| **Next.js App Router friction** (server/client boundaries) | Only three client islands: filter, theme toggle, mobile nav. Everything else stays server components. |
| **Unbacked claims** | Every number on the site must be something you can explain in an interview. |

**Postpone to v1.1+:** tag filtering on the case-study index / URL-synced filters, "load more" (only needed past ~12 projects), Romanian locale, blog, testimonials, contact form backend, project detail image galleries, RSS, view-transition animations, custom domain (one env var away).

---