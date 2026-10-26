import type { MetadataRoute } from "next";
import { SITE } from "@/data/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
