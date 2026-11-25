import { SITE, LINKS } from "@/data/config";
import VisitorCounter from "@/components/ui/VisitorCounter";
import Brand from "@/components/site/Brand";

/** Small links on top; the company name, huge, along the bottom edge. */
export default function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="wrap flex flex-col gap-6 pt-14 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[15px] font-semibold">{SITE.tagline}</p>
          <p className="mt-1 text-sm text-text-secondary">
            {SITE.role}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-text-secondary">
          <a href="#services" className="hover:text-text-primary">
            Services
          </a>
          <a href="#process" className="hover:text-text-primary">
            Process
          </a>
          <a href={LINKS.whatsapp} target="_blank" rel="noreferrer" className="hover:text-text-primary">
            WhatsApp
          </a>
          <a href={`mailto:${LINKS.email}`} className="hover:text-text-primary">
            Email
          </a>
        </div>
      </div>

      <p
        aria-hidden
        className="mt-10 select-none whitespace-nowrap text-center font-display text-[clamp(4rem,17.5vw,17rem)] font-bold leading-[0.8] tracking-[-0.055em]"
      >
        <Brand />
      </p>

      <div className="wrap flex flex-col-reverse items-start justify-between gap-3 border-t border-border py-6 sm:flex-row sm:items-center">
        <p className="text-sm text-text-tertiary">
          © {new Date().getFullYear()} {SITE.name}. Built with Next.js.
        </p>
        <VisitorCounter />
      </div>
    </footer>
  );
}
