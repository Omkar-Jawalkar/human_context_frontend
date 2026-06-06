import Link from "next/link";
import { History, MessageSquare } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChatThread } from "@/lib/types/api";

type ThreadListProps = {
  threads: ChatThread[];
  getUserName: (id: string) => string;
};

function formatRelativeDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ThreadListEmpty() {
  return (
    <Card className="ring-1 ring-foreground/10">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MessageSquare className="size-5" aria-hidden />
        </div>
        <h2 className="mt-4 text-base font-semibold tracking-tight">
          No chats yet
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Start a chat to ask ongoing questions against imported conversation
          history.
        </p>
        <Link
          href="/chats/new"
          className={cn(buttonVariants({ size: "sm" }), "mt-6")}
        >
          New chat
        </Link>
      </CardContent>
    </Card>
  );
}

export function ThreadList({ threads, getUserName }: ThreadListProps) {
  if (threads.length === 0) {
    return <ThreadListEmpty />;
  }

  return (
    <ul className="space-y-3">
      {threads.map((thread) => (
        <li key={thread.id}>
          <Link href={`/chats/${thread.id}`}>
            <Card className="transition-colors hover:bg-muted/20 ring-1 ring-foreground/10">
              <CardHeader className="gap-2 pb-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{thread.title}</CardTitle>
                  {thread.use_thread_history ? (
                    <History
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-label="Thread history enabled"
                    />
                  ) : null}
                </div>
                <CardDescription>
                  Context: {getUserName(thread.context_user_id)} · Updated{" "}
                  {formatRelativeDate(thread.updated_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {thread.messages.length > 0
                    ? `${thread.messages.length} message${thread.messages.length === 1 ? "" : "s"}`
                    : "No messages yet"}
                </p>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ThreadListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-lg bg-muted ring-1 ring-foreground/10"
        />
      ))}
    </div>
  );
}
