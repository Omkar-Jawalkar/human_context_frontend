"use client";

import { History, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatMessageList } from "@/components/chat/chat-message-list";
import { ChatPromptInput } from "@/components/chat/chat-prompt-input";
import { ChatRateLimitNotice } from "@/components/chat/chat-rate-limit-notice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateThread } from "@/lib/api/chats";
import { getApiErrorMessage, getChatRateLimitInfo } from "@/lib/api/errors";
import { getFirstName, getTimeOfDayGreeting, formatBrainChatLabel } from "@/lib/chat/greeting";
import { getStreamingMessageIds, markMessageForStreaming } from "@/lib/chat/streaming-message-ids";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatMessage, UserResponse } from "@/lib/types/api";
import { toast } from "sonner";

const EMPTY_MESSAGES: ChatMessage[] = [];

type ChatViewProps = {
  user: UserResponse;
  token: string;
  contextUserId: string;
  contextUserName: string;
  orgMembers: UserResponse[];
  threadId?: string;
  threadTitle?: string;
  initialMessages?: ChatMessage[];
  useThreadHistory?: boolean;
  onThreadCreated?: (threadId: string) => void;
  onSendMessage: (
    content: string,
    options: {
      threadId?: string;
      contextUserId: string;
      useThreadHistory: boolean;
    },
  ) => Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>;
  onDeleteThread?: () => Promise<void>;
};

