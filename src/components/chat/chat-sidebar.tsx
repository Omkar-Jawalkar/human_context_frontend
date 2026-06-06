"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatThread, UserResponse } from "@/lib/types/api";

type ChatSidebarProps = {
  threads: ChatThread[];
  loading: boolean;
  user: UserResponse;
  organizationName?: string | null;
  onLogout: () => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function SidebarContent({
  threads,
  loading,
  user,
  organizationName,
  onLogout,
  onNavigate,
}: ChatSidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isNewChat = pathname === "/chats/new";

  return (
    <>
      <div className="flex items-center justify-between gap-2 px-3 py-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="font-heading text-sm font-bold tracking-tight"
        >
          Human Context
        </Link>
      </div>

      {organizationName ? (
        <p className="px-4 pb-2 text-xs text-muted-foreground">{organizationName}</p>
      ) : null}

      <nav
        className="space-y-0.5 px-2 pb-3"
        aria-label="Workspace navigation"
      >
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
          )}
        >
          <Home className="size-4 shrink-0" aria-hidden />
          Workspace
        </Link>
        <Link
          href="/users"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
          )}
        >
          <Users className="size-4 shrink-0" aria-hidden />
          Users
        </Link>
      </nav>

      <div className="px-3 pb-3">
        <Link
          href="/chats/new"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 w-full justify-start gap-2 rounded-lg border-border/80 bg-background font-normal shadow-none",
            isNewChat && "bg-muted",
          )}
        >
          <MessageSquarePlus className="size-4" aria-hidden />
          New chat
        </Link>
      </div>

      <div className="px-4 pb-2">
        <p className="text-xs font-medium text-muted-foreground">Recents</p>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-2" aria-label="Recent chats">
        {loading ? (
          <ul className="space-y-1 px-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <li
                key={index}
                className="h-9 animate-pulse rounded-lg bg-muted/60"
                aria-hidden
              />
            ))}
          </ul>
        ) : threads.length === 0 ? (
          <p className="px-2 py-3 text-xs text-muted-foreground">No chats yet</p>
        ) : (
          <ul className="space-y-0.5">
            {threads.map((thread) => {
              const href = `/chats/${thread.id}`;
              const isActive = pathname === href;

              return (
                <li key={thread.id}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={cn(
                      "block truncate rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                    title={thread.title}
                  >
                    {thread.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      <div className="mt-auto border-t border-border/60 p-3">
        <div className="flex items-center gap-3 rounded-lg px-1 py-1">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
            aria-hidden
          >
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-8 w-full justify-start text-muted-foreground"
          onClick={onLogout}
        >
          Sign out
        </Button>
      </div>
    </>
  );
}

export function ChatSidebar(props: ChatSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex shrink-0 items-center border-b border-border/60 px-3 py-2 md:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
        >
          {mobileOpen ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </Button>
        <span className="ml-2 text-sm font-medium">Chats</span>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={cn(
          "flex w-[260px] shrink-0 flex-col border-r border-border/60 bg-muted/20",
          "fixed inset-y-0 left-0 z-50 transition-transform md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <SidebarContent {...props} onNavigate={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
