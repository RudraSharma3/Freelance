/**
 * SITE CONFIGURATION — single source of truth.
 *
 * Change the company name, contact details and headline numbers here.
 * Nothing below should require touching component/JSX code.
 */

export const SITE = {
  name: "Brief & Build",
  handle: "brief_and_build", // shown in the `whoami` easter egg
  role: "Design, development, testing, AI and data",
  location: "Jaipur, India",
  tagline: "You bring the problem. We build the fix.",
  description:
    "Brief & Build is a small freelance team from Jaipur. Design, development and testing under one roof, with AI and data engineering when a project needs it: websites and apps, college projects, data cleanup and automation, resumes and LinkedIn.",
  peopleHelped: 13, // update this single number when it changes
  // Set NEXT_PUBLIC_SITE_URL once you have a domain
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://freelance-kappa-orpin.vercel.app",
};

/**
 * Public contact channels. Swap in a company email address and number here
 * when you have them; every button on the site reads from this object.
 */
export const LINKS = {
  email: "rudrasharma93511@gmail.com",
  whatsapp: "https://wa.me/919461537947",
};

/**
 * Admin dashboard password is read from an environment variable
 * (ADMIN_DASHBOARD_PASSWORD) — never hardcode it here. See .env.example.
 */
