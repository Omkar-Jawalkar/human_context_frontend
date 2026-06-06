"use client";

import { ArrowUp } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatPromptInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
  className?: string;
  footer?: React.ReactNode;
};

export function ChatPromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = "How can I help you today?",
  disabled = false,
  isSending = false,
  className,
  footer,
}: ChatPromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled && !isSending && value.trim()) {
        onSubmit();
      }
    }
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5 transition-shadow focus-within:ring-ring/30">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled || isSending}
          className="max-h-[200px] min-h-[3.25rem] w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-60"
        />
        <div className="flex items-center justify-between gap-2 px-3 pb-3">
          <div className="min-w-0 flex-1 text-xs text-muted-foreground">
            {footer}
          </div>
          <Button
            type="button"
            size="icon-sm"
            className="size-8 shrink-0 rounded-lg"
            disabled={disabled || isSending || !value.trim()}
            onClick={onSubmit}
            aria-label="Send message"
          >
            <ArrowUp className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
