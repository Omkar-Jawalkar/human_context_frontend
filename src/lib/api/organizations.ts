import { apiFetch } from "@/lib/api/client";
import type {
  OrganizationCreateInput,
  OrganizationListResponse,
  OrganizationResponse,
  OrganizationUpdateInput,
} from "@/lib/types/api";

export function listOrganizations(
  token: string,
): Promise<OrganizationListResponse> {
  return apiFetch<OrganizationListResponse>("/organizations", { token });
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
