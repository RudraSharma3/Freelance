import { SITE, LINKS } from "@/data/config";
import VisitorCounter from "@/components/ui/VisitorCounter";
import Brand from "@/components/site/Brand";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="wrap py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold tracking-tight">
              <Brand />
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {SITE.role}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-text-secondary">
            <a href="#services" className="hover:text-text-primary">
              Services
            </a>
            <a href="#start" className="hover:text-text-primary">
              Start a project
            </a>
            <a href={LINKS.whatsapp} target="_blank" rel="noreferrer" className="hover:text-text-primary">
              WhatsApp
            </a>
            <a href={`mailto:${LINKS.email}`} className="hover:text-text-primary">
              Email
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} {SITE.name}. Built with Next.js.
          </p>
          <VisitorCounter />
        </div>
      </div>
    </footer>
  );
}
