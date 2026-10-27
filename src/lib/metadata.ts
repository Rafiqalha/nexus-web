import type { Metadata } from "next";
// Server build configuration; never infer an owned domain from a preview hostname.
export const siteOrigin = process.env.SITE_URL
  ? new URL(process.env.SITE_URL).origin
  : undefined;
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    ...(siteOrigin
      ? { alternates: { canonical: new URL(path, siteOrigin).href } }
      : {}),
    openGraph: {
      title: `${title} | Nexus`,
      description,
      type: "website",
      siteName: "Nexus",
      ...(siteOrigin
        ? {
            url: new URL(path, siteOrigin).href,
            images: [
              {
                url: new URL("/opengraph-image", siteOrigin).href,
                width: 1200,
                height: 630,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Nexus`,
      description,
    },
  };
}
