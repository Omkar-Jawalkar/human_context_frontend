"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare, Search, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserResponse } from "@/lib/types/api";

type UserListProps = {
  users: UserResponse[];
  currentUserId?: string;
  hasActiveFilter?: boolean;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function UserListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden p-0 ring-1 ring-foreground/10">
      <div
        className="hidden border-b border-border bg-muted/30 px-4 py-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:grid-cols-[minmax(0,1fr)_7rem_13rem] sm:gap-4"
        aria-hidden
      >
        <span>Member</span>
        <span className="text-right">Joined</span>
        <span className="sr-only">Actions</span>
      </div>
      <ul className="divide-y divide-border" aria-hidden>
        {Array.from({ length: rows }).map((_, index) => (
          <li
            key={index}
            className="flex items-center gap-4 px-4 py-4 sm:grid sm:grid-cols-[minmax(0,1fr)_7rem_13rem] sm:gap-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
                <div className="h-3 w-48 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
            <div className="hidden h-3 w-16 animate-pulse rounded-md bg-muted sm:block" />
            <div className="ml-auto h-8 w-36 animate-pulse rounded-lg bg-muted sm:ml-0" />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function UserListEmpty({ hasActiveFilter }: { hasActiveFilter: boolean }) {
  return (
    <Card className="ring-1 ring-foreground/10">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {hasActiveFilter ? (
            <Search className="size-5" aria-hidden />
          ) : (
            <Users className="size-5" aria-hidden />
          )}
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight">
          {hasActiveFilter ? "No matching users" : "No users yet"}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {hasActiveFilter
            ? "Try a different email or clear the search."
            : "Members appear here once they join."}
        </p>
      </CardContent>
    </Card>
  );
}

function MemberActions({ memberId }: { memberId: string }) {
  const queryHref = `/${memberId}/query`;
  const chatHref = `/chats/new?contextUserId=${memberId}`;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <Link
        href={queryHref}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-9 min-w-[5.5rem] gap-1.5",
        )}
      >
        <Search className="size-3.5" aria-hidden />
        Query
      </Link>
      <Link
        href={chatHref}
        className={cn(
          buttonVariants({ size: "sm" }),
          "h-9 min-w-[5.5rem] gap-1.5",
        )}
      >
        <MessageSquare className="size-3.5" aria-hidden />
        Chat
      </Link>
    </div>
  );
}

function UserRow({
  member,
  isCurrentUser,
}: {
  member: UserResponse;
  isCurrentUser: boolean;
}) {
  return (
    <li>
      <div className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/40 sm:grid sm:grid-cols-[minmax(0,1fr)_7rem_13rem] sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
            aria-hidden
          >
            {getInitials(member.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {member.name}
              {isCurrentUser ? (
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (you)
                </span>
              ) : null}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {member.email}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
              Joined {formatDate(member.created_at)}
            </p>
          </div>
        </div>
        <p className="hidden shrink-0 text-right text-sm text-muted-foreground sm:block">
          {formatDate(member.created_at)}
        </p>
        <div className="ml-auto shrink-0 sm:ml-0">
          <MemberActions memberId={member.id} />
        </div>
      </div>
    </li>
  );
}

export function UserList({
  users,
  currentUserId,
  hasActiveFilter = false,
}: UserListProps) {
  if (users.length === 0) {
    return <UserListEmpty hasActiveFilter={hasActiveFilter} />;
  }

  return (
    <Card className="overflow-hidden p-0 ring-1 ring-foreground/10">
      <ul className="divide-y divide-border">
        {users.map((member) => (
          <UserRow
            key={member.id}
            member={member}
            isCurrentUser={member.id === currentUserId}
          />
        ))}
      </ul>
    </Card>
  );
}
