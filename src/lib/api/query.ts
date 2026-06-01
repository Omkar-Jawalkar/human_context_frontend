import { apiFetch } from "@/lib/api/client";
import type { QueryRequest, QueryResponse } from "@/lib/types/api";

export function askQuery(
  token: string,
  input: QueryRequest,
): Promise<QueryResponse> {
  return apiFetch<QueryResponse>("/query", {
    method: "POST",
    token,
    body: input,
  });
}
