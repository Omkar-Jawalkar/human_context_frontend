import type { QuerySource } from "@/lib/types/api";

type MessageSourcesProps = {
  sources: QuerySource[] | null;
};

export function MessageSources({ sources }: MessageSourcesProps) {
  if (!sources?.length) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Sources</p>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <details
            key={`${source.message_id ?? "source"}-${index}`}
            className="group rounded-lg border border-border bg-background/80 text-left"
          >
            <summary className="cursor-pointer list-none px-3 py-1.5 text-xs font-medium marker:content-none">
              <span className="text-foreground">
                Source {index + 1}
                {source.sender ? ` · ${source.sender}` : ""}
              </span>
              <span className="ml-2 text-muted-foreground">
                ({source.distance.toFixed(3)})
              </span>
            </summary>
            <div className="border-t border-border px-3 py-2">
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                {source.content ?? "No content available"}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
