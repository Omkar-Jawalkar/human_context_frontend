import { Badge } from "@/components/ui/badge";
import { formatBrainChatLabel } from "@/lib/chat/greeting";

type ContextBadgeProps = {
  userName: string;
  isSelf?: boolean;
};

export function ContextBadge({ userName, isSelf = false }: ContextBadgeProps) {
  return (
    <Badge variant="secondary" className="font-normal">
      {formatBrainChatLabel(userName, isSelf)}
    </Badge>
  );
}
