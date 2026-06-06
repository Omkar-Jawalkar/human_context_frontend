"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useRequireAuth } from "@/contexts/auth-context";

export default function ChatsPage() {
  const router = useRouter();
  const { user, isLoading } = useRequireAuth();

  useEffect(() => {
    if (!isLoading && user && !user.organization_id) {
      router.replace("/join-organization");
      return;
    }

    if (!isLoading && user?.organization_id) {
      router.replace("/chats/new");
    }
  }, [isLoading, router, user]);

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
