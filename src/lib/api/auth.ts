import { apiFetch } from "@/lib/api/client";
import type { AuthTokenResponse } from "@/lib/types/api";

export type RegisterInput = {
  email: string;
  name: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export function register(input: RegisterInput): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>("/auth/register", {
    method: "POST",
    body: input,
    skipAuth: true,
  });
}

export function login(input: LoginInput): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>("/auth/login", {
    method: "POST",
    body: input,
    skipAuth: true,
  });
}

export function exchangeOAuthToken(
  provider: "google" | "github",
  code: string,
  redirectUri: string,
): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>(`/auth/${provider}/token`, {
    method: "POST",
    body: { code, redirect_uri: redirectUri },
    skipAuth: true,
  });
}
