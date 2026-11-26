"use client";

import { useCallback, useState } from "react";
import { SERVICE_GROUPS, serviceById, type ServiceId } from "@/data/services";
import type { DisciplineId } from "@/data/disciplines";
import Reveal from "@/components/site/Reveal";
import Sheet from "@/components/site/Sheet";
import RoleTag from "@/components/site/RoleTag";
import ServiceDetail from "@/components/site/ServiceDetail";
import GroupFigure from "@/components/site/Figures";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/** Services as chapters, alternating left and right. Each service opens its own sheet. */
export default function Services() {
  const [active, setActive] = useState<ServiceId | null>(null);
  const close = useCallback(() => setActive(null), []);
  const service = active ? serviceById(active) : null;

  const open = (id: ServiceId) => {
    setActive(id);
    track("service_selected", { service: id, from: "services" });
  };

  return (
    <section id="services" className="section">
      <div className="wrap">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">02 · Services</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
            Four kinds of work, one team.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Every service lists exactly what you get and who works on it. Open one for the details.
          </p>
        </Reveal>

        <ol className="mt-16 grid gap-20 lg:mt-20 lg:gap-28">
          {SERVICE_GROUPS.map((g, i) => {
            const flip = i % 2 === 1;
            const roles = [...new Set(g.services.flatMap((s) => serviceById(s).roles))] as DisciplineId[];
            return (
              <Reveal as="li" key={g.id} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
                {/* Decorative: the same services are reachable from the list beside it. */}
                <div
                  aria-hidden
                  onClick={() => open(g.services[0])}
                  className={cn(
                    "group relative flex min-h-[25rem] w-full cursor-pointer flex-col overflow-hidden rounded-[28px] bg-bg-elevated-2 p-5 sm:p-7 lg:col-span-6 lg:aspect-[5/5.2] lg:min-h-0",
                    flip && "lg:order-2"
                  )}
                >
                  <span className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
                    <span>Fig. {pad(i + 1)}</span>
                    <span>{g.figure}</span>
                  </span>
                  <span className="relative z-[1] flex flex-1 items-center justify-center py-6 transition-transform duration-700 ease-soft group-hover:scale-[1.03]">
                    <GroupFigure id={g.id} />
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-[0.18em] right-4 font-display text-[clamp(7rem,16vw,12rem)] font-bold leading-none tracking-[-0.06em] text-border-strong/45"
                  >
                    {pad(i + 1)}
                  </span>
                </div>

                <div className={cn("lg:col-span-6", flip ? "lg:order-1 lg:pr-10" : "lg:pl-10")}>
                  <p className="eyebrow">Chapter {pad(i + 1)}</p>
                  <h3 className="mt-4 font-display text-[clamp(2rem,3.8vw,3rem)] font-bold leading-[1.04] tracking-[-0.028em]">
                    {g.title}
                  </h3>
                  <p className="mt-5 max-w-[32rem] text-lg leading-relaxed text-text-secondary">{g.line}</p>
                  <ul className="mt-7 max-w-[32rem] border-t border-border">
                    {g.services.map((id) => {
                      const s = serviceById(id);
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => open(id)}
                            className="group flex w-full items-center justify-between gap-4 border-b border-border py-4 text-left"
                          >
                            <span className="text-[17px] font-semibold transition-colors group-hover:text-accent-strong">{s.name}</span>
                            <span className="text-sm font-medium text-text-tertiary transition-[color,transform] group-hover:translate-x-1 group-hover:text-accent-strong">
                              Details →
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-sm text-text-tertiary">What goes into it</span>
                    {roles.map((r) => (
                      <RoleTag key={r} id={r} />
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <Sheet open={!!service} onClose={close} label={service?.name ?? ""}>
        {service && (
          <>
            <p className="eyebrow">{SERVICE_GROUPS.find((g) => g.services.includes(service.id))?.title}</p>
            <h3 className="mt-3 pr-16 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.025em]">
              {service.name}
            </h3>
            <div className="mt-6">
              <ServiceDetail service={service} onStart={close} />
            </div>
          </>
        )}
      </Sheet>
    </section>
  );
}
