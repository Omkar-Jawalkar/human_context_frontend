import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Create account",
  description:
    "Create a Human Context workspace account, import AI chat exports, and search your team's conversation history.",
  path: "/register",
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
