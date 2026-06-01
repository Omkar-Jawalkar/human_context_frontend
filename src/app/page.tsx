"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, token } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!user?.organization_id && !user?.super_admin) {
      router.replace("/join-organization");
      return;
    }

    if (user?.super_admin) {
      router.replace("/organizations");
      return;
    }

    router.replace("/query");
  }, [isLoading, router, token, user]);

  return (
    <div className="flex min-h-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
