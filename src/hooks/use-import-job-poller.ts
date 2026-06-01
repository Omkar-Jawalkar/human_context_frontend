"use client";

import { useEffect, useState } from "react";

import { getImportJob } from "@/lib/api/imports";
import type { ImportJobResponse, ImportJobStatus } from "@/lib/types/api";

const TERMINAL_STATUSES: ImportJobStatus[] = ["completed", "failed"];
const POLL_INTERVAL_MS = 2000;

export function useImportJobPoller(
  token: string | null,
  importJobId: string | null,
) {
  const [job, setJob] = useState<ImportJobResponse | null>(null);
  const [trackedJobId, setTrackedJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isActive = Boolean(token && importJobId);

  useEffect(() => {
    if (!token || !importJobId) {
      return;
    }

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchJob = async () => {
      try {
        const nextJob = await getImportJob(token, importJobId);

        if (cancelled) {
          return;
        }

        setTrackedJobId(importJobId);
        setJob(nextJob);
        setError(null);

        if (TERMINAL_STATUSES.includes(nextJob.status) && intervalId) {
          clearInterval(intervalId);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error ? err.message : "Failed to fetch import job",
        );

        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };

    void fetchJob();
    intervalId = setInterval(() => {
      void fetchJob();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, importJobId]);

  const isCurrentJob = isActive && trackedJobId === importJobId;
  const isTerminal =
    isCurrentJob && job !== null && TERMINAL_STATUSES.includes(job.status);

  return {
    job: isCurrentJob ? job : null,
    isPolling: isActive && !isTerminal && !error,
    error: isCurrentJob ? error : null,
  };
}
