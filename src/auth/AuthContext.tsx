import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const AUTH_CREDENTIALS = {
  id: "design.uffizio.com",
  password: "Design@123",
  defaultName: "HP Company Admin",
  defaultRole: "Super Administrator",
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (id: string, pass: string, rememberMe?: boolean) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const STORAGE_KEY = "trakzee_auth_session_v2";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.isAuthenticated === true;
      }
      // First-time visit: default to logged-in for immediate convenience,
      // but if user logs out, it persists as logged-out.
      return true;
    } catch {
      return true;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.user) return parsed.user;
      }
    } catch {}
    return {
      id: AUTH_CREDENTIALS.id,
      name: AUTH_CREDENTIALS.defaultName,
      email: AUTH_CREDENTIALS.id,
      role: AUTH_CREDENTIALS.defaultRole,
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync to localStorage
  const persistSession = useCallback((authStatus: boolean, userData: AuthUser | null) => {
    try {
      if (authStatus && userData) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ isAuthenticated: true, user: userData }),
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, []);

  const login = useCallback(
    (enteredId: string, enteredPass: string, rememberMe = true): boolean => {
      const cleanId = (enteredId || "").trim().toLowerCase();
      const cleanExpectedId = AUTH_CREDENTIALS.id.toLowerCase();

      if (cleanId === cleanExpectedId && enteredPass === AUTH_CREDENTIALS.password) {
        const authedUser: AuthUser = {
          id: AUTH_CREDENTIALS.id,
          name: AUTH_CREDENTIALS.defaultName,
          email: AUTH_CREDENTIALS.id,
          role: AUTH_CREDENTIALS.defaultRole,
        };

        setIsAuthenticated(true);
        setUser(authedUser);

        if (rememberMe) {
          persistSession(true, authedUser);
        } else {
          try {
            sessionStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ isAuthenticated: true, user: authedUser }),
            );
          } catch {}
        }

        toast.success("Welcome back!", {
          description: `Signed in as ${AUTH_CREDENTIALS.id}`,
        });
        return true;
      }

      toast.error("Invalid credentials", {
        description: "Please check your ID and password.",
      });
      return false;
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}

    toast.info("Logged out successfully", {
      description: "You have been signed out of your Trakzee session.",
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
