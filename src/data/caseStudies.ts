export type WorkTag = "AI" | "Data" | "Automation" | "Web" | "Design" | "Careers";

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
 * Client projects shown in the Work section.
 *
 * Empty on purpose: the Work section (and its nav link) only appears once
 * there's at least one entry. Add client projects here, with the client's
 * permission, and keep every number real. Example:
 *
 * {
 *   slug: "clinic-booking-site",
 *   title: "Booking site for a dental clinic",
 *   tag: "Web",
 *   line: "One sentence that says what it is.",
 *   context: "Client, 2027. Design, development and testing.",
 *   problem: "What wasn't working before.",
 *   whatWeDid: ["Bullet one", "Bullet two", "Bullet three"],
 *   tech: ["Next.js", "Supabase"],
 *   result: "The real, specific outcome.",
 *   links: [{ label: "Live site", url: "https://..." }],
 * }
 */
export const CASE_STUDIES: CaseStudy[] = [];

export const WORK_TAGS: WorkTag[] = ["Web", "Design", "AI", "Data", "Automation", "Careers"];
