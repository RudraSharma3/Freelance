/**
 * SITE CONFIGURATION — single source of truth.
 *
 * Change the studio name, links, contact details and headline numbers here.
 * Nothing below should require touching component/JSX code.
 *
 * Values marked `[PLACEHOLDER]` are not confirmed yet and must be replaced
 * before launch.
 */

export const SITE = {
  // [PLACEHOLDER] studio name. Until the team picks one, the site uses this.
  name: "Rudra Sharma & Team",
  shortName: "Rudra & Team",
  handle: "rudra_and_team", // shown in the `whoami` easter egg
  role: "Design, development, testing, AI and data",
  location: "Jaipur, India",
  tagline: "You bring the problem. We build the fix.",
  description:
    "A small freelance team from Jaipur. Design, development and testing under one roof, with AI and data engineering when the problem needs it. Websites, apps, college projects, data cleanup, automation, resumes and LinkedIn.",
  peopleHelped: 13, // update this single number when it changes
  // [PLACEHOLDER]: set NEXT_PUBLIC_SITE_URL once you have a domain
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelance-kappa-orpin.vercel.app",
};

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/rudra-sharma-3508a227b",
  github: "https://github.com/RudraSharma3",
  portfolio: "https://rudrasharma3.github.io/Portfolio/",
  email: "rudrasharma93511@gmail.com",
  whatsapp: "https://wa.me/919461537947",
  resume: "/rudra-sharma-resume.pdf",
};

/**
 * Admin dashboard password is read from an environment variable
 * (ADMIN_DASHBOARD_PASSWORD) — never hardcode it here. See .env.example.
 */
