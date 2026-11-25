export type WorkTag = "AI" | "Data" | "Automation" | "Web & career";

export interface CaseStudy {
  slug: string;
  title: string;
  tag: WorkTag;
  line: string;
  context: string;
  problem: string;
  whatWeDid: string[];
  tech: string[];
  result: string;
  links: { label: string; url: string }[];
}

/**
 * Every fact here comes from Rudra's resume or the project's own public repo.
 * So far these were all built by Rudra, before the team came together; the
 * Work section says so. Add team projects at the top as they ship.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "datapurge-studio",
    title: "DataPurge Studio",
    tag: "Data",
    line: "A cleaning engine for multi-sheet workbooks that one-off scripts kept breaking.",
    context: "Built by Rudra at BytePX.",
    problem:
      "Teams were cleaning complex, multi-sheet workbooks by hand or with one-off scripts: slow, error-prone, and blocking the work that depended on them.",
    whatWeDid: [
      "Architected an asynchronous, multi-tenant data engine on FastAPI and PostgreSQL",
      "Streamed uploads through io.BytesIO buffers on Starlette thread pools, with dynamic type downcasting",
      "Paired an O(N) lookahead sniffer with RapidFuzz to make fuzzy matching about 10x faster",
    ],
    tech: ["FastAPI", "PostgreSQL", "Pandas", "RapidFuzz", "React", "Docker"],
    result: "Complex multi-sheet workbooks clean in under 2 minutes at 99.9% accuracy, 15–20x faster than before.",
    links: [
      { label: "Code", url: "https://github.com/RudraSharma3/datapurge-studio" },
      { label: "Live demo", url: "https://datapurge-studio.vercel.app" },
    ],
  },
  {
    slug: "hours-reconciliation",
    title: "Hours Reconciliation",
    tag: "Automation",
    line: "Checks ERP timesheets against what employees confirm, through a Google Chat bot.",
    context: "Built by Rudra at BytePX.",
    problem:
      "Every billing cycle, HR compared ERP timesheet hours with employees' own numbers by chasing people over chat and email.",
    whatWeDid: [
      "Pulled hours from the ERP through CSV imports or the live ERPNext API",
      "Asked each employee to confirm their hours in Google Chat, with a single-use magic link as a fallback",
      "Flagged every mismatch exactly, with automatic reminders and escalation to HR",
    ],
    tech: ["Next.js", "TypeScript", "Prisma", "Google Chat API", "ERPNext", "Vitest"],
    result: "Removed 8–10 hours of manual HR work a month across 20+ employees.",
    links: [
      { label: "Code", url: "https://github.com/RudraSharma3/Hr_Hours_reconciliation" },
      { label: "Live demo", url: "https://hr-hours-reconciliation.vercel.app" },
    ],
  },
  {
    slug: "voxcontextengine",
    title: "VoxContextEngine",
    tag: "AI",
    line: "Document Q&A that combines vector and keyword search, so answers stay tied to the source.",
    context: "Rudra's open-source project.",
    problem: "LLM answers are only as trustworthy as what they're grounded in. Ungrounded models confidently make things up.",
    whatWeDid: [
      "Built a document-grounded RAG engine with FastAPI and Docker",
      "Combined dense vector search (Qdrant, MiniLM embeddings, HNSW) with BM25 keyword search",
      "Wrote an evaluation suite that checks answers against their source documents",
    ],
    tech: ["Python", "FastAPI", "Qdrant", "BM25", "Gemini", "Docker"],
    result: "Answered 5 of 5 evaluation questions from the correct source document.",
    links: [{ label: "Code", url: "https://github.com/RudraSharma3/vox-context-engine" }],
  },
  {
    slug: "birbal-chatbot",
    title: "Birbal 2.0",
    tag: "AI",
    line: "A Hindi–English chatbot over technical documentation, for regional teams.",
    context: "Built by Rudra during an AI & ML internship at UltraTech Cement (Birla White).",
    problem:
      "Employees needed answers from dense technical documentation without waiting on slow, blocking retrieval queries.",
    whatWeDid: [
      "Built an LLM-powered RAG pipeline on FastAPI over the technical documentation",
      "Replaced blocking SQL/API retrieval with asynchronous pipelines",
      "Added Hindi–English support with context carried across questions",
    ],
    tech: ["FastAPI", "RAG", "NLP", "LLMs"],
    result: "Cut query response latency by 95% and improved query efficiency by 60%.",
    links: [],
  },
  {
    slug: "standup-pulse",
    title: "StandupPulse",
    tag: "Automation",
    line: "A Google Chat bot that collects daily standups one-to-one and builds the team view.",
    context: "Rudra's project, deployed as a live demo.",
    problem: "Group standup channels get noisy, and someone still has to piece together who worked on what, for how long.",
    whatWeDid: [
      "Messaged each teammate privately in Google Chat with a morning prompt",
      "Parsed free-text replies like \"project X for 3 hours\" into tasks, hours and blockers",
      "Built a dashboard with attendance, history, nudges for late replies and CSV export",
    ],
    tech: ["TypeScript", "Next.js", "Google Chat API", "NLP"],
    result: "Live demo running. Replies are free text, with no form for the team to fill in.",
    links: [
      { label: "Code", url: "https://github.com/RudraSharma3/ChucklePulse" },
      { label: "Live demo", url: "https://chuckle-pulse.vercel.app" },
    ],
  },
  {
    slug: "resume-tailor",
    title: "Resume Tailor",
    tag: "Web & career",
    line: "Tailors a resume to a job description without inventing a single thing.",
    context: "Rudra's open-source project. The thinking behind our resume service.",
    problem: "AI resume tools happily add skills and numbers you don't have, and keyword-stuffed resumes read badly to humans.",
    whatWeDid: [
      "Computed the ATS match score with a deterministic engine instead of asking a model to guess",
      "Required evidence from the original resume for every keyword the AI adds",
      "Flagged any number that wasn't in the original resume or the user's own answers",
    ],
    tech: ["Python", "LLMs", "LaTeX"],
    result: "Every pass is scored, so you can see the resume improve without it drifting away from the truth.",
    links: [{ label: "Code", url: "https://github.com/RudraSharma3/Resume_tailor" }],
  },
  {
    slug: "portfolio",
    title: "Rudra's portfolio",
    tag: "Web & career",
    line: "A portfolio where every number links to its evidence.",
    context: "Rudra's own site. An example of the portfolio service.",
    problem: "Most portfolios list big numbers and skills with nothing behind them, so reviewers skim past.",
    whatWeDid: [
      "Wrote each claim next to a link to the code, benchmark or credential behind it",
      "Built project breakdowns that open in place instead of linking out",
      "Kept it fast: plain HTML, CSS and JavaScript, no frameworks or trackers",
    ],
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    result: "Live on GitHub Pages.",
    links: [{ label: "Live site", url: "https://rudrasharma3.github.io/Portfolio/" }],
  },
];

export const WORK_TAGS: WorkTag[] = ["AI", "Data", "Automation", "Web & career"];
