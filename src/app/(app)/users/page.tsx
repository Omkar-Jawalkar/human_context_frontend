"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import { UserList, UserListSkeleton } from "@/components/user-list";
import { ApiError } from "@/lib/api/client";
import { listUsers } from "@/lib/api/users";
import { useRequireAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserResponse } from "@/lib/types/api";

const PAGE_SIZE = 20;

export default function UsersPage() {
  const router = useRouter();
  const { user, token, isLoading } = useRequireAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [emailFilter, setEmailFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!isLoading && user && !user.organization_id && !user.super_admin) {
      router.replace("/join-organization");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (!token || !user?.organization_id) {
      return;
    }

    let cancelled = false;

    const fetchUsers = async () => {
      setListLoading(true);
      setListError(null);

      try {
        const response = await listUsers(token, {
          organization_id: user.organization_id!,
          page,
          page_size: PAGE_SIZE,
          email: emailFilter || undefined,
        });

        if (!cancelled) {
          setUsers(response.items);
          setTotalPages(response.total_pages);
          setTotal(response.total);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof ApiError && error.status === 403
              ? "Unable to load users. Contact your admin."
              : error instanceof ApiError
                ? error.message
                : "Failed to load users.";
          setListError(message);
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    };

    void fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [token, user, page, emailFilter]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setEmailFilter(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setEmailFilter("");
    setPage(1);
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-7 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
        </div>
        <UserListSkeleton rows={4} />
      </div>
    );
  }

  if (!user.organization_id) {
    return null;
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);
  const hasActiveFilter = Boolean(emailFilter);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Users</h1>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          Choose a member to run semantic search over their imported Claude
          conversations.
        </p>
      </header>

      <Card className="ring-1 ring-foreground/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Find a member</CardTitle>
          <CardDescription>
            Filter by email address within your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="emailFilter">Email</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="emailFilter"
                  type="search"
                  placeholder="name@company.com"
                  className="h-10 pl-9"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button type="submit" className="h-10 min-w-24">
                Search
              </Button>
              {hasActiveFilter ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 gap-1.5"
                  onClick={handleClearSearch}
                  disabled={listLoading}
                >
                  <X className="size-4" aria-hidden />
                  Clear
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {listError ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{listError}</AlertDescription>
        </Alert>
      ) : null}

      <section className="space-y-4" aria-labelledby="users-list-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="users-list-heading" className="text-sm font-medium">
            Members
          </h2>
          {!listLoading && total > 0 ? (
            <p className="text-sm text-muted-foreground">
              {hasActiveFilter ? (
                <>
                  {total} match{total === 1 ? "" : "es"}
                  {totalPages > 1
                    ? ` · showing ${showingFrom}–${showingTo}`
                    : null}
                </>
              ) : (
                <>
                  {total} member{total === 1 ? "" : "s"}
                  {totalPages > 1
                    ? ` · ${showingFrom}–${showingTo} on this page`
                    : null}
                </>
              )}
            </p>
          ) : null}
        </div>

        {listLoading ? (
          <UserListSkeleton rows={5} />
        ) : (
          <UserList users={users} hasActiveFilter={hasActiveFilter} />
        )}
      </section>

      {totalPages > 1 ? (
        <nav
          className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4"
          aria-label="Users pagination"
        >
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={page <= 1 || listLoading}
            onClick={() => setPage((current) => current - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={page >= totalPages || listLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
