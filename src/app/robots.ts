import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/chats",
          "/imports",
          "/users",
          "/organizations",
          "/query",
          "/join-organization",
        ],
      },
    ],
    sitemap: getSiteUrl("/sitemap.xml"),
  };
}
