"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { ChatView } from "@/components/chat/chat-view";
import { createThread, sendMessage } from "@/lib/api/chats";
import { titleFromFirstMessage } from "@/lib/chat/thread-title";
import { useOrgUsers } from "@/hooks/use-org-users";
import { useRequireAuth } from "@/contexts/auth-context";

function NewChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, isLoading } = useRequireAuth();
  const { users, getUserName, isLoading: usersLoading } = useOrgUsers(
    token,
    user,
  );

  const contextUserId =
    searchParams.get("contextUserId") ?? user?.id ?? "";

  useEffect(() => {
    if (!isLoading && user && !user.organization_id) {
      router.replace("/join-organization");
    }
  }, [isLoading, router, user]);

  if (isLoading || usersLoading || !user || !token) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!user.organization_id) {
    return null;
  }

  return (
    <ChatView
      key="new"
      user={user}
      token={token}
      contextUserId={contextUserId}
      contextUserName={getUserName(contextUserId)}
      orgMembers={users}
      onThreadCreated={(threadId) => {
        router.replace(`/chats/${threadId}`);
      }}
      onSendMessage={async (content, { threadId, contextUserId: targetUserId, useThreadHistory }) => {
        let activeThreadId = threadId;

        if (!activeThreadId) {
          const thread = await createThread(token, {
            title: titleFromFirstMessage(content),
            context_user_id: targetUserId,
            use_thread_history: useThreadHistory,
          });
          activeThreadId = thread.id;
        }

        const response = await sendMessage(token, activeThreadId, content);
        return {
          userMessage: response.user_message,
          assistantMessage: response.assistant_message,
        };
      }}
    />
  );
}

export default function NewChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <NewChatPageContent />
    </Suspense>
  );
}
