import { apiFetch, buildQueryString } from "@/lib/api/client";
import type { QueryRequest, QueryResponse } from "@/lib/types/api";

export function askQuery(
  token: string,
  input: QueryRequest,
): Promise<QueryResponse> {
  const query = buildQueryString({ isDevelopment: true });
  return apiFetch<QueryResponse>(`/query${query}`, {
    method: "POST",
    token,
    body: input,
  });
}
