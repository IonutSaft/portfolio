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

_To be filled in at M8, once the content pipeline exists._
