"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { JoinableOrganizationList } from "@/components/joinable-organization-list";
import { ApiError } from "@/lib/api/client";
import { listOrganizations } from "@/lib/api/organizations";
import { joinOrganization } from "@/lib/api/users";
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
import type { OrganizationResponse } from "@/lib/types/api";

const PAGE_SIZE = 20;

export default function JoinOrganizationPage() {
  const router = useRouter();
  const { user, token, refreshUser, isLoading } = useRequireAuth();
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user?.super_admin) {
      router.replace("/organizations");
    }
  }, [isLoading, router, user?.super_admin]);

  useEffect(() => {
    if (!isLoading && user?.organization_id) {
      router.replace("/users");
    }
  }, [isLoading, router, user?.organization_id]);

  useEffect(() => {
    if (!token || user?.super_admin || user?.organization_id) {
      return;
    }

    let cancelled = false;

    const fetchOrganizations = async () => {
      setListLoading(true);
      setListError(null);

      try {
        const response = await listOrganizations(token, {
          page,
          page_size: PAGE_SIZE,
          name: nameFilter || undefined,
        });

        if (!cancelled) {
          setOrganizations(response.items);
          setTotalPages(response.total_pages);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof ApiError && error.status === 403
              ? "Unable to load organizations. Contact your admin."
              : error instanceof ApiError
                ? error.message
                : "Failed to load organizations.";
          setListError(message);
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    };

    void fetchOrganizations();

    return () => {
      cancelled = true;
    };
  }, [token, user?.super_admin, user?.organization_id, page, nameFilter]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setNameFilter(searchInput.trim());
  };

  const handleJoin = async (organizationId: string) => {
    if (!token) {
      return;
    }

    setJoiningId(organizationId);

    try {
      await joinOrganization(token, organizationId);
      await refreshUser();
      toast.success("Joined organization successfully");
      router.push("/users");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to join organization. Please try again.";
      toast.error(message);
    } finally {
      setJoiningId(null);
    }
  };

  if (isLoading || user?.super_admin) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Join an organization
        </h1>
        <p className="text-sm text-muted-foreground">
          Select an organization below to unlock imports and query features.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Available organizations</CardTitle>
          <CardDescription>
            Browse organizations you can join.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="nameFilter" className="sr-only">
                Search by name
              </Label>
              <Input
                id="nameFilter"
                placeholder="Search by name…"
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
            <p className="text-sm text-muted-foreground">
              Loading organizations…
            </p>
          ) : (
            <JoinableOrganizationList
              organizations={organizations}
              joiningId={joiningId}
              onJoin={(id) => void handleJoin(id)}
            />
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
        </CardContent>
      </Card>
    </div>
  );
}
