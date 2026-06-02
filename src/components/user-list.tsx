"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UserResponse } from "@/lib/types/api";

type UserListProps = {
  users: UserResponse[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function UserList({ users }: UserListProps) {
  const router = useRouter();

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No users found in this organization.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((member) => (
        <Card key={member.id} size="sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>
                {member.email} · Joined {formatDate(member.created_at)}
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => router.push(`/${member.id}/query`)}
            >
              Select
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
