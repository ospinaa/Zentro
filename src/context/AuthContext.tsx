import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { auth } from "../services/firebase";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;

  loading: boolean;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext =
  createContext<AuthContextValue | null>(
    null
  );

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {

          setUser(firebaseUser);

          setLoading(false);
        }
      );

    return unsubscribe;

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {

  const ctx =
    useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    );
  }

  return ctx;
}