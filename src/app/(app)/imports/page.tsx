"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import { createImport } from "@/lib/api/imports";
import { ImportJobStatusCard } from "@/components/import-job-status";
import { useRequireAuth } from "@/contexts/auth-context";
import { useImportJobPoller } from "@/hooks/use-import-job-poller";
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

const importSchema = z.object({
  accountId: z.string().optional(),
});

type ImportFormValues = z.infer<typeof importSchema>;

export default function ImportsPage() {
  const { user, token, isLoading } = useRequireAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { job, isPolling, error: pollError } = useImportJobPoller(
    token,
    activeJobId,
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ImportFormValues>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      accountId: "default",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token || !user || !selectedFile) {
      toast.error("Choose a Claude export JSON file to upload");
      return;
    }

    setErrorMessage(null);

    try {
      const createdJob = await createImport(token, {
        file: selectedFile,
        userId: user.id,
        accountId: values.accountId?.trim() || "default",
      });

      setActiveJobId(createdJob.id);

      if (createdJob.duplicate) {
        toast.message("Duplicate import detected", {
          description: "This file was already imported.",
        });
      } else {
        toast.success("Import started");
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to start import. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    }
  });

  if (isLoading || !user) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Imports</h1>
        <p className="text-sm text-muted-foreground">
          Upload a Claude chat export JSON file. Processing runs in the
          background and can take a few minutes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Claude export</CardTitle>
          <CardDescription>
            The import is scoped to your account ({user.email}).
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
              <Label htmlFor="file">Export file (.json)</Label>
              <Input
                id="file"
                type="file"
                accept=".json,application/json"
                onChange={(event) => {
                  setSelectedFile(event.target.files?.[0] ?? null);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountId">Account ID (optional)</Label>
              <Input
                id="accountId"
                placeholder="default"
                {...register("accountId")}
              />
            </div>
            <Button type="submit" disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? "Uploading…" : "Start import"}
            </Button>
          </CardContent>
        </form>
      </Card>

      {pollError ? (
        <Alert variant="destructive">
          <AlertDescription>{pollError}</AlertDescription>
        </Alert>
      ) : null}

      {job ? <ImportJobStatusCard job={job} isPolling={isPolling} /> : null}
    </div>
  );
}
