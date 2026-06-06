export const NO_IMPORTS_MESSAGE_FRAGMENT =
  "has not imported any Claude conversations";

export function hasNoImportsMessage(content: string): boolean {
  return content.includes(NO_IMPORTS_MESSAGE_FRAGMENT);
}
