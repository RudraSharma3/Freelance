import Button from "@/components/ui/Button";
import TrackedLink from "@/components/ui/TrackedLink";
import { LINKS } from "@/data/config";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-[0.1] blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
        <h2 className="text-balance font-display text-3xl font-medium leading-tight sm:text-5xl">
          Have something you&apos;re trying to build?
        </h2>
        <p className="mx-auto mt-5 max-w-md text-balance text-[15px] leading-relaxed text-text-secondary">
          Tell me what you&apos;re stuck on. I&apos;ll tell you honestly whether I can help.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button href="#start" size="lg">
            Start a conversation →
          </Button>
          <TrackedLink
            href={LINKS.linkedin}
            external
            event="linkedin_clicked"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-[15px] font-medium text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50"
          >
            Connect on LinkedIn →
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
