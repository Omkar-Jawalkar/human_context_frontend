import { apiFetch } from "@/lib/api/client";
import type {
  ChatThread,
  ChatThreadListResponse,
  CreateChatInput,
  SendMessageResponse,
  UpdateChatInput,
} from "@/lib/types/api";

export function createThread(
  token: string,
  input: CreateChatInput,
): Promise<ChatThread> {
  return apiFetch<ChatThread>("/chats", {
    method: "POST",
    token,
    body: input,
  });
}

export function listThreads(token: string): Promise<ChatThreadListResponse> {
  return apiFetch<ChatThreadListResponse>("/chats", { token });
}

export function getThread(token: string, threadId: string): Promise<ChatThread> {
  return apiFetch<ChatThread>(`/chats/${threadId}`, { token });
}

export function updateThread(
  token: string,
  threadId: string,
  input: UpdateChatInput,
): Promise<ChatThread> {
  return apiFetch<ChatThread>(`/chats/${threadId}`, {
    method: "PATCH",
    token,
    body: input,
  });
}

export function deleteThread(token: string, threadId: string): Promise<void> {
  return apiFetch<void>(`/chats/${threadId}`, {
    method: "DELETE",
    token,
  });
}

export function sendMessage(
  token: string,
  threadId: string,
  content: string,
): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>(`/chats/${threadId}/messages`, {
    method: "POST",
    token,
    body: { content },
  });
}
