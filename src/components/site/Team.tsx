"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { PenTool, CodeXml, Bug, ClipboardList, PenLine, BrainCircuit, type LucideIcon } from "lucide-react";
import { TEAM, ROLE_COLOR, type RoleId, type TeamMember } from "@/data/team";
import { SERVICES } from "@/data/services";
import Reveal from "@/components/site/Reveal";
import Sheet from "@/components/site/Sheet";
import { track } from "@/lib/analytics";

const ICON: Record<RoleId, LucideIcon> = {
  lead: BrainCircuit,
  design: PenTool,
  dev: CodeXml,
  qa: Bug,
  pm: ClipboardList,
  content: PenLine,
};

/** Faint background mark on role tiles without a photo. */
const MARK: Record<RoleId, string> = { lead: "AI", design: "UX", dev: "Dev", qa: "QA", pm: "PM", content: "Aa" };

/** Photo if there is one, otherwise a calm tile in the role's colour with its icon. */
function Portrait({ m, size }: { m: TeamMember; size: "card" | "sheet" }) {
  const Icon = ICON[m.id];
  const box = size === "card" ? "aspect-[6/5] w-full" : "h-24 w-24";
  if (m.photo) {
    return (
      <div className={`${box} overflow-hidden rounded-[20px] bg-bg-elevated-2`}>
        <Image src={m.photo} alt={m.name ?? m.role} width={600} height={600} className="h-full w-full object-cover object-[50%_22%]" />
      </div>
    );
  }
  return (
    <div
      className={`${box} relative flex items-center justify-center overflow-hidden rounded-[20px]`}
      style={{ background: `color-mix(in srgb, ${ROLE_COLOR[m.id]} 9%, var(--bg-elevated))` }}
      aria-hidden
    >
      <Icon size={size === "card" ? 52 : 30} strokeWidth={1.4} style={{ color: ROLE_COLOR[m.id] }} />
      {size === "card" && (
        <span
          className="absolute -bottom-3 -right-1 font-display text-[6.5rem] font-bold leading-none tracking-[-0.06em]"
          style={{ color: `color-mix(in srgb, ${ROLE_COLOR[m.id]} 14%, transparent)` }}
        >
          {MARK[m.id]}
        </span>
      )}
    </div>
  );
}

/** The team: one card per role. Each opens a sheet with what that person does on your project. */
export default function Team() {
  const [active, setActive] = useState<TeamMember | null>(null);
  const close = useCallback(() => setActive(null), []);

  // Not tracked: team cards aren't services, and the dashboard's "looking for" list counts service_selected.
  const open = (m: TeamMember) => setActive(m);

  return (
    <section id="team" className="section">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">03 · The team</p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              Who you&apos;ll work with.
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-text-secondary">
              Small on purpose. Every project gets the people it needs and nobody it doesn&apos;t. Open a card to see what each
              role does on your project.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal as="li" key={m.id} delay={(i % 3) * 0.06}>
              <button type="button" onClick={() => open(m)} className="group block w-full text-left">
                <div className="transition-transform duration-700 ease-soft group-hover:-translate-y-1">
                  <Portrait m={m} size="card" />
                </div>
                <p className="mt-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: ROLE_COLOR[m.id] }}>
                  <i className="h-2 w-2 rounded-[2px]" style={{ background: ROLE_COLOR[m.id] }} aria-hidden />
                  {m.role}
                </p>
                <h3 className="mt-2 font-display text-[1.6rem] font-bold leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent-strong">
                  {m.name ?? m.role.split(" · ")[0]}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{m.line}</p>
                <p className="mt-3 text-sm font-semibold text-accent-strong">
                  What they do{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </p>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <Sheet open={!!active} onClose={close} label={active?.name ?? active?.role ?? ""}>
        {active && (
          <>
            <div className="flex items-center gap-5 pr-16">
              <Portrait m={active} size="sheet" />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: ROLE_COLOR[active.id] }}>
                  {active.role}
                </p>
                <h3 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.025em]">
                  {active.name ?? active.role.split(" · ")[0]}
                </h3>
              </div>
            </div>
            <p className="mt-6 text-lg leading-relaxed">{active.line}</p>

            <p className="eyebrow mb-3 mt-8">On your project</p>
            <ul className="grid gap-2.5">
              {active.responsibilities.map((r) => (
                <li key={r} className="flex gap-3 text-[15px] leading-relaxed text-text-secondary">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ROLE_COLOR[active.id] }} aria-hidden />
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-2.5">When you&apos;ll hear from them</p>
                <p className="text-[15px] text-text-secondary">{active.whenYouMeet}</p>
              </div>
              <div>
                <p className="eyebrow mb-2.5">Works on</p>
                <p className="text-[15px] text-text-secondary">
                  {SERVICES.filter((s) => s.roles.includes(active.id))
                    .map((s) => s.name)
                    .join(", ")}
                </p>
              </div>
            </div>

            {active.stack && (
              <>
                <p className="eyebrow mb-3 mt-8">Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {active.stack.map((s) => (
                    <span key={s} className="rounded-full border border-border px-3 py-1 text-sm text-text-secondary">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
            {active.links && (
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6">
                {active.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      l.label === "LinkedIn" ? track("linkedin_clicked") : l.label === "GitHub" ? track("github_clicked") : undefined
                    }
                    className="text-[15px] font-semibold text-accent-strong hover:underline"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </Sheet>
    </section>
  );
}
