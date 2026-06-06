"use client";

import { ChatShell } from "@/components/chat/chat-shell";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatShell>{children}</ChatShell>;
}
