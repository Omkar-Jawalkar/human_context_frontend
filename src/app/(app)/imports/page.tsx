"use client";

import { useState } from "react";
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

export default function ImportsPage() {
  const { user, token, isLoading } = useRequireAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { job, isPolling, error: pollError } = useImportJobPoller(
    token,
    activeJobId,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !user || !selectedFile) {
      toast.error("Choose a Claude export JSON file to upload");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const createdJob = await createImport(token, {
        file: selectedFile,
        userId: user.id,
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
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !user) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Imports</h1>
        <p className="text-sm text-muted-foreground">
          Upload a Claude export JSON file. Processing runs in the background.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Claude export</CardTitle>
          <CardDescription>
            Imports are tied to your account ({user.email}).
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
