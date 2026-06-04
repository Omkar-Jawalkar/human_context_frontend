"use client";

import { HomeDashboard } from "@/components/home/home-dashboard";
import { HomeLanding } from "@/components/home/home-landing";
import { useAuth } from "@/contexts/auth-context";

function HomeLoading() {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-16">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full max-w-md animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-2/3 max-w-sm animate-pulse rounded-md bg-muted" />
        <div className="mt-4 flex gap-3">
          <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <HomeLoading />;
  }

  if (token && user) {
    return <HomeDashboard />;
  }

  return <HomeLanding />;
}
