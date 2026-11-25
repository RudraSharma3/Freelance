import type { DisciplineId } from "./disciplines";

export type ServiceId =
  | "website"
  | "design"
  | "portfolio"
  | "project"
  | "resume"
  | "linkedin"
  | "data"
  | "ai-ml"
  | "ai-workflows"
  | "automation"
  | "testing"
  | "custom";

export interface Service {
  id: ServiceId;
  name: string;
  problem: string;
  deliverables: string[];
  whoFor: string;
  cta: string;
  /** Which option to pre-select in the project form. Must match a value in ProjectIntake's NEEDS. */
  intake: string;
  /** What goes into it. */
  roles: DisciplineId[];
}

export const SERVICES: Service[] = [
  {
    id: "website",
    name: "Websites & web apps",
    problem:
      "You need a site or a small web app that loads fast, works on phones, and doesn't fall apart the first time someone edits the text.",
    deliverables: [
      "Design first, so you approve how it looks before it's built",
      "A responsive build on a modern stack (Next.js by default)",
      "Tested on phones, tablets and the main browsers before launch",
      "Deployment to your domain, plus a short guide to editing content",
    ],
    whoFor: "Small businesses, startups, clubs and individuals who need a proper web presence.",
    cta: "Plan my website",
    intake: "Website / web app",
    roles: ["pm", "design", "dev", "qa"],
  },
  {
    id: "design",
    name: "UI/UX design",
    problem:
      "You have an idea, or a product whose screens are confusing and inconsistent, and you want it to make sense before anyone writes code.",
    deliverables: [
      "User flows and wireframes",
      "High-fidelity screens for phone and desktop",
      "A clickable prototype you can put in front of real people",
      "Design files and a handoff your developers can build from",
    ],
    whoFor: "Founders and teams who want the product to make sense before it's built.",
    cta: "Design my product",
    intake: "UI/UX design",
    roles: ["design", "pm"],
  },
  {
    id: "portfolio",
    name: "Portfolio & personal sites",
    problem:
      "You've done real work, but there's nowhere to see it that isn't a PDF or a GitHub repo nobody opens.",
    deliverables: [
      "A fast personal site designed around your best work",
      "Project write-ups instead of a list of links",
      "Deployment to your own domain",
    ],
    whoFor: "Developers, students and professionals who need a real presence online.",
    cta: "Build my portfolio",
    intake: "Portfolio",
    roles: ["design", "dev", "content"],
  },
  {
    id: "project",
    name: "College project development",
    problem:
      "You have a project requirement and a deadline, but not the time or technical depth to build something that works and that you can explain in a viva.",
    deliverables: [
      "A working project scoped to what you can defend and explain",
      "Clean, documented code, not something copy-pasted",
      "A walkthrough so you understand what was built and why",
    ],
    whoFor: "Engineering and CS students who need a project done properly.",
    cta: "Get help with my project",
    intake: "College project",
    roles: ["dev", "data"],
  },
  {
    id: "resume",
    name: "ATS resume building",
    problem:
      "Your resume gets filtered out by applicant tracking systems before a person reads it, or it reads like a list of duties instead of results.",
    deliverables: [
      "An ATS-readable resume built around measurable outcomes",
      "Keywords aligned with the roles you're targeting",
      "One round of revisions after you've reviewed it",
    ],
    whoFor: "Students and early-career professionals applying for tech and analytics roles.",
    cta: "Fix my resume",
    intake: "Resume",
    roles: ["content"],
  },
  {
    id: "linkedin",
    name: "LinkedIn optimisation",
    problem: "Your profile doesn't explain what you actually do, so recruiters and connections scroll past it.",
    deliverables: [
      "A rewritten headline and About section",
      "Experience entries reframed around outcomes",
      "Guidance on what to post so the profile keeps working afterwards",
    ],
    whoFor: "Anyone job-hunting or building a professional presence.",
    cta: "Fix my LinkedIn",
    intake: "LinkedIn",
    roles: ["content"],
  },
  {
    id: "data",
    name: "Data cleaning & pipelines",
    problem:
      "Your dataset has duplicates, inconsistent formats, missing values or mixed schemas, and it's blocking whatever you're trying to build or analyse.",
    deliverables: [
      "A cleaned, validated, analysis-ready dataset",
      "Every transformation step documented",
      "A reusable pipeline if the same data keeps arriving",
    ],
    whoFor: "Anyone with messy spreadsheets, exports or multi-sheet workbooks.",
    cta: "Clean my data",
    intake: "Data",
    roles: ["data", "qa"],
  },
  {
    id: "ai-ml",
    name: "AI / ML projects",
    problem:
      "You have a prediction, classification or retrieval problem and need a working model, not a notebook that runs once.",
    deliverables: [
      "A trained, evaluated model with clear metrics",
      "Explanations where they matter (for example, SHAP)",
      "A usable interface or API around the model",
    ],
    whoFor: "Students, researchers and teams with a real ML problem to solve.",
    cta: "Scope my ML project",
    intake: "AI / ML",
    roles: ["data", "dev"],
  },
  {
    id: "ai-workflows",
    name: "AI workflows (RAG)",
    problem:
      "You want LLMs to do a real job, like answering questions from your own documents, without made-up or unreliable answers.",
    deliverables: [
      "A retrieval-grounded pipeline built around your data",
      "Accuracy checked before you rely on it",
      "An API or interface your team can actually use",
    ],
    whoFor: "Teams that want LLMs applied to their own documents or workflows.",
    cta: "Build my AI workflow",
    intake: "AI / ML",
    roles: ["data", "dev", "qa"],
  },
  {
    id: "automation",
    name: "Automation",
    problem:
      "Someone does the same manual task every week: moving files, formatting reports, chasing data between tools.",
    deliverables: [
      "A script or pipeline that removes the manual step",
      "Error handling so it doesn't fail silently",
      "Documentation so someone else can run it",
    ],
    whoFor: "Small teams and individuals stuck with repetitive manual work.",
    cta: "Automate this",
    intake: "Automation",
    roles: ["data", "dev"],
  },
  {
    id: "testing",
    name: "Testing & QA",
    problem:
      "Your app works on your laptop. You're not sure it works on everyone else's, and you'd rather find out before your users do.",
    deliverables: [
      "A test plan based on what the app is supposed to do",
      "Manual testing across phones, tablets and browsers",
      "Bug reports with steps to reproduce and screenshots",
      "A re-test after fixes, and a short release checklist",
    ],
    whoFor: "Anyone about to launch, or already live and hearing about bugs from users.",
    cta: "Test my app",
    intake: "Testing / QA",
    roles: ["qa", "dev"],
  },
  {
    id: "custom",
    name: "Something custom",
    problem:
      "Your problem doesn't fit any of the boxes above. You need someone to understand it and work out what to build.",
    deliverables: [
      "A scoping conversation before anything is built",
      "An honest answer if it isn't a good fit for us",
      "A plan for what gets delivered and when",
    ],
    whoFor: "Anyone with a specific technical problem and no obvious off-the-shelf fix.",
    cta: "Tell us the problem",
    intake: "Something else",
    roles: ["pm"],
  },
];

export const serviceById = (id: ServiceId) => SERVICES.find((s) => s.id === id)!;

/** The four chapters in the Services section. */
export interface ServiceGroup {
  id: "build" | "data" | "students" | "testing";
  title: string;
  line: string;
  services: ServiceId[];
  figure: string;
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "build",
    title: "Websites & apps",
    line: "Designed first, built properly, tested on real devices, then put live on your domain.",
    services: ["website", "design", "portfolio"],
    figure: "Design, build, test, launch",
  },
  {
    id: "data",
    title: "Data, AI & automation",
    line: "Clean the data, build the model, or take the manual step out of someone's week.",
    services: ["data", "ai-ml", "ai-workflows", "automation"],
    figure: "Messy in, clean out",
  },
  {
    id: "students",
    title: "Students & careers",
    line: "College projects you can explain in a viva, and resumes and profiles that actually get read.",
    services: ["project", "resume", "linkedin"],
    figure: "Built around results",
  },
  {
    id: "testing",
    title: "Testing & QA",
    line: "Already built something? We test it properly before your users find the bugs for you.",
    services: ["testing"],
    figure: "Nothing ships untested",
  },
];
