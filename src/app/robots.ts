import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";

const siteUrl = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/gift/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
