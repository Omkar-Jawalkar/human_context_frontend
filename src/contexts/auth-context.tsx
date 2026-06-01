"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login as loginRequest, register as registerRequest } from "@/lib/api/auth";
import type { LoginInput, RegisterInput } from "@/lib/api/auth";
import { getMe } from "@/lib/api/users";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/auth/token";
import type { UserResponse } from "@/lib/types/api";

type AuthContextValue = {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<UserResponse>;
  register: (input: RegisterInput) => Promise<UserResponse>;
  logout: () => void;
  refreshUser: () => Promise<UserResponse | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getPostAuthPath(user: UserResponse): string {
  if (user.super_admin) {
    return "/organizations";
  }

  if (!user.organization_id) {
    return "/join-organization";
  }

  return "/query";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      setToken(null);
      setUser(null);
      return null;
    }

    try {
      const profile = await getMe(storedToken);
      setToken(storedToken);
      setUser(profile);
      return profile;
    } catch {
      clearStoredToken();
      setToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);

  const authenticate = useCallback(async (accessToken: string) => {
    setStoredToken(accessToken);
    setToken(accessToken);

    const profile = await getMe(accessToken);
    setUser(profile);
    return profile;
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const response = await loginRequest(input);
      const profile = await authenticate(response.access_token);
      toast.success("Signed in successfully");
      router.push(getPostAuthPath(profile));
      return profile;
    },
    [authenticate, router],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const response = await registerRequest(input);
      const profile = await authenticate(response.access_token);
      toast.success("Account created successfully");
      router.push(getPostAuthPath(profile));
      return profile;
    },
    [authenticate, router],
  );

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export function useRequireAuth(): AuthContextValue {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.token) {
      router.replace("/login");
    }
  }, [auth.isLoading, auth.token, router]);

  return auth;
}
