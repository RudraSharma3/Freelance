import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE } from "@/data/config";
import PageViewTracker from "@/components/PageViewTracker";
import EasterEgg from "@/components/easter-egg/EasterEgg";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — AI, Data & Automation Engineer, Jaipur`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Rudra Sharma",
    "AI freelancer Jaipur",
    "Data engineer freelancer",
    "AI project development",
    "ATS resume",
    "Resume optimization",
    "LinkedIn optimization",
    "Portfolio website development",
    "Data cleaning",
    "Automation services",
    "College project development",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: `${SITE.name} — You bring the problem. I build the solution.`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    images: [{ url: "/images/rudra-avatar-og.jpg", width: 512, height: 512, alt: SITE.name }],
  },
  twitter: {
    card: "summary",
    title: `${SITE.name} — You bring the problem. I build the solution.`,
    description: SITE.description,
    images: ["/images/rudra-avatar-og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.role,
    url: SITE.url,
    address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressCountry: "IN" },
    sameAs: [],
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
