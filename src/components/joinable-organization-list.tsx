"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrganizationResponse } from "@/lib/types/api";

type JoinableOrganizationListProps = {
  organizations: OrganizationResponse[];
  joiningId: string | null;
  onJoin: (organizationId: string) => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function JoinableOrganizationList({
  organizations,
  joiningId,
  onJoin,
}: JoinableOrganizationListProps) {
  if (organizations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No organizations available to join.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {organizations.map((organization) => (
        <Card key={organization.id} size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>
                Created {formatDate(organization.created_at)}
              </CardDescription>
            </div>
            <Button
              size="sm"
              disabled={joiningId !== null}
              onClick={() => onJoin(organization.id)}
            >
              {joiningId === organization.id ? "Joining…" : "Join"}
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
