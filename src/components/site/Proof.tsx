import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/site/Reveal";
import { SITE } from "@/data/config";

const KINDS = ["Resumes", "LinkedIn", "Portfolios", "College projects", "Data cleaning", "Automation", "AI / ML"];

/** One honest number, and where it comes from. */
export default function Proof() {
  return (
    <section id="proof" className="border-t border-border bg-bg-elevated">
      <div className="wrap grid items-center gap-8 py-16 sm:py-20 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Reveal>
          <CountUp
            to={SITE.peopleHelped}
            suffix="+"
            className="block font-display text-[clamp(5.5rem,14vw,10rem)] font-bold leading-[0.85] tracking-[-0.05em] text-accent"
          />
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-text-tertiary">People helped so far</p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-xl text-xl leading-relaxed">
            A small number, and a real one. Each was a specific problem for a specific person.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <span key={k} className="rounded-full border border-border px-3.5 py-1.5 text-sm text-text-secondary">
                {k}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
