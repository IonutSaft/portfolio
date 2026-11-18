import { Container } from "@/components/layout/Container";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Button } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Structure only — headings, anchors and primitives. Real copy and content
 * land in M1/M5; nothing here is final text.
 */
export default function Home() {
  return (
    <>
      <section aria-labelledby="hero-title" className="pt-16 pb-20 sm:pt-24">
        <Container>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Junior Web Developer
          </p>
          <h1
            id="hero-title"
            className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Xevon
          </h1>
          <p className="mt-6 max-w-prose text-lg text-pretty text-muted-foreground">
            Value statement placeholder — one or two sentences, written by hand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#work">View work</Button>
            <Button href="#contact" variant="secondary">
              Get in touch
            </Button>
          </div>
        </Container>
      </section>

      <section
        id="work"
        aria-labelledby="work-title"
        className="scroll-mt-24 border-t border-border py-20"
      >
        <Container className="flex flex-col gap-8">
          <SectionHeading
            id="work-title"
            eyebrow="Work"
            title="Selected projects"
            description="Each card opens a case study: what it is, the hard part, and what I'd do differently."
          />
          <ProjectGrid />
        </Container>
      </section>

      <section
        id="about"
        aria-labelledby="about-title"
        className="scroll-mt-24 border-t border-border py-20"
      >
        <Container className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <SectionHeading id="about-title" eyebrow="About" title="About me" />
          <Prose>
            <p>
              Placeholder paragraph rendered through the <code>Prose</code>{" "}
              scope. Real paragraphs come from <code>content/site.ts</code>.
            </p>
            <p>
              A second paragraph to check spacing between blocks and the text
              measure at large widths.
            </p>
          </Prose>
        </Container>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-title"
        className="scroll-mt-24 border-t border-border py-20"
      >
        <Container className="flex flex-col gap-6">
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title="Get in touch"
            description="Email and social links are wired in M5."
          />
          <div className="flex flex-wrap gap-3">
            <Button href="#" variant="secondary">
              Send an email
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
