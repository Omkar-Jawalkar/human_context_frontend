"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/contexts/auth-context";

const ORG_REQUIRED_PATHS = ["/imports", "/users"];
const SUPER_ADMIN_ONLY_PATHS = ["/organizations"];

function requiresOrganization(pathname: string): boolean {
  if (
    ORG_REQUIRED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  ) {
    return true;
  }

  return pathname.endsWith("/query");
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, token } = useAuth();

  useEffect(() => {
    if (isLoading || !token || !user) {
      return;
    }

    const isSuperAdminOnly = SUPER_ADMIN_ONLY_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isSuperAdminOnly && !user.super_admin) {
      router.replace(user.organization_id ? "/users" : "/join-organization");
      return;
    }

    if (requiresOrganization(pathname) && !user.organization_id) {
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
