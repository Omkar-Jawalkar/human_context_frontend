import type { ApiErrorBody, ValidationErrorItem } from "@/lib/types/api";

export const ORG_ACCESS_ERROR_MESSAGE =
  "You can only use context from your org";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      return ORG_ACCESS_ERROR_MESSAGE;
    }
    return error.message;
  }
  return fallback;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  validationErrors?: ValidationErrorItem[];

  constructor(
    message: string,
    status: number,
    code?: string,
    validationErrors?: ValidationErrorItem[],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.validationErrors = validationErrors;
  }
}

function formatValidationErrors(detail: ApiErrorBody["detail"]): string {
  if (!Array.isArray(detail)) {
    return "Validation failed";
  }

  return detail
    .map((item) => {
      const field = item.loc?.slice(-1)[0];
      return field ? `${String(field)}: ${item.msg}` : item.msg;
    })
    .join("; ");
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody = {};

  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    return new ApiError(response.statusText || "Request failed", response.status);
  }

  if (Array.isArray(body.detail)) {
    const validationErrors = body.detail;
    return new ApiError(
      formatValidationErrors(body.detail),
      response.status,
      body.code,
      validationErrors,
    );
  }

  const message =
    typeof body.detail === "string"
      ? body.detail
      : response.statusText || "Request failed";

  return new ApiError(message, response.status, body.code);
}
