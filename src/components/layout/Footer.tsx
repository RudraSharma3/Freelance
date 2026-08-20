import { SITE, LINKS } from "@/data/config";
import VisitorCounter from "@/components/ui/VisitorCounter";
import TrackedLink from "@/components/ui/TrackedLink";

export default function Footer() {
  return (
    <footer className="border-t border-border-soft">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg">{SITE.name}</p>
            <p className="mt-1 text-sm text-text-tertiary">
              {SITE.role} · {SITE.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
            <TrackedLink
              href={LINKS.linkedin}
              external
              event="linkedin_clicked"
              className="hover:text-text-primary"
            >
              LinkedIn
            </TrackedLink>
            <TrackedLink
              href={LINKS.github}
              external
              event="github_clicked"
              className="hover:text-text-primary"
            >
              GitHub
            </TrackedLink>
            <TrackedLink
              href={LINKS.resume}
              external
              event="resume_downloaded"
              className="hover:text-text-primary"
            >
              Resume
            </TrackedLink>
            <a href={`mailto:${LINKS.email}`} className="hover:text-text-primary">
              Email
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-border-soft pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} {SITE.name}. Built with Next.js.
          </p>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
