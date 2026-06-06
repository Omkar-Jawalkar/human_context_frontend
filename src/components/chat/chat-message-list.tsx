"use client";

import { useCallback } from "react";

import { MessageSources } from "@/components/chat/message-sources";
import { NoImportsCta } from "@/components/chat/no-imports-cta";
import { useTypewriterText } from "@/hooks/use-typewriter-text";
import { hasNoImportsMessage } from "@/lib/context/no-imports";
import { clearStreamingMessageId } from "@/lib/chat/streaming-message-ids";
import type { ChatMessage } from "@/lib/types/api";

type ChatMessageListProps = {
  messages: ChatMessage[];
  streamingMessageIds: Set<string>;
  isThinking?: boolean;
  showImportsCta?: boolean;
};

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2 text-sm text-muted-foreground">
      <span className="inline-flex gap-1">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
      </span>
    </div>
  );
}

function AssistantMessage({
  message,
  stream,
  showImportsCta,
}: {
  message: ChatMessage;
  stream: boolean;
  showImportsCta: boolean;
}) {
  const showNoImportsCta =
    showImportsCta && hasNoImportsMessage(message.content);

  const handleComplete = useCallback(() => {
    clearStreamingMessageId(message.id);
  }, [message.id]);

  const { displayed, isComplete } = useTypewriterText(message.content, {
    enabled: stream,
    onComplete: handleComplete,
  });

  const text = stream && !isComplete ? displayed : message.content;

  return (
    <article className="py-6">
      <div className="max-w-none">
        <p className="whitespace-pre-wrap text-[0.9375rem] leading-7 text-foreground">
          {text}
          {stream && !isComplete ? (
            <span
              className="ml-0.5 inline-block h-[1.1em] w-0.5 animate-pulse bg-foreground/70 align-text-bottom"
              aria-hidden
            />
          ) : null}
        </p>
      </div>
      {isComplete ? (
        <>
          <MessageSources sources={message.sources} />
          {showNoImportsCta ? (
            <div className="mt-4">
              <NoImportsCta />
            </div>
          ) : null}
        </>
      ) : null}
    </article>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end py-4">
      <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {message.content}
        </p>
      </div>
    </div>
  );
}

export function ChatMessageList({
  messages,
  streamingMessageIds,
  isThinking = false,
  showImportsCta = false,
}: ChatMessageListProps) {
  const sorted = [...messages].sort((a, b) => a.sequence - b.sequence);

  if (sorted.length === 0 && !isThinking) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-1">
      {sorted.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AssistantMessage
            key={message.id}
            message={message}
            stream={streamingMessageIds.has(message.id)}
            showImportsCta={showImportsCta}
          />
        ),
      )}
      {isThinking ? <ThinkingIndicator /> : null}
    </div>
  );
}
