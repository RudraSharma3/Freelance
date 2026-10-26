import SectionHeading from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/data/process";

export default function Process() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Process"
        title="How a project actually goes"
        description="Practical execution over unnecessary complexity."
      />

      <div className="mt-14 grid grid-cols-1 gap-0 sm:grid-cols-5">
        {PROCESS_STEPS.map((step) => (
          <div
            key={step.index}
            className="relative border-t border-border-soft py-6 pr-6 sm:border-l sm:border-t-0 sm:py-0 sm:pl-6"
          >
            <span className="font-mono text-xs text-accent-strong">{step.index}</span>
            <h3 className="mt-3 font-display text-base font-medium">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-tertiary">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
