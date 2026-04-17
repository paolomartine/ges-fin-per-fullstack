import { createContext, useContext, useEffect, useState } from 'react';
import type { AuthSession } from '@/features/auth/types';

type AuthContextValue = {
  session: AuthSession | null;
  login: (session: AuthSession) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthSession) : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = (newSession: AuthSession) => setSession(newSession);
  const logout = () => setSession(null);

  return (
    <AuthContext.Provider value={{ session, login, logout, isAuthenticated: Boolean(session) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
