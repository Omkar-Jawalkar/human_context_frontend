import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { OAuthCallbackClient } from "@/app/auth/callback/oauth-callback-client";

function CallbackFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}

export default function GoogleOAuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <OAuthCallbackClient provider="google" />
    </Suspense>
  );
}
