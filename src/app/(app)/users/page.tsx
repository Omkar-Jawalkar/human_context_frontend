"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UserList } from "@/components/user-list";
import { ApiError } from "@/lib/api/client";
import { listUsers } from "@/lib/api/users";
import { useRequireAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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

  if (isLoading || !user) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!user.organization_id) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Select a user to query their imported conversations.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex max-w-md gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="emailFilter" className="sr-only">
            Search by email
          </Label>
          <Input
            id="emailFilter"
            placeholder="Search by email…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {listError ? (
        <Alert variant="destructive">
          <AlertDescription>{listError}</AlertDescription>
        </Alert>
      ) : null}

      {listLoading ? (
        <p className="text-sm text-muted-foreground">Loading users…</p>
      ) : (
        <UserList users={users} />
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || listLoading}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || listLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
