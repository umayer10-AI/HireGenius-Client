"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<User | null>;
  logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function sessionFallbackUser(sessionUser: {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}): User {
  return {
    _id: sessionUser.id,
    name: sessionUser.name || "User",
    email: sessionUser.email,
    image: sessionUser.image || undefined,
    role: "candidate" as UserRole,
    skills: [],
    education: [],
    isVerified: false,
    isPremium: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = authClient.useSession();

  const refresh = useCallback(async () => {
    try {
      const current = await authClient.getSession();
      const sessionUser = current.data?.user;

      if (!sessionUser) {
        setUser(null);
        return null;
      }

      try {
        const res = await api.get<User>("/api/me");
        setUser(res.data);
        return res.data;
      } catch {
        const fallback = sessionFallbackUser(sessionUser);
        setUser(fallback);
        return fallback;
      }
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    let cancelled = false;
    setLoading(true);

    (async () => {
      if (!session?.user) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get<User>("/api/me");
        if (!cancelled) setUser(res.data);
      } catch {
        if (!cancelled) setUser(sessionFallbackUser(session.user));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user?.id]);

  const logout = useCallback(async () => {
    await authClient.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading: loading || isPending, refresh, logout }),
    [user, loading, isPending, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



