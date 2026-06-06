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

export type ChatRateLimitInfo = {
  message: string;
  retryAt: Date;
  retryAfterSeconds: number;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  retryAfterSeconds?: number;
  retryAt?: string;
  validationErrors?: ValidationErrorItem[];

  constructor(
    message: string,
    status: number,
    code?: string,
    validationErrors?: ValidationErrorItem[],
    retryAfterSeconds?: number,
    retryAt?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
    this.retryAt = retryAt;
    this.validationErrors = validationErrors;
  }
}

export function getChatRateLimitInfo(error: unknown): ChatRateLimitInfo | null {
  if (!(error instanceof ApiError)) {
    return null;
  }

  if (error.status !== 429 || error.code !== "rate_limit_error") {
    return null;
  }

  const retryAt = error.retryAt
    ? new Date(error.retryAt)
    : error.retryAfterSeconds != null
      ? new Date(Date.now() + error.retryAfterSeconds * 1000)
      : null;

  if (!retryAt || Number.isNaN(retryAt.getTime())) {
    return null;
  }

  const retryAfterSeconds =
    error.retryAfterSeconds ??
    Math.max(0, Math.ceil((retryAt.getTime() - Date.now()) / 1000));

  return {
    message: error.message,
    retryAt,
    retryAfterSeconds,
  };
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
      body.retry_after_seconds,
      body.retry_at,
    );
  }

  const message =
    typeof body.detail === "string"
      ? body.detail
      : response.statusText || "Request failed";

  return new ApiError(
    message,
    response.status,
    body.code,
    undefined,
    body.retry_after_seconds,
    body.retry_at,
  );
}
