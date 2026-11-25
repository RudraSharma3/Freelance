import type { ServiceId } from "./services";
import type { RoleId } from "./team";

export interface Problem {
  id: ServiceId;
  question: string;
  label: string;
  roles: RoleId[];
}

/** The "Start here" brief: a problem in the visitor's words, what it becomes, and who picks it up. */
export const PROBLEMS: Problem[] = [
  { id: "website", question: "My business needs a website", label: "Website or web app", roles: ["design", "dev", "qa"] },
  { id: "design", question: "I have an idea, not a design", label: "UI/UX design and a prototype", roles: ["design"] },
  { id: "portfolio", question: "I need a portfolio", label: "Portfolio site", roles: ["design", "dev"] },
  { id: "project", question: "I need a college project", label: "Project build and walkthrough", roles: ["lead", "dev"] },
  { id: "data", question: "I have messy data", label: "Data cleaning and a pipeline", roles: ["lead"] },
  { id: "automation", question: "I keep doing the same task by hand", label: "Automation or an AI workflow", roles: ["lead", "dev"] },
  { id: "testing", question: "My app has bugs I can't pin down", label: "Testing and QA", roles: ["qa"] },
  { id: "resume", question: "I need a better resume", label: "ATS resume and positioning", roles: ["content", "lead"] },
  { id: "linkedin", question: "My LinkedIn isn't working for me", label: "LinkedIn optimisation", roles: ["content"] },
  { id: "custom", question: "Something else entirely", label: "A custom solution, scoped first", roles: ["pm", "lead"] },
];
