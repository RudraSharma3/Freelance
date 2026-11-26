import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE, LINKS } from "@/data/config";
import PageViewTracker from "@/components/PageViewTracker";
import EasterEgg from "@/components/easter-egg/EasterEgg";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = `${SITE.name} — Design, development & testing`;
const SHARE_TITLE = `${SITE.name} — ${SITE.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "freelance web development",
    "website design",
    "UI/UX design",
    "app testing QA",
    "college project development",
    "data cleaning",
    "automation services",
    "AI project development",
    "ATS resume",
    "LinkedIn optimization",
    "portfolio website",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: SHARE_TITLE,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: "/images/og.png", width: 1200, height: 630, alt: SHARE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SITE.description,
    images: ["/images/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f6f2",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    slogan: SITE.tagline,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: LINKS.email,
    areaServed: "Worldwide",
  };

  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <PageViewTracker />
        {children}
        <EasterEgg />
        {/* Vercel Analytics: a supplementary, edge-collected reliability
            check alongside the custom dashboard — see README "Analytics
            provider decision" for why this is here and what it does/doesn't
            replace. No-op (renders nothing) when not deployed on Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
