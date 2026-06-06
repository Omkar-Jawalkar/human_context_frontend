const DEFAULT_MAX_WORDS = 8;
const DEFAULT_MAX_CHARS = 60;

export function titleFromFirstMessage(
  content: string,
  maxWords = DEFAULT_MAX_WORDS,
  maxChars = DEFAULT_MAX_CHARS,
): string {
  const trimmed = content.trim();
  if (!trimmed) {
    return "New chat";
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  let title = words.slice(0, maxWords).join(" ");

  if (words.length > maxWords) {
    title = `${title}…`;
  }

  if (title.length > maxChars) {
    title = `${title.slice(0, maxChars).trimEnd()}…`;
  }

  return title;
}
