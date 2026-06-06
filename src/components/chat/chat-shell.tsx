"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { listThreads } from "@/lib/api/chats";
import { listOrganizations } from "@/lib/api/organizations";
import { useAuth } from "@/contexts/auth-context";
import type { ChatThread } from "@/lib/types/api";

export function ChatShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, token, logout } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationName, setOrganizationName] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.organization_id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchThreads = async () => {
      setLoading(true);
      try {
        const response = await listThreads(token);
        if (!cancelled) {
          setThreads(response.threads);
        }
      } catch {
        if (!cancelled) {
          setThreads([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchThreads();

    return () => {
      cancelled = true;
    };
  }, [token, user, pathname]);

  useEffect(() => {
    if (!token || !user?.organization_id) {
      return;
    }

    let cancelled = false;

    const fetchOrg = async () => {
      try {
        const response = await listOrganizations(token, { page_size: 100 });
        const org = response.items.find((item) => item.id === user.organization_id);
        if (!cancelled) {
          setOrganizationName(org?.name ?? null);
        }
      } catch {
        if (!cancelled) {
          setOrganizationName(null);
        }
      }
    };

    void fetchOrg();

    return () => {
      cancelled = true;
    };
  }, [token, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-dvh min-h-0 w-full flex-col md:flex-row">
      <ChatSidebar
        threads={threads}
        loading={loading}
        user={user}
        organizationName={organizationName}
        onLogout={logout}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
