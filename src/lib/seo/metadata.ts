import type { Metadata } from "next";

import { getSiteUrl, siteConfig } from "@/lib/site";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "",
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} · ${siteConfig.name}` : siteConfig.name;
  const canonicalUrl = getSiteUrl(path);

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/logo.svg",
          width: 512,
          height: 512,
          alt: `${siteConfig.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
      images: ["/logo.svg"],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  keywords: [...siteConfig.keywords],
  category: "technology",
  alternates: {
    canonical: getSiteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl("/"),
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: `${siteConfig.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.shortDescription,
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
};
