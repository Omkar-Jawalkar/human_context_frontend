"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { listUsers } from "@/lib/api/users";
import type { UserResponse } from "@/lib/types/api";

type UseOrgUsersResult = {
  users: UserResponse[];
  usersById: Map<string, UserResponse>;
  getUserName: (id: string) => string;
  getUser: (id: string) => UserResponse | undefined;
  isLoading: boolean;
  error: string | null;
};

function formatUserIdFallback(id: string): string {
  return id.slice(0, 8);
}

export function useOrgUsers(
  token: string | null,
  currentUser: UserResponse | null,
): UseOrgUsersResult {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !currentUser?.organization_id) {
      setUsers(currentUser ? [currentUser] : []);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchAllUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const allUsers: UserResponse[] = [];
        let page = 1;

        while (true) {
          const response = await listUsers(token, {
            organization_id: currentUser.organization_id!,
            page,
            page_size: 100,
          });

          allUsers.push(...response.items);

          if (page >= response.total_pages) {
            break;
          }

          page += 1;
        }

        if (!cancelled) {
          const byId = new Map(allUsers.map((member) => [member.id, member]));
          if (!byId.has(currentUser.id)) {
            allUsers.unshift(currentUser);
          }
          setUsers(allUsers);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load organization members.",
          );
          setUsers([currentUser]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchAllUsers();

    return () => {
      cancelled = true;
    };
  }, [token, currentUser]);

  const usersById = useMemo(() => {
    const map = new Map<string, UserResponse>();
    for (const member of users) {
      map.set(member.id, member);
    }
    if (currentUser && !map.has(currentUser.id)) {
      map.set(currentUser.id, currentUser);
    }
    return map;
  }, [users, currentUser]);

  const getUser = useCallback(
    (id: string) => usersById.get(id),
    [usersById],
  );

  const getUserName = useCallback(
    (id: string) => {
      const member = usersById.get(id);
      if (member) {
        return member.name;
      }
      if (currentUser?.id === id) {
        return currentUser.name;
      }
      return formatUserIdFallback(id);
    },
    [usersById, currentUser],
  );

  return {
    users,
    usersById,
    getUserName,
    getUser,
    isLoading,
    error,
  };
}

export async function resolveOrgUser(
  token: string,
  userId: string,
  currentUser: UserResponse,
): Promise<UserResponse | null> {
  if (userId === currentUser.id) {
    return currentUser;
  }

  if (!currentUser.organization_id) {
    return null;
  }

  let page = 1;

  while (true) {
    const response = await listUsers(token, {
      organization_id: currentUser.organization_id,
      page,
      page_size: 100,
    });

    const match = response.items.find((member) => member.id === userId);
    if (match) {
      return match;
    }

    if (page >= response.total_pages) {
      return null;
    }

    page += 1;
  }
}
