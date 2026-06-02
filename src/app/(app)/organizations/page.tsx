"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import {
  createOrganization,
  listOrganizations,
} from "@/lib/api/organizations";
import { OrganizationList } from "@/components/organization-list";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrganizationResponse } from "@/lib/types/api";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CreateFormValues = z.infer<typeof createSchema>;

export default function OrganizationsPage() {
  const router = useRouter();
  const { user, token, isLoading } = useRequireAuth();
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "" },
  });

  const loadOrganizations = useCallback(async () => {
    if (!token) {
      return;
    }

    setListError(null);

    try {
      const response = await listOrganizations(token);
      setOrganizations(response.items);
    } catch (error) {
      setListError(
        error instanceof ApiError
          ? error.message
          : "Failed to load organizations",
      );
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading && user && !user.super_admin) {
      router.replace(user.organization_id ? "/users" : "/join-organization");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (!token || !user?.super_admin) {
      return;
    }

    let cancelled = false;

    const fetchOrganizations = async () => {
      setListError(null);

      try {
        const response = await listOrganizations(token);

        if (!cancelled) {
          setOrganizations(response.items);
        }
      } catch (error) {
        if (!cancelled) {
          setListError(
            error instanceof ApiError
              ? error.message
              : "Failed to load organizations",
          );
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
  }, [token, user?.super_admin]);

  const onCreate = handleSubmit(async (values) => {
    if (!token) {
      return;
    }

    try {
      await createOrganization(token, { name: values.name });
      toast.success("Organization created");
      reset({ name: "" });
      setActiveTab("all");
      setListLoading(true);
      await loadOrganizations();
      setListLoading(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to create organization",
      );
    }
  });

  if (isLoading || !user || !token) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!user.super_admin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organizations</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage organizations. Share an organization ID with tenants
          so they can join at{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            /join-organization?org=&lt;uuid&gt;
          </code>
          .
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="all">All organizations</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>Create organization</CardTitle>
              <CardDescription>
                Add a new organization for tenants to join.
              </CardDescription>
            </CardHeader>
            <form onSubmit={onCreate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization name</Label>
                  <Input
                    id="name"
                    placeholder="Acme Inc"
                    {...register("name")}
                  />
                  {errors.name ? (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating…" : "Create organization"}
                </Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          {listError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{listError}</AlertDescription>
            </Alert>
          ) : null}
          {listLoading ? (
            <p className="text-sm text-muted-foreground">Loading organizations…</p>
          ) : (
            <OrganizationList
              organizations={organizations}
              token={token}
              onChanged={() => {
                setListLoading(true);
                void loadOrganizations().finally(() => setListLoading(false));
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
