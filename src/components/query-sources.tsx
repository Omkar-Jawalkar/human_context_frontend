import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QuerySource } from "@/lib/types/api";

type QuerySourcesProps = {
  sources: QuerySource[] | null;
};

export function QuerySources({ sources }: QuerySourcesProps) {
  if (!sources?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No source citations were returned for this answer.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sources.map((source, index) => (
        <Card key={`${source.message_id ?? "source"}-${index}`} size="sm">
          <CardHeader>
            <CardTitle className="text-sm">
              Source {index + 1}
              {source.sender ? ` · ${source.sender}` : ""}
            </CardTitle>
            <CardDescription>
              distance {source.distance.toFixed(4)}
              {source.conversation_id
                ? ` · conversation ${source.conversation_id}`
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {source.content ?? "No content available"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
