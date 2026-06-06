import Link from "next/link";
import { FileUp } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NoImportsCta() {
  return (
    <Alert>
      <FileUp className="size-4" aria-hidden />
      <AlertDescription className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span>
          This user has not imported any Claude conversations yet. Upload an
          export to enable context-aware answers.
        </span>
        <Link
          href="/imports"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Go to imports
        </Link>
      </AlertDescription>
    </Alert>
  );
}
