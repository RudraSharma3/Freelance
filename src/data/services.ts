export type ServiceId =
  | "resume"
  | "linkedin"
  | "portfolio"
  | "project"
  | "data"
  | "ai-ml"
  | "automation"
  | "ai-workflows"
  | "custom";

export interface Service {
  id: ServiceId;
  name: string;
  problem: string;
  deliverables: string[];
  whoFor: string;
  cta: string;
}

export const SERVICES: Service[] = [
  {
    id: "resume",
    name: "ATS Resume Building",
    problem:
      "Your resume gets filtered out by applicant tracking systems before a person ever reads it, or it reads like a list of duties instead of results.",
    deliverables: [
      "ATS-parseable resume structured around measurable outcomes",
      "Keyword alignment against target roles",
      "One round of revision after you review it",
    ],
    whoFor: "Students and early-career professionals applying to tech and analytics roles.",
    cta: "Fix my resume",
  },
  {
    id: "linkedin",
    name: "LinkedIn Optimization",
    problem:
      "Your profile doesn't explain what you actually do, so recruiters and connections scroll past it.",
    deliverables: [
      "Rewritten headline and About section",
      "Experience section reframed around outcomes",
      "Guidance on what to post so the profile keeps working after I'm done",
    ],
    whoFor: "Anyone job-hunting or building a professional presence.",
    cta: "Fix my LinkedIn",
  },
  {
    id: "portfolio",
    name: "Portfolio / Personal Website",
    problem:
      "You've done real work, but there's nowhere for someone to see it that isn't a PDF or a GitHub repo they'll never open.",
    deliverables: [
      "A fast, responsive personal site built on Next.js",
      "Project write-ups instead of a link dump",
      "Deployment to your own domain",
    ],
    whoFor: "Developers, students and professionals who need a real presence online.",
    cta: "Build my portfolio",
  },
  {
    id: "project",
    name: "College Project Development",
    problem:
      "You have a project requirement and a deadline, but not the time or technical depth to build something that actually works and that you can explain in a viva.",
    deliverables: [
      "A working project scoped to what you can defend and explain",
      "Clean, documented code — not something copy-pasted",
      "A walkthrough so you understand what was built",
    ],
    whoFor: "Engineering and CS students who need a project done properly.",
    cta: "Get help with my project",
  },
  {
    id: "data",
    name: "Data Cleaning & Preprocessing",
    problem:
      "Your dataset has duplicate records, inconsistent formats, missing values or mixed schemas, and it's blocking whatever you're trying to build or analyze.",
    deliverables: [
      "Cleaned, validated, analysis-ready dataset",
      "Documented transformation steps",
      "A reusable pipeline if the same data keeps arriving",
    ],
    whoFor: "Anyone with messy spreadsheets, exports or multi-sheet workbooks.",
    cta: "Clean my data",
  },
  {
    id: "ai-ml",
    name: "AI / ML Projects",
    problem:
      "You have a prediction, classification or retrieval problem and need a working model — not just a notebook that runs once.",
    deliverables: [
      "A trained, evaluated model with clear metrics",
      "Explainability where it matters (e.g. SHAP)",
      "A usable interface or API around the model",
    ],
    whoFor: "Students, researchers and teams with a real ML problem to solve.",
    cta: "Scope my ML project",
  },
  {
    id: "automation",
    name: "Automation",
    problem:
      "You're doing the same manual, repetitive task every week — moving files, formatting reports, chasing data between tools.",
    deliverables: [
      "A script or pipeline that removes the manual step",
      "Error handling so it doesn't fail silently",
      "Documentation so someone else can run it",
    ],
    whoFor: "Small teams and individuals stuck doing repetitive manual work.",
    cta: "Automate this",
  },
  {
    id: "ai-workflows",
    name: "AI Workflows",
    problem:
      "You want to use LLMs for a real task — answering questions from your own documents, classifying incoming text — without hallucinated or unreliable output.",
    deliverables: [
      "A retrieval-grounded pipeline (RAG) built around your data",
      "Evaluation of accuracy before you rely on it",
      "An API or interface your team can actually use",
    ],
    whoFor: "Teams that want LLMs applied to their own documents or workflows.",
    cta: "Build my AI workflow",
  },
  {
    id: "custom",
    name: "Custom Technical Solutions",
    problem:
      "Your problem doesn't fit neatly into a category above — you just need someone to understand it and figure out what to build.",
    deliverables: [
      "A scoping conversation before anything is built",
      "An honest answer if it isn't a good fit",
      "A plan for what gets delivered and when",
    ],
    whoFor: "Anyone with a specific technical problem and no clear off-the-shelf solution.",
    cta: "Tell me the problem",
  },
];
