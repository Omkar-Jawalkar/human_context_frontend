"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QueryRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/users");
  }, [router]);

  return <p className="text-sm text-muted-foreground">Loading…</p>;
}
