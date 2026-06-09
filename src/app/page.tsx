import type { Metadata } from "next";

import { HomePage } from "@/components/home/home-page";
import { LandingJsonLd } from "@/components/seo/landing-json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  description: siteConfig.description,
  path: "/",
});

export default function Page() {
  return (
    <>
      <LandingJsonLd />
      <HomePage />
    </>
  );
}
