import type { MetadataRoute } from "next";

// Put this file at app/sitemap.ts
// Add every new public page here (integration pages, blog posts) as you publish them.
const SITE = "https://jeweleryengine.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    // Examples to enable once the pages exist:
    // { url: `${SITE}/ring-builder-for-wordpress`, lastModified: now, priority: 0.7 },
    // { url: `${SITE}/ring-builder-for-wix`, lastModified: now, priority: 0.7 },
    // { url: `${SITE}/blog/get-more-custom-ring-inquiries`, lastModified: now, priority: 0.6 },
  ];
}
