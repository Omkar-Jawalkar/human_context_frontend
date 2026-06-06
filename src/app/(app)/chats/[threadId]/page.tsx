"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ChatView } from "@/components/chat/chat-view";
import { ApiError } from "@/lib/api/client";
import { deleteThread, getThread, sendMessage } from "@/lib/api/chats";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useOrgUsers } from "@/hooks/use-org-users";
import { useRequireAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ChatThread } from "@/lib/types/api";

export default function ChatThreadPage() {
  const router = useRouter();
  const params = useParams<{ threadId: string }>();
  const threadId = params.threadId;
  const { user, token, isLoading } = useRequireAuth();
  const { getUserName, users } = useOrgUsers(token, user);

  const [thread, setThread] = useState<ChatThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user && !user.organization_id) {
      router.replace("/join-organization");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (isLoading || !token || !threadId) {
      return;
    }

    let cancelled = false;

    const loadThread = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const data = await getThread(token, threadId);
        if (!cancelled) {
          setThread(data);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof ApiError && error.status === 404) {
            toast.error("Thread not found");
            router.replace("/chats");
            return;
          }
          setLoadError(getApiErrorMessage(error, "Failed to load chat."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadThread();

    return () => {
      cancelled = true;
    };
  }, [isLoading, router, threadId, token]);

  const handleSendMessage = useCallback(
    async (
      content: string,
      options: {
        threadId?: string;
        contextUserId: string;
        useThreadHistory: boolean;
      },
    ) => {
      if (!token || !threadId) {
        throw new Error("Missing thread");
      }

      void options;
      const response = await sendMessage(token, threadId, content);
      return {
        userMessage: response.user_message,
        assistantMessage: response.assistant_message,
      };
    },
    [token, threadId],
  );

  const handleDelete = useCallback(async () => {
    if (!token || !threadId) {
      return;
    }

    await deleteThread(token, threadId);
    toast.success("Chat deleted");
    router.push("/chats");
  }, [router, threadId, token]);

  if (isLoading || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!thread || !user || !token) {
    return null;
  }

  return (
    <ChatView
      key={thread.id}
      user={user}
      token={token}
      threadId={thread.id}
      threadTitle={thread.title}
      contextUserId={thread.context_user_id}
      contextUserName={getUserName(thread.context_user_id)}
      orgMembers={users}
      initialMessages={thread.messages}
      useThreadHistory={thread.use_thread_history}
      onSendMessage={handleSendMessage}
      onDeleteThread={handleDelete}
    />
  );
}
