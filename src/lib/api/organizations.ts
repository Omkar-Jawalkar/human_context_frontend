import { apiFetch, buildQueryString } from "@/lib/api/client";
import type {
  OrganizationCreateInput,
  OrganizationListFilters,
  OrganizationListResponse,
  OrganizationResponse,
  OrganizationUpdateInput,
} from "@/lib/types/api";

export function listOrganizations(
  token: string,
  filters: OrganizationListFilters = {},
): Promise<OrganizationListResponse> {
  const query = buildQueryString(filters);
  return apiFetch<OrganizationListResponse>(`/organizations${query}`, { token });
}

export function createOrganization(
  token: string,
  input: OrganizationCreateInput,
): Promise<OrganizationResponse> {
  return apiFetch<OrganizationResponse>("/organizations", {
    method: "POST",
    token,
    body: { name: input.name, meta: input.meta ?? {} },
  });
}

export function updateOrganization(
  token: string,
  organizationId: string,
  input: OrganizationUpdateInput,
): Promise<OrganizationResponse> {
  return apiFetch<OrganizationResponse>(`/organizations/${organizationId}`, {
    method: "PATCH",
    token,
    body: input,
  });
}

export function deleteOrganization(
  token: string,
  organizationId: string,
): Promise<void> {
  return apiFetch<void>(`/organizations/${organizationId}`, {
    method: "DELETE",
    token,
  });
}
