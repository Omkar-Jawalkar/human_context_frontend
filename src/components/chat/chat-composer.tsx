"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ChatComposerProps = {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
};

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSending || disabled) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(trimmed);
      setContent("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="chat-message">Message</Label>
        <Textarea
          id="chat-message"
          rows={3}
          placeholder="Ask a question about imported conversations…"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={disabled || isSending}
        />
      </div>
      <Button type="submit" disabled={disabled || isSending || !content.trim()}>
        {isSending ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
