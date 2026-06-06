"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { NoImportsCta } from "@/components/chat/no-imports-cta";
import { askQuery } from "@/lib/api/query";
import { getApiErrorMessage } from "@/lib/api/errors";
import { hasNoImportsMessage } from "@/lib/context/no-imports";
import { resolveOrgUser } from "@/hooks/use-org-users";
import { listOrganizations } from "@/lib/api/organizations";
import { QuerySources } from "@/components/query-sources";
import { useRequireAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { QueryResponse, UserResponse } from "@/lib/types/api";

const querySchema = z.object({
  query: z.string().min(1, "Enter a question"),
});

type QueryFormValues = z.infer<typeof querySchema>;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function UserQueryPage() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const { user, token, isLoading } = useRequireAuth();
  const [targetUser, setTargetUser] = useState<UserResponse | null>(null);
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(true);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QueryFormValues>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      query: "",
    },
  });

  useEffect(() => {
    if (isLoading || !token || !user || !userId) {
      return;
    }

    if (!user.organization_id) {
      router.replace("/join-organization");
      return;
    }

    if (!UUID_REGEX.test(userId)) {
      router.replace("/users");
      return;
    }

    let cancelled = false;

    const resolve = async () => {
      setResolving(true);
      setResolveError(null);

      try {
        const resolved = await resolveOrgUser(token, userId, user);

        if (cancelled) {
          return;
        }

        if (!resolved) {
          router.replace("/users");
          return;
        }

        setTargetUser(resolved);

        try {
          const orgResponse = await listOrganizations(token, { page_size: 100 });
          const org = orgResponse.items.find(
            (item) => item.id === user.organization_id,
          );
          if (!cancelled) {
            setOrganizationName(org?.name ?? user.organization_id);
          }
        } catch {
          if (!cancelled) {
            setOrganizationName(user.organization_id);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setResolveError(getApiErrorMessage(error, "Failed to load user."));
        }
      } finally {
        if (!cancelled) {
          setResolving(false);
        }
      }
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [isLoading, router, token, user, userId]);

  const onSubmit = handleSubmit(async (values) => {
    if (!token || !targetUser) {
      return;
    }

    setErrorMessage(null);
    setResult(null);

    try {
      const response = await askQuery(token, {
        query: values.query,
        user_id: targetUser.id,
      });
      setResult(response);
    } catch (error) {
      const message = getApiErrorMessage(error, "Unable to run query. Please try again.");
      setErrorMessage(message);
      toast.error(message);
    }
  });

  if (isLoading || resolving) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (resolveError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{resolveError}</AlertDescription>
      </Alert>
    );
  }

  if (!user || !targetUser) {
    return null;
  }

  const chatHref = `/chats/new?contextUserId=${targetUser.id}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Query</h1>
          <p className="text-sm text-muted-foreground">
            Ask natural-language questions over imported Claude conversations.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={chatHref}
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            Start chat instead
          </Link>
          <Link
            href="/users"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Change user
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Query context</CardTitle>
          <CardDescription>
            Searching <span className="font-medium text-foreground">{targetUser.name}</span>{" "}
            ({targetUser.email}) in{" "}
            <span className="font-medium text-foreground">
              {organizationName ?? user.organization_id}
            </span>
            .
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {errorMessage ? (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="query">Question</Label>
              <Textarea
                id="query"
                rows={4}
                placeholder="What did we discuss about project planning?"
                {...register("query")}
              />
              {errors.query ? (
                <p className="text-sm text-destructive">{errors.query.message}</p>
              ) : null}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Searching…" : "Ask"}
            </Button>
          </CardContent>
        </form>
      </Card>

      {result ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {result.answer}
              </p>
              {hasNoImportsMessage(result.answer) && targetUser.id === user.id ? (
                <NoImportsCta />
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-lg font-medium">Sources</h2>
            <QuerySources sources={result.sources} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
