"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/contexts/auth-context";

const ORG_REQUIRED_PATHS = ["/imports", "/query"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, token } = useAuth();

  useEffect(() => {
    if (isLoading || !token) {
      return;
    }

    const requiresOrganization = ORG_REQUIRED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (requiresOrganization && user && !user.organization_id) {
      router.replace("/join-organization");
    }
  }, [isLoading, pathname, router, token, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
