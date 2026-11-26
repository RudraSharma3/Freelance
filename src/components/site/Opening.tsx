import { DISCIPLINES, DISCIPLINE_COLOR } from "@/data/disciplines";
import { CASE_STUDIES } from "@/data/caseStudies";
import StartButton, { LinkButton } from "@/components/site/StartButton";
import ScrollCue from "@/components/site/ScrollCue";

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

const CONTENTS = [
  ["Start here", "#start-here"],
  ["Services", "#services"],
  ["Under one roof", "#studio"],
  ...(CASE_STUDIES.length ? [["Work", "#work"]] : []),
  ["How we work", "#process"],
  ["Start a project", "#start"],
];

/** First screen. Plays its sequence once on load: label, headline, a line drawing in, then the rest. */
export default function Opening() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center pb-24 pt-28">
      <div className="wrap">
        <p className="eyebrow rise" style={d(0.3)}>
          Freelance studio · Working remotely
        </p>
        <h1
          className="rise mt-6 max-w-[16ch] font-display text-[clamp(3.1rem,9vw,7.75rem)] font-bold leading-[0.92] tracking-[-0.035em]"
          style={d(0.5)}
        >
          You bring the problem. <span className="text-accent">We build the fix.</span>
        </h1>
        <div className="draw mt-9 h-[3px] w-20 rounded-full bg-accent" style={d(1.05)} />

        <div className="mt-9 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <div>
            <p className="rise max-w-[38rem] text-lg leading-relaxed text-text-secondary sm:text-xl" style={d(1.2)}>
              A small freelance team. Design, development and testing under one roof, with AI and data work when a
              project needs it. Websites and apps, college projects, data cleanup and automation, resumes and LinkedIn.
            </p>
            <div className="rise mt-8 flex flex-wrap items-center gap-3" style={d(1.45)}>
              <StartButton size="lg" from="hero">
                Start a project
                <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </StartButton>
              <LinkButton href="#services" size="lg">
                See what we do
              </LinkButton>
            </div>
            <div className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-text-secondary" style={d(1.7)}>
              <span className="inline-flex items-center gap-2.5">
                <i className="ping relative h-2 w-2 rounded-full bg-signal text-signal" aria-hidden />
                Taking new projects
              </span>
              <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
                {DISCIPLINES.slice(0, 4).map((x) => (
                  <span key={x.id} className="inline-flex items-center gap-1.5">
                    <i className="h-2 w-2 rounded-[2px]" style={{ background: DISCIPLINE_COLOR[x.id] }} aria-hidden />
                    {x.name}
                  </span>
                ))}
              </span>
            </div>
          </div>

          <nav aria-label="On this page" className="rise hidden lg:block" style={d(1.6)}>
            <p className="eyebrow mb-4">On this page</p>
            {CONTENTS.map(([label, href], i) => (
              <a
                key={href}
                href={href}
                className="grid grid-cols-[2rem_1fr] border-b border-border py-2.5 text-[15px] text-text-secondary transition-[color,padding] duration-300 hover:pl-1.5 hover:text-text-primary"
              >
                <span className="text-text-tertiary tabular-nums">0{i + 1}</span>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}
