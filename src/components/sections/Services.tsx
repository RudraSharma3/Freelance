import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Services() {
  return (
    <section id="services" className="border-t border-border-soft bg-bg-elevated/30">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Services"
          title="What I actually deliver"
          description="No generic marketing language — here's exactly what each service includes."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href="#start"
              className="group flex flex-col rounded-2xl border border-border bg-bg p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40"
            >
              <h3 className="font-display text-lg font-medium">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.problem}</p>

              <ul className="mt-4 space-y-1.5">
                {s.deliverables.slice(0, 2).map((d) => (
                  <li key={d} className="flex gap-2 text-[13px] text-text-tertiary">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-accent-strong opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {s.cta} <ArrowRight size={14} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
