import { apiFetch, buildQueryString } from "@/lib/api/client";
import type {
  UserListFilters,
  UserListResponse,
  UserResponse,
} from "@/lib/types/api";

export function getMe(token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>("/users/me", { token });
}

export function listUsers(
  token: string,
  filters: UserListFilters = {},
): Promise<UserListResponse> {
  const query = buildQueryString(filters);
  return apiFetch<UserListResponse>(`/users${query}`, { token });
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
