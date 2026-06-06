"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ChatRateLimitNoticeProps = {
  message: string;
  retryAt: number;
};

function formatRemainingDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) {
    return "now";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  return `${totalSeconds} second${totalSeconds === 1 ? "" : "s"}`;
}

function formatRetryTime(retryAt: number): string {
  return new Date(retryAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ChatRateLimitNotice({
  message,
  retryAt,
}: ChatRateLimitNoticeProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)),
  );

  useEffect(() => {
    const tick = () => {
      setRemainingSeconds(
        Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)),
      );
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [retryAt]);

  return (
    <Alert className="mb-3">
      <Clock aria-hidden />
      <AlertTitle>Message limit reached</AlertTitle>
      <AlertDescription>
        {message} Chat will be available again in{" "}
        <span className="font-medium text-foreground">
          {formatRemainingDuration(remainingSeconds)}
        </span>{" "}
        ({formatRetryTime(retryAt)}).
      </AlertDescription>
    </Alert>
  );
}
