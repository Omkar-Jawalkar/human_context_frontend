const DEFAULT_SITE_URL = "http://localhost:3000";

export const siteConfig = {
  name: "Human Context",
  shortDescription:
    "Semantic search over imported AI chat conversations for teams.",
  description:
    "Human Context imports your organization's AI chat history and turns it into a searchable knowledge base. Ask questions in natural language and retrieve the right moments from Claude, ChatGPT, and other assistants.",
  tagline: "Semantic search over imported AI chat conversations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL,
  githubUrl: "https://github.com/Omkar-Jawalkar/human_context_frontend",
  author: {
    name: "Omkar Jawalkar",
    url: "https://github.com/Omkar-Jawalkar",
  },
  keywords: [
    "AI chat history",
    "semantic search",
    "Claude export",
    "team knowledge base",
    "RAG",
    "conversation search",
    "AI workspace",
    "chat retrieval",
  ],
} as const;

export function getSiteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path) {
    return base;
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
