"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import { updateThread } from "@/lib/api/chats";
import { Label } from "@/components/ui/label";

type ThreadSettingsProps = {
  threadId: string;
  token: string;
  useThreadHistory: boolean;
  onUpdate: (useThreadHistory: boolean) => void;
};

export function ThreadSettings({
  threadId,
  token,
  useThreadHistory,
  onUpdate,
}: ThreadSettingsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    onUpdate(checked);

    try {
      await updateThread(token, threadId, { use_thread_history: checked });
    } catch (error) {
      onUpdate(useThreadHistory);
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update thread settings.";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <input
        type="checkbox"
        id="use-thread-history"
        className="mt-1 size-4 rounded border-border"
        checked={useThreadHistory}
        disabled={isUpdating}
        onChange={(event) => void handleToggle(event.target.checked)}
      />
      <div className="space-y-1">
        <Label htmlFor="use-thread-history" className="cursor-pointer">
          Include previous messages in replies
        </Label>
        <p className="text-xs text-muted-foreground">
          When enabled, the last 5 messages in this thread are included in each
          reply.
        </p>
      </div>
    </div>
  );
}
