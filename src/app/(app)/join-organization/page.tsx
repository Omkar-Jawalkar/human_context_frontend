"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import { joinOrganization } from "@/lib/api/users";
import { useRequireAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const joinSchema = z.object({
  organizationId: z.string().uuid("Enter a valid organization UUID"),
});

type JoinFormValues = z.infer<typeof joinSchema>;

function JoinOrganizationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, refreshUser, isLoading } = useRequireAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      organizationId: searchParams.get("org") ?? "",
    },
  });

  useEffect(() => {
    const orgFromQuery = searchParams.get("org");

    if (orgFromQuery) {
      setValue("organizationId", orgFromQuery);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    if (!isLoading && user?.organization_id) {
      router.replace("/query");
    }
  }, [isLoading, router, user?.organization_id]);

  const onSubmit = handleSubmit(async (values) => {
    if (!token) {
      return;
    }

    setErrorMessage(null);

    try {
      await joinOrganization(token, values.organizationId);
      await refreshUser();
      toast.success("Joined organization successfully");
      router.push("/imports");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to join organization. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    }
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (user?.super_admin) {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Admin account</CardTitle>
          <CardDescription>
            Super admin accounts cannot join an organization from this screen.
            Use the backend admin tools to manage organizations and users.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Join your organization</CardTitle>
        <CardDescription>
          Ask your platform admin for an organization UUID, then enter it below
          to unlock imports and query features.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="organizationId">Organization ID</Label>
            <Input
              id="organizationId"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              {...register("organizationId")}
            />
            {errors.organizationId ? (
              <p className="text-sm text-destructive">
                {errors.organizationId.message}
              </p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="border-t-0 bg-transparent p-4 pt-0">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Joining…" : "Join organization"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function JoinOrganizationPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <JoinOrganizationForm />
    </Suspense>
  );
}
