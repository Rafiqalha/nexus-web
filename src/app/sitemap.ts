import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  return siteOrigin
    ? [
        "/",
        "/product",
        "/developers",
        "/security",
        "/company",
        "/request-access",
      ].map((path) => ({ url: new URL(path, siteOrigin).href }))
    : [];
}
