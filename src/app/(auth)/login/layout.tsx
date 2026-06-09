import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Sign in",
  description:
    "Sign in to your Human Context workspace to search imported AI chat history with semantic retrieval.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
