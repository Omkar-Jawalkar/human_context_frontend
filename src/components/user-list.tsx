"use client";

import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserResponse } from "@/lib/types/api";

type UserListProps = {
  users: UserResponse[];
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
        className="hidden border-b border-border bg-muted/30 px-4 py-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:grid-cols-[minmax(0,1fr)_7rem_10.5rem] sm:gap-4"
        aria-hidden
      >
        <span>Member</span>
        <span className="text-right">Joined</span>
        <span className="sr-only">Action</span>
      </div>
      <ul className="divide-y divide-border" aria-hidden>
        {Array.from({ length: rows }).map((_, index) => (
          <li
            key={index}
            className="flex items-center gap-4 px-4 py-4 sm:grid sm:grid-cols-[minmax(0,1fr)_7rem_10.5rem] sm:gap-4"
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
            ? "Try a different email or clear the search to see everyone in your organization."
            : "Members appear here once they join your organization."}
        </p>
      </CardContent>
    </Card>
  );
}

function UserRow({ member }: { member: UserResponse }) {
  const queryHref = `/${member.id}/query`;

  return (
    <li>
      <div className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/40 sm:grid sm:grid-cols-[minmax(0,1fr)_7rem_10.5rem] sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
            aria-hidden
          >
            {getInitials(member.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{member.name}</p>
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
          <Link
            href={queryHref}
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 min-w-[10.5rem] gap-1.5",
            )}
          >
            Query conversations
            <ArrowRight
              className="size-3.5 opacity-70 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </li>
  );
}

export function UserList({ users, hasActiveFilter = false }: UserListProps) {
  if (users.length === 0) {
    return <UserListEmpty hasActiveFilter={hasActiveFilter} />;
  }

  return (
    <Card className="overflow-hidden p-0 ring-1 ring-foreground/10">
      <CardHeader className="border-b border-border bg-muted/30 px-4 py-3">
        <CardTitle className="text-sm font-medium">Organization members</CardTitle>
        <CardDescription className="text-xs">
          Open semantic search against each member&apos;s imported conversations.
        </CardDescription>
      </CardHeader>
      <div
        className="hidden border-b border-border px-4 py-2.5 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid sm:grid-cols-[minmax(0,1fr)_7rem_10.5rem] sm:gap-4"
        aria-hidden
      >
        <span>Member</span>
        <span className="text-right">Joined</span>
        <span className="text-right">Action</span>
      </div>
      <ul className="divide-y divide-border">
        {users.map((member) => (
          <UserRow key={member.id} member={member} />
        ))}
      </ul>
    </Card>
  );
}
