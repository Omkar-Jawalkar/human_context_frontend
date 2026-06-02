import { ApiError, parseApiError } from "@/lib/api/errors";

const API_PREFIX = "/api/v1";

export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return baseUrl.replace(/\/$/, "");
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  token?: string | null;
  body?: BodyInit | Record<string, unknown> | null;
  skipAuth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, body, skipAuth, headers, ...rest } = options;
  const url = `${getApiBaseUrl()}${API_PREFIX}${path}`;

  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData || typeof body === "string") {
    requestBody = body;
  } else if (body != null) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    body: requestBody,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    const error = await parseApiError(response);

    if (error.status === 401 && !skipAuth) {
      throw error;
    }

    throw error;
  }

  return (await response.json()) as T;
}

export { ApiError };
