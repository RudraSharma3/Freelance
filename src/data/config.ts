/**
 * SITE CONFIGURATION — single source of truth.
 *
 * Change links, contact details and headline numbers here.
 * Nothing below should require touching component/JSX code.
 *
 * Values wrapped in `[PLACEHOLDER — ADD REAL INFORMATION]` are not
 * real data supplied by Rudra and must be replaced before launch.
 */

export const SITE = {
  name: "Rudra Sharma",
  role: "AI, Data & Automation Engineer",
  location: "Jaipur, India",
  tagline: "You bring the problem. I build the solution.",
  description:
    "Rudra Sharma helps students, professionals and small teams turn messy career, technical and business problems into usable solutions — across AI, data engineering, automation and web.",
  peopleHelped: 13, // update this single number when it changes
  // [PLACEHOLDER — ADD REAL INFORMATION]: set NEXT_PUBLIC_SITE_URL once you have a domain
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rudrasharma.dev",
};

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/rudra-sharma-3508a227b",
  github: "https://github.com/RudraSharma3",
  email: "rudrasharma93511@gmail.com",
  whatsapp: "https://wa.me/919461537947",
  resume: "/rudra-sharma-resume.pdf",
};

/**
 * Admin dashboard password is read from an environment variable
 * (ADMIN_DASHBOARD_PASSWORD) — never hardcode it here. See .env.example.
 */
