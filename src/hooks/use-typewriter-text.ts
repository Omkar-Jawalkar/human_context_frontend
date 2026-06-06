"use client";

import { useEffect, useState } from "react";

type UseTypewriterTextOptions = {
  enabled: boolean;
  charsPerTick?: number;
  intervalMs?: number;
  onComplete?: () => void;
};

export function useTypewriterText(
  text: string,
  {
    enabled,
    charsPerTick = 3,
    intervalMs = 12,
    onComplete,
  }: UseTypewriterTextOptions,
) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  const [isComplete, setIsComplete] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setIsComplete(true);
      return;
    }

    setDisplayed("");
    setIsComplete(false);

    let index = 0;
    const timer = window.setInterval(() => {
      index += charsPerTick;
      if (index >= text.length) {
        setDisplayed(text);
        setIsComplete(true);
        window.clearInterval(timer);
        onComplete?.();
      } else {
        setDisplayed(text.slice(0, index));
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [text, enabled, charsPerTick, intervalMs, onComplete]);

  return { displayed, isComplete };
}
