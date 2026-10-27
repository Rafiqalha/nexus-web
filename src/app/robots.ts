import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/demo" },
    ...(siteOrigin ? { sitemap: `${siteOrigin}/sitemap.xml` } : {}),
  };
}
