"use client";

import type { Service } from "@/data/services";
import RoleTag from "@/components/site/RoleTag";
import StartButton from "@/components/site/StartButton";

/** One service, as shown inside a sheet. */
export default function ServiceDetail({
  service,
  onStart,
  compact,
}: {
  service: Service;
  onStart: () => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : "mt-2"}>
      <p className="text-[17px] leading-relaxed text-text-primary">{service.problem}</p>
      <p className="eyebrow mb-3 mt-7">What you get</p>
      <ul className="grid gap-2.5">
        {service.deliverables.map((d) => (
          <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-text-secondary">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            {d}
          </li>
        ))}
      </ul>
      <div className="mt-7 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="eyebrow mb-2.5">Who it&apos;s for</p>
          <p className="text-[15px] text-text-secondary">{service.whoFor}</p>
        </div>
        <div>
          <p className="eyebrow mb-2.5">Who works on it</p>
          <div className="flex flex-wrap gap-1.5">
            {service.roles.map((r) => (
              <RoleTag key={r} id={r} />
            ))}
          </div>
        </div>
      </div>
      <StartButton need={service.intake} from={`service_${service.id}`} onClick={onStart} className="mt-8">
        {service.cta}
        <span className="transition-transform group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </StartButton>
    </div>
  );
}
