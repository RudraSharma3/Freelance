import type { ServiceId } from "./services";

export interface Problem {
  id: ServiceId;
  question: string;
  label: string;
}

export const PROBLEMS: Problem[] = [
  { id: "resume", question: "I need a better resume", label: "ATS Resume + Career Positioning" },
  { id: "linkedin", question: "I need to fix my LinkedIn", label: "LinkedIn Optimization" },
  { id: "portfolio", question: "I need a portfolio", label: "Portfolio / Personal Website" },
  { id: "project", question: "I need a college project", label: "Project Development + Technical Guidance" },
  { id: "data", question: "I have messy data", label: "Data Cleaning + Preprocessing" },
  { id: "automation", question: "I want to automate something", label: "Automation + AI Workflows" },
  { id: "custom", question: "I need something custom", label: "Custom Technical Solution" },
];
