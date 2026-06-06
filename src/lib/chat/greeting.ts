export function getTimeOfDayGreeting(date = new Date()): string {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

function getPossessiveName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return "their";
  }
  const endsWithS = /s$/i.test(trimmed);
  return endsWithS ? `${trimmed}'` : `${trimmed}'s`;
}

/** Human-friendly label for whose imported context powers the chat. */
export function formatBrainChatLabel(
  contextUserName: string,
  isSelf: boolean,
): string {
  if (isSelf) {
    return "Chat with your brain";
  }
  return `Chat with ${getPossessiveName(getFirstName(contextUserName))} brain`;
}
