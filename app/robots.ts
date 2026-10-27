import type { MetadataRoute } from "next";

// Put this file at app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private areas out of search results
        disallow: ["/admin", "/api", "/superadmin", "/auth/"],
      },
    ],
    sitemap: "https://jeweleryengine.com/sitemap.xml",
  };
}
