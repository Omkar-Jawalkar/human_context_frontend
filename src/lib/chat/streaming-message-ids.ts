const STREAM_KEY = "hc-stream-message-ids";

function readIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(STREAM_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(STREAM_KEY, JSON.stringify(ids));
}

export function getStreamingMessageIds(): Set<string> {
  return new Set(readIds());
}

export function markMessageForStreaming(id: string): void {
  const ids = readIds();
  if (!ids.includes(id)) {
    writeIds([...ids, id]);
  }
}

export function clearStreamingMessageId(id: string): void {
  writeIds(readIds().filter((item) => item !== id));
}

export function shouldStreamMessage(id: string): boolean {
  return getStreamingMessageIds().has(id);
}
