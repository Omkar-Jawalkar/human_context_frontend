"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { exchangeOAuthToken } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  getOAuthRedirectUri,
  type OAuthProvider,
  validateAndClearOAuthState,
} from "@/lib/auth/oauth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type CallbackState =
  | { status: "loading" }
  | { status: "error"; message: string };

function getOAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 503) {
      return "OAuth is not configured on the server. Please try again later or use email sign-in.";
    }

    return error.message;
  }

  return "Unable to complete sign-in. Please try again.";
}

export function OAuthCallbackClient({ provider }: { provider: OAuthProvider }) {
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const [state, setState] = useState<CallbackState>({ status: "loading" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    void (async () => {
      const code = searchParams.get("code");
      const receivedState = searchParams.get("state");

      if (!code) {
        setState({
          status: "error",
          message: "Missing authorization code. Please try signing in again.",
        });
        return;
      }

      if (!validateAndClearOAuthState(receivedState)) {
        setState({
          status: "error",
          message: "Invalid or expired sign-in session. Please try again.",
        });
        return;
      }

      try {
        const redirectUri = getOAuthRedirectUri(provider);
        const response = await exchangeOAuthToken(provider, code, redirectUri);
        await loginWithToken(response.access_token);
      } catch (error) {
        setState({
          status: "error",
          message: getOAuthErrorMessage(error),
        });
      }
    })();
  }, [loginWithToken, provider, searchParams]);

  if (state.status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md space-y-4">
          <Alert variant="destructive" role="alert">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
          <Button className="h-10 w-full" render={<Link href="/login" />}>
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}
