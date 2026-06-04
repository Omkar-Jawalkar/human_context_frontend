import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-muted/30">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12 sm:py-16">
        <header className="mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/80"
          >
            Human Context
          </Link>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Import Claude exports and search your conversations with semantic
            retrieval.
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
