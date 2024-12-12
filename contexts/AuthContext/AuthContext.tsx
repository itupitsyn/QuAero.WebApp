"use client";

import { SessionUser } from "@/types/auth";
import { getSession } from "@/utils/api";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface AuthContext {
  user: SessionUser | null;
  status: "loading" | "ready" | "not_initialized";
  updateAuth: () => void;
}

const AuthContext = createContext<AuthContext>({ user: null, status: "loading", updateAuth: () => {} });

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthContext["user"]>(null);
  const [status, setStatus] = useState<AuthContext["status"]>("not_initialized");
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const handler = async () => {
      try {
        setStatus("loading");
        const response = await getSession();
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setStatus("ready");
      }
    };

    handler();
  }, [trigger]);

  const updateAuth = useCallback(() => {
    setTrigger((prev) => !prev);
  }, []);

  const value = useMemo(() => {
    return { user, status, updateAuth };
  }, [status, user, updateAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const cntx = useContext(AuthContext);

  return cntx;
};
