export interface SkillArea {
  id: string;
  label: string;
  summary: string;
  items: string[];
}

/**
 * Every item here is pulled directly from the SKILLS / EXPERIENCE / PROJECTS
 * sections of Rudra's resume. Nothing added.
 */
export const SKILL_AREAS: SkillArea[] = [
  {
    id: "ai",
    label: "AI",
    summary: "Models, LLM pipelines and applied ML, from training to deployment.",
    items: [
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "XGBoost",
      "NLP",
      "LLMs",
      "RAG",
      "LangChain",
      "SHAP (explainable AI)",
    ],
  },
  {
    id: "data",
    label: "Data",
    summary: "Cleaning, pipelines and large-scale processing.",
    items: ["Apache Spark", "Databricks", "Pandas", "ETL pipelines", "PostgreSQL", "Supabase"],
  },
  {
    id: "automation",
    label: "Automation",
    summary: "Removing manual, repetitive work from real workflows.",
    items: [
      "Asynchronous data pipelines (FastAPI + Starlette)",
      "Document/format conversion pipelines",
      "IBM watsonx proof-of-concept deployment",
    ],
  },
  {
    id: "web",
    label: "Web",
    summary: "Backend services and the interfaces on top of them.",
    items: ["FastAPI", "Flask", "REST APIs", "React", "HTML", "CSS", "Chart.js", "Git"],
  },
  {
    id: "career-tech",
    label: "Career Tech",
    summary: "Applying the same engineering discipline to resumes, profiles and portfolios.",
    items: ["ATS-aware resume structuring", "LinkedIn positioning", "Portfolio site development"],
  },
];

export const CORE_LANGUAGES = ["Python", "Java", "SQL", "JavaScript"];
