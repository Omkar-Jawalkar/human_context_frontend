import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ImportJobResponse } from "@/lib/types/api";

const statusVariant: Record<
  ImportJobResponse["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  processing: "default",
  completed: "outline",
  failed: "destructive",
};

function getProgressValue(status: ImportJobResponse["status"]): number {
  switch (status) {
    case "pending":
      return 15;
    case "processing":
      return 60;
    case "completed":
      return 100;
    case "failed":
      return 100;
    default:
      return 0;
  }
}

type ImportJobStatusProps = {
  job: ImportJobResponse;
  isPolling?: boolean;
};

export function ImportJobStatusCard({ job, isPolling }: ImportJobStatusProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="truncate">{job.file_name}</CardTitle>
          <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={getProgressValue(job.status)} />
        {isPolling ? (
          <p className="text-sm text-muted-foreground">Checking import status…</p>
        ) : null}
        {job.duplicate ? (
          <p className="text-sm text-muted-foreground">
            This file was already imported (duplicate detected).
          </p>
        ) : null}
        {job.error_message ? (
          <p className="text-sm text-destructive">{job.error_message}</p>
        ) : null}
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Conversations</dt>
            <dd className="font-medium">{job.stats.conversations_count}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Messages created</dt>
            <dd className="font-medium">{job.stats.messages_created}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Messages updated</dt>
            <dd className="font-medium">{job.stats.messages_updated}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Embeddings created</dt>
            <dd className="font-medium">{job.stats.embeddings_created}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Embeddings skipped</dt>
            <dd className="font-medium">{job.stats.embeddings_skipped}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Conversations skipped</dt>
            <dd className="font-medium">{job.stats.conversations_skipped}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
