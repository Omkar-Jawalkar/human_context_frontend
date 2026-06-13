export const OAUTH_STATE_KEY = "oauth_state";

export type OAuthProvider = "google" | "github";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize";

function randomState(): string {
  return crypto.randomUUID();
}

export function getOAuthRedirectUri(provider: OAuthProvider): string {
  return `${window.location.origin}/auth/callback/${provider}`;
}

export function validateAndClearOAuthState(
  receivedState: string | null,
): boolean {
  const storedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);

  if (!receivedState || !storedState || receivedState !== storedState) {
    return false;
  }

  return true;
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
}

export function isGithubOAuthConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID);
}

export function startGoogleLogin(): void {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("Google OAuth is not configured");
  }

  const state = randomState();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getOAuthRedirectUri("google"),
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });

  window.location.href = `${GOOGLE_AUTH_URL}?${params}`;
}

export function startGithubLogin(): void {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

  if (!clientId) {
    throw new Error("GitHub OAuth is not configured");
  }

  const state = randomState();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getOAuthRedirectUri("github"),
    scope: "read:user user:email",
    state,
  });

  window.location.href = `${GITHUB_AUTH_URL}?${params}`;
}
