import SectionHeading from "@/components/ui/SectionHeading";
import CountUp from "@/components/ui/CountUp";
import { SITE } from "@/data/config";

const CATEGORIES = [
  { label: "Resumes" },
  { label: "LinkedIn" },
  { label: "Portfolios" },
  { label: "College projects" },
  { label: "Data cleaning" },
  { label: "Automation" },
  { label: "AI / ML" },
];

export default function Proof() {
  return (
    <section id="proof" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading eyebrow="Proof" title={`${SITE.peopleHelped}+ problems solved`} />

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
        <div className="flex items-baseline gap-2">
          <CountUp
            to={SITE.peopleHelped}
            suffix="+"
            className="font-display text-7xl font-medium leading-none text-accent-strong sm:text-8xl lg:text-9xl"
          />
        </div>

        <div>
          <p className="max-w-md text-sm leading-relaxed text-text-secondary">
            A small, real number — not inflated. Each one was a specific problem, for a specific
            person, across these categories:
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c.label}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs text-text-secondary"
              >
                {c.label}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs text-text-tertiary">
            Every solution is custom-built with production-grade reliability, clean architecture, and rapid execution.
          </p>
        </div>
      </div>
    </section>
  );
}