export function ChatView({
  user,
  token,
  contextUserId,
  contextUserName,
  orgMembers,
  threadId,
  threadTitle,
  initialMessages,
  useThreadHistory: initialUseThreadHistory = true,
  onThreadCreated,
  onSendMessage,
  onDeleteThread,
}: ChatViewProps) {
  const seedMessages = initialMessages ?? EMPTY_MESSAGES;
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState(threadId);
  const [selectedContextUserId, setSelectedContextUserId] =
    useState(contextUserId);
  const [useThreadHistory, setUseThreadHistory] = useState(
    initialUseThreadHistory,
  );
  const [streamingMessageIds, setStreamingMessageIds] = useState<Set<string>>(
    () => getStreamingMessageIds(),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [rateLimit, setRateLimit] = useState<{
    message: string;
    retryAt: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const firstName = getFirstName(user.name);
  const greeting = getTimeOfDayGreeting();
  const selectedContextName =
    orgMembers.find((member) => member.id === selectedContextUserId)?.name ??
    contextUserName;
  const hasMessages = messages.length > 0 || isSending;
  const isNewChat = !activeThreadId;
  const effectiveContextUserId = activeThreadId
    ? contextUserId
    : selectedContextUserId;
  const showImportsCta = effectiveContextUserId === user.id;
  const displayContextName = activeThreadId ? contextUserName : selectedContextName;
  const isOwnBrain = effectiveContextUserId === user.id;
  const brainChatLabel = formatBrainChatLabel(displayContextName, isOwnBrain);
  const isChatDisabled = Boolean(rateLimit);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  useEffect(() => {
    if (!rateLimit) {
      return;
    }

    const remainingMs = rateLimit.retryAt - Date.now();
    if (remainingMs <= 0) {
      setRateLimit(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRateLimit(null);
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [rateLimit]);

  const handleToggleHistory = async () => {
    if (!activeThreadId) {
      setUseThreadHistory((current) => !current);
      return;
    }

    const next = !useThreadHistory;
    setUseThreadHistory(next);

    try {
      await updateThread(token, activeThreadId, {
        use_thread_history: next,
      });
    } catch (error) {
      setUseThreadHistory(!next);
      toast.error(getApiErrorMessage(error, "Failed to update settings."));
    }
  };

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isSending || rateLimit) {
      return;
    }

    setIsSending(true);
    setDraft("");

    const optimisticUser: ChatMessage = {
      id: `pending-${Date.now()}`,
      thread_id: activeThreadId ?? "pending",
      role: "user",
      content: trimmed,
      sequence: messages.length + 1,
      sources: null,
      created_at: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticUser]);

    try {
      const { userMessage, assistantMessage } = await onSendMessage(trimmed, {
        threadId: activeThreadId,
        contextUserId: selectedContextUserId,
        useThreadHistory,
      });

      markMessageForStreaming(assistantMessage.id);
      setStreamingMessageIds(
        (current) => new Set([...current, assistantMessage.id]),
      );

      setMessages((current) =>
        current
          .filter((message) => message.id !== optimisticUser.id)
          .concat(userMessage, assistantMessage),
      );

      if (!activeThreadId && userMessage.thread_id) {
        setActiveThreadId(userMessage.thread_id);
        onThreadCreated?.(userMessage.thread_id);
      }
    } catch (error) {
      setMessages((current) =>
        current.filter((message) => message.id !== optimisticUser.id),
      );
      setDraft(trimmed);

      const rateLimitInfo = getChatRateLimitInfo(error);
      if (rateLimitInfo) {
        setRateLimit({
          message: rateLimitInfo.message,
          retryAt: rateLimitInfo.retryAt.getTime(),
        });
      } else {
        toast.error(getApiErrorMessage(error, "Failed to send message."));
      }
    } finally {
      setIsSending(false);
    }
  };

  const contextFooter = isNewChat ? (
    <label className="flex items-center gap-1.5">
      <span className="shrink-0">Context:</span>
      <select
        value={selectedContextUserId}
        onChange={(event) => setSelectedContextUserId(event.target.value)}
        className="max-w-[12rem] truncate rounded-md border-0 bg-transparent py-0 pl-0 text-xs text-foreground outline-none"
        disabled={isSending || isChatDisabled}
      >
        {orgMembers.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
            {member.id === user.id ? " (you)" : ""}
          </option>
        ))}
      </select>
    </label>
  ) : (
    <span className="truncate">{brainChatLabel}</span>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
        <div className="size-8 shrink-0" aria-hidden />

        <p className="min-w-0 flex-1 truncate text-center text-sm font-medium">
          {hasMessages && threadTitle
            ? threadTitle
            : isNewChat
              ? brainChatLabel
              : (threadTitle ?? brainChatLabel)}
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "text-muted-foreground",
              useThreadHistory && "text-foreground",
            )}
            onClick={() => void handleToggleHistory()}
            aria-label="Toggle conversation memory"
            title={
              useThreadHistory
                ? "Memory on — includes previous messages"
                : "Memory off"
            }
          >
            <History className="size-4" aria-hidden />
          </Button>
          {onDeleteThread ? (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground"
                    disabled={isDeleting}
                  />
                }
              >
                <Trash2 className="size-4" aria-hidden />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes the thread and all messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setIsDeleting(true);
                      void onDeleteThread().finally(() => setIsDeleting(false));
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div className="size-8" aria-hidden />
          )}
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex h-full flex-col items-center justify-center px-4 pb-8">
            <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {greeting}, {firstName}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{brainChatLabel}</p>
            <div className="mt-10 w-full max-w-2xl">
              {rateLimit ? (
                <ChatRateLimitNotice
                  message={rateLimit.message}
                  retryAt={rateLimit.retryAt}
                />
              ) : null}
              <ChatPromptInput
                value={draft}
                onChange={setDraft}
                onSubmit={() => void handleSend()}
                disabled={isChatDisabled}
                isSending={isSending}
                footer={contextFooter}
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-4 py-6">
            <ChatMessageList
              messages={messages}
              streamingMessageIds={streamingMessageIds}
              isThinking={isSending}
              showImportsCta={showImportsCta}
            />
          </div>
        )}
      </div>

      {hasMessages ? (
        <div className="shrink-0 border-t border-border/60 bg-background px-4 py-4">
          <div className="mx-auto w-full max-w-3xl">
            {rateLimit ? (
              <ChatRateLimitNotice
                message={rateLimit.message}
                retryAt={rateLimit.retryAt}
              />
            ) : null}
            <ChatPromptInput
              value={draft}
              onChange={setDraft}
              onSubmit={() => void handleSend()}
              placeholder="Reply…"
              disabled={isChatDisabled}
              isSending={isSending}
              footer={contextFooter}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
