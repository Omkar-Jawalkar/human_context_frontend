"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

import { UserList, UserListSkeleton } from "@/components/user-list";
import { ApiError } from "@/lib/api/client";
import { listOrganizations } from "@/lib/api/organizations";
import { listUsers } from "@/lib/api/users";
import { useRequireAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserResponse } from "@/lib/types/api";

const PAGE_SIZE = 20;

export default function UsersPage() {
  const router = useRouter();
  const { user, token, isLoading } = useRequireAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
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

    const fetchOrganizationName = async () => {
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

    void fetchOrganizationName();

    return () => {
      cancelled = true;
    };
  }, [token, user]);

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
          <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
        </div>
        <UserListSkeleton rows={4} />
      </div>
    );
  }

  if (!user.organization_id) {
    return null;
  }

  const hasActiveFilter = Boolean(emailFilter);
  const memberLabel =
    total === 1 ? "1 member" : `${total} members`;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {organizationName ?? "Your organization"}
            {!listLoading ? ` · ${memberLabel}` : null}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex max-w-md gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="emailFilter"
              type="search"
              placeholder="Search by email"
              className="h-9 pl-9"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>
          {hasActiveFilter ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={handleClearSearch}
              disabled={listLoading}
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button type="submit" variant="outline" size="sm" className="shrink-0">
              Search
            </Button>
          )}
        </form>
      </header>

      {listError ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{listError}</AlertDescription>
        </Alert>
      ) : null}

      {listLoading ? (
        <UserListSkeleton rows={5} />
      ) : (
        <UserList
          users={users}
          currentUserId={user.id}
          hasActiveFilter={hasActiveFilter}
        />
      )}

      {totalPages > 1 ? (
        <nav
          className="flex items-center justify-between gap-4 pt-2"
          aria-label="Users pagination"
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            disabled={page <= 1 || listLoading}
            onClick={() => setPage((current) => current - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
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
