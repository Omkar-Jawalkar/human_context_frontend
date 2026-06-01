import { apiFetch } from "@/lib/api/client";
import type { UserResponse } from "@/lib/types/api";

export function getMe(token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users/me", { token });
}

export function joinOrganization(
  token: string,
  organizationId: string,
): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users/me/organization", {
    method: "POST",
    token,
    body: { organization_id: organizationId },
  });
}
