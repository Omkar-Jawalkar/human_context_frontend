import { apiFetch } from "@/lib/api/client";
import type { ImportJobResponse } from "@/lib/types/api";

export type CreateImportInput = {
  file: File;
  userId: string;
};

export function createImport(
  token: string,
  input: CreateImportInput,
): Promise<ImportJobResponse> {
  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("user_id", input.userId);

  return apiFetch<ImportJobResponse>("/imports", {
    method: "POST",
    token,
    body: formData,
  });
}

export function getImportJob(
  token: string,
  importJobId: string,
): Promise<ImportJobResponse> {
  return apiFetch<ImportJobResponse>(`/imports/${importJobId}`, { token });
}
