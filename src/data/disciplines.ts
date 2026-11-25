/**
 * What the company can do in-house. These are kinds of work, not people:
 * the site shows no individual profiles. Each one is used as a small tag on
 * services, the "Start here" brief and the process steps.
 */

export type DisciplineId = "design" | "dev" | "qa" | "data" | "content" | "pm";

export interface Discipline {
  id: DisciplineId;
  name: string;
  short: string; // label on tags and stamps
  line: string;
  covers: string[];
  when: string;
}

/** One colour per discipline, used only for small markers. */
export const DISCIPLINE_COLOR: Record<DisciplineId, string> = {
  design: "#c93d1b",
  dev: "#2747c9",
  qa: "#1f7a4d",
  data: "#16161a",
  content: "#7a3fb0",
  pm: "#9a6200",
};

export const DISCIPLINES: Discipline[] = [
  {
    id: "design",
    name: "Design",
    short: "Design",
    line: "Screens you can click through and approve before anything gets built.",
    covers: [
      "User flows and wireframes from the agreed scope",
      "High-fidelity screens for phone and desktop",
      "A clickable prototype you sign off before development starts",
      "A clean handoff, so what's built matches what you approved",
    ],
    when: "Right after scoping, while changes are still cheap.",
  },
  {
    id: "dev",
    name: "Development",
    short: "Dev",
    line: "What was designed, built front to back and put live on your domain.",
    covers: [
      "A responsive front end that matches the approved design",
      "APIs, databases, logins and forms behind it",
      "Deployment, domain setup and a short guide to editing content",
      "Readable code that you own at the end",
    ],
    when: "During the build, with a progress check-in at each stage.",
  },
  {
    id: "qa",
    name: "Testing",
    short: "QA",
    line: "We try to break it before your users do.",
    covers: [
      "A test plan written from what the project is supposed to do",
      "Testing on real phones, tablets and the main browsers",
      "Bug reports with steps to reproduce and screenshots",
      "A re-test after every fix, and a sign-off before launch",
    ],
    when: "Before launch, with a list of what was tested and what was fixed.",
  },
  {
    id: "data",
    name: "AI & data",
    short: "AI & data",
    line: "Data pipelines, ML models and AI workflows that hold up on real data.",
    covers: [
      "Cleaning, validating and reshaping messy datasets",
      "Trained and evaluated ML models, with explanations where they matter",
      "Document Q&A and other LLM workflows grounded in your own data",
      "Automations that take a manual step out of someone's week",
    ],
    when: "Whenever a project involves data, models or automation.",
  },
  {
    id: "content",
    name: "Content & careers",
    short: "Content",
    line: "The words: resumes, LinkedIn profiles and the copy on your website.",
    covers: [
      "Resumes built around results, structured so ATS software can read them",
      "LinkedIn headlines, About sections and experience entries",
      "Website copy and project write-ups",
      "One consistent voice across everything we hand over",
    ],
    when: "On resume, LinkedIn and portfolio work, and whenever a site needs words.",
  },
  {
    id: "pm",
    name: "Project management",
    short: "PM",
    line: "One point of contact who knows where your project stands on any given day.",
    covers: [
      "Turning the first conversation into a written scope",
      "Setting the timeline and keeping the work to it",
      "Updates without you having to chase them",
      "Collecting your feedback and getting it to the right place",
    ],
    when: "From the first message to the handover.",
  },
];

export const disciplineById = (id: DisciplineId) => DISCIPLINES.find((d) => d.id === id)!;
