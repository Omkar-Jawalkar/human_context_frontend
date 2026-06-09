import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: getSiteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getSiteUrl("/login"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: getSiteUrl("/register"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
