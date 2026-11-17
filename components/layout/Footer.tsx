import { Container } from "@/components/layout/Container";

export function Footer() {
  // Static pages are prerendered, so this is the build year — no client JS.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} Xevon
        </p>
        <p>
          Built with Next.js, Tailwind CSS and Markdown.
        </p>
      </Container>
    </footer>
  );
}
