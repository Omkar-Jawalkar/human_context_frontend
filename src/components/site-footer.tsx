import Link from "next/link";

import { GitHubLink } from "@/components/brand/github-link";
import { LogoWordmark } from "@/components/brand/logo";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex transition-opacity hover:opacity-80"
            >
              <LogoWordmark logoClassName="size-6" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <nav aria-label="Footer">
              <GitHubLink label="View on GitHub" />
            </nav>
            <p className="text-xs text-muted-foreground">
              © {year} {siteConfig.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
