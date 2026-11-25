/**
 * The team. Roles come first; names are optional.
 *
 * - `name: null` renders the card by role only. Add the person's name (and a
 *   photo in /public/images/team/) when they're confirmed.
 * - `responsibilities` describe what the role does on a project. They are a
 *   description of the process, not claims about a particular person.
 * - The project manager and content writer roles were added on top of the
 *   original three (designer, developer, tester). Remove them here if the team
 *   decides not to fill them, and update `roles` in services.ts/problems.ts.
 */

export type RoleId = "lead" | "design" | "dev" | "qa" | "pm" | "content";

export interface TeamMember {
  id: RoleId;
  role: string;
  short: string; // the one-word label used on tags and stamps
  name: string | null;
  photo?: string;
  line: string;
  responsibilities: string[];
  whenYouMeet: string;
  stack?: string[];
  links?: { label: string; url: string }[];
}

/** One colour per role, used only for small markers (tags, stamps, monograms). */
export const ROLE_COLOR: Record<RoleId, string> = {
  lead: "#16161a",
  design: "#c93d1b",
  dev: "#2747c9",
  qa: "#1f7a4d",
  pm: "#9a6200",
  content: "#7a3fb0",
};

export const TEAM: TeamMember[] = [
  {
    id: "lead",
    role: "Lead engineer · AI & data",
    short: "Lead",
    name: "Rudra Sharma",
    photo: "/images/rudra-avatar.jpg",
    line: "Owns the technical decisions on every project, and builds the AI, data and backend parts himself.",
    responsibilities: [
      "Reviews every brief and decides what actually needs to be built",
      "Builds data pipelines, ML models, RAG systems and backend APIs",
      "Reviews the code before anything ships",
      "Mentors the team on Python, data and AI tooling",
    ],
    whenYouMeet: "On the first call, and any time there's a technical decision to make.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Pandas", "Spark", "Databricks", "Scikit-learn", "XGBoost", "LLMs & RAG", "Qdrant", "Docker", "Azure"],
    links: [
      { label: "Portfolio", url: "https://rudrasharma3.github.io/Portfolio/" },
      { label: "GitHub", url: "https://github.com/RudraSharma3" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/rudra-sharma-3508a227b" },
    ],
  },
  {
    id: "design",
    role: "Designer · UI/UX",
    short: "Design",
    name: null, // [PLACEHOLDER] designer's name
    line: "Turns a rough idea into screens you can click through before anything gets built.",
    responsibilities: [
      "User flows and wireframes from the agreed scope",
      "High-fidelity screens for phone and desktop",
      "A clickable prototype you approve before development starts",
      "A clean handoff the developer can build from exactly",
    ],
    whenYouMeet: "Right after scoping, while changes are still cheap.",
  },
  {
    id: "dev",
    role: "Developer · web & apps",
    short: "Dev",
    name: null, // [PLACEHOLDER] developer's name
    line: "Builds what was designed, front to back, and puts it live on your domain.",
    responsibilities: [
      "Responsive front end that matches the approved design",
      "APIs, databases, logins and forms behind it",
      "Deployment, domain setup and a short guide to editing content",
      "Readable code that you own at the end",
    ],
    whenYouMeet: "During the build, at each progress check-in.",
  },
  {
    id: "qa",
    role: "Tester · quality assurance",
    short: "QA",
    name: null, // [PLACEHOLDER] tester's name
    line: "Tries to break it before your users do.",
    responsibilities: [
      "A test plan written from what the project is supposed to do",
      "Testing on real phones, tablets and the main browsers",
      "Bug reports with steps to reproduce and screenshots",
      "A re-test after every fix, and a sign-off before launch",
    ],
    whenYouMeet: "Before launch, with a list of what was tested and what was fixed.",
  },
  {
    id: "pm",
    role: "Project manager",
    short: "PM",
    name: null, // [PLACEHOLDER] added role: project manager
    line: "Your one point of contact. Knows where the project stands on any given day.",
    responsibilities: [
      "Turns the first conversation into a written scope",
      "Sets the timeline and keeps the team to it",
      "Sends updates without you having to chase them",
      "Collects your feedback and gets it to the right person",
    ],
    whenYouMeet: "From the first message to the handover.",
  },
  {
    id: "content",
    role: "Content & career writer",
    short: "Writer",
    name: null, // [PLACEHOLDER] added role: content writer
    line: "Writes the words: resumes, LinkedIn profiles and the copy on your website.",
    responsibilities: [
      "Resumes built around results, structured so ATS software can read them",
      "LinkedIn headlines, About sections and experience entries",
      "Website copy and project write-ups",
      "One consistent voice across everything we hand over",
    ],
    whenYouMeet: "On resume, LinkedIn and portfolio projects, and whenever a site needs words.",
  },
];

export const roleById = (id: RoleId) => TEAM.find((m) => m.id === id)!;
