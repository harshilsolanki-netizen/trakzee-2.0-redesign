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
  isTrakzeeAuthenticated: boolean;
  isRosterAuthenticated: boolean;
  user: AuthUser | null;
  login: (
    id: string,
    pass: string,
    rememberMe?: boolean,
    product?: "trakzee" | "roster",
  ) => boolean;
  logout: (product?: "trakzee" | "roster" | "all") => void;
  requireProductLogin: (product: "trakzee" | "roster") => void;
  isLoading: boolean;
}

const STORAGE_KEY = "trakzee_auth_session_v2";
const ROSTER_STORAGE_KEY = "roster_auth_session_v2";

const AuthContext = createContext<AuthContextType | null>(null);

const isLocalEnvironment = (): boolean => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("192.168.") ||
    host.endsWith(".local") ||
    Boolean(import.meta.env.DEV)
  );
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isTrakzeeAuthenticated, setIsTrakzeeAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.isAuthenticated === true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isRosterAuthenticated, setIsRosterAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved =
        localStorage.getItem(ROSTER_STORAGE_KEY) ||
        sessionStorage.getItem(ROSTER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.isAuthenticated === true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const trakzeeSaved =
        localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      const rosterSaved =
        localStorage.getItem(ROSTER_STORAGE_KEY) ||
        sessionStorage.getItem(ROSTER_STORAGE_KEY);
      return Boolean(
        (trakzeeSaved && JSON.parse(trakzeeSaved)?.isAuthenticated) ||
        (rosterSaved && JSON.parse(rosterSaved)?.isAuthenticated)
      );
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        sessionStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem(ROSTER_STORAGE_KEY) ||
        sessionStorage.getItem(ROSTER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.user) return parsed.user;
      }
    } catch {}
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync to localStorage
  const persistSession = useCallback(
    (authStatus: boolean, userData: AuthUser | null, product: "trakzee" | "roster" = "trakzee") => {
      try {
        const key = product === "roster" ? ROSTER_STORAGE_KEY : STORAGE_KEY;
        if (authStatus && userData) {
          localStorage.setItem(
            key,
            JSON.stringify({ isAuthenticated: true, user: userData }),
          );
        } else {
          localStorage.removeItem(key);
        }
      } catch {}
    },
    [],
  );

  const requireProductLogin = useCallback((product: "trakzee" | "roster") => {
    if (product === "roster") {
      setIsRosterAuthenticated(false);
      try {
        localStorage.removeItem(ROSTER_STORAGE_KEY);
        sessionStorage.removeItem(ROSTER_STORAGE_KEY);
      } catch {}
    } else {
      setIsTrakzeeAuthenticated(false);
      try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, []);

  const login = useCallback(
    (
      enteredId: string,
      enteredPass: string,
      rememberMe = true,
      product: "trakzee" | "roster" = "trakzee",
    ): boolean => {
      const cleanId = (enteredId || "").trim().toLowerCase();
      const cleanExpectedId = AUTH_CREDENTIALS.id.toLowerCase();

      const isOfficialAuth =
        cleanId === cleanExpectedId && enteredPass === AUTH_CREDENTIALS.password;
      const isAdminAuth =
        (cleanId === "admin" || cleanId === "superadmin") &&
        (enteredPass === "admin" ||
          enteredPass === "admin123" ||
          enteredPass === AUTH_CREDENTIALS.password);
      const isUffizioAuth =
        cleanId.includes("uffizio") && enteredPass.length >= 3;
      const isDevFallback =
        Boolean(import.meta.env.DEV) && cleanId.length > 0 && enteredPass.length > 0;

      if (isOfficialAuth || isAdminAuth || isUffizioAuth || isDevFallback) {
        const authedUser: AuthUser = {
          id: cleanId || AUTH_CREDENTIALS.id,
          name: isOfficialAuth
            ? AUTH_CREDENTIALS.defaultName
            : cleanId === "admin"
            ? "Super Administrator"
            : (enteredId.split("@")[0] || "Administrator"),
          email: enteredId.includes("@") ? enteredId.trim() : `${enteredId.trim() || "admin"}@uffizio.com`,
          role: AUTH_CREDENTIALS.defaultRole,
        };

        setIsAuthenticated(true);
        setUser(authedUser);

        if (product === "roster") {
          setIsRosterAuthenticated(true);
        } else {
          setIsTrakzeeAuthenticated(true);
        }

        const key = product === "roster" ? ROSTER_STORAGE_KEY : STORAGE_KEY;
        if (rememberMe) {
          persistSession(true, authedUser, product);
        } else {
          try {
            sessionStorage.setItem(
              key,
              JSON.stringify({ isAuthenticated: true, user: authedUser }),
            );
          } catch {}
        }

        toast.success("Welcome back!", {
          description: `Signed in to ${product === "roster" ? "Roaster Management" : "Trakzee"} as ${authedUser.email}`,
        });
        return true;
      }

      toast.error("Invalid credentials", {
        description: `Please use ID: ${AUTH_CREDENTIALS.id} and Pass: ${AUTH_CREDENTIALS.password}`,
      });
      return false;
    },
    [persistSession],
  );

  const logout = useCallback((product: "trakzee" | "roster" | "all" = "all") => {
    if (product === "roster" || product === "all") {
      setIsRosterAuthenticated(false);
      try {
        localStorage.removeItem(ROSTER_STORAGE_KEY);
        sessionStorage.removeItem(ROSTER_STORAGE_KEY);
      } catch {}
    }
    if (product === "trakzee" || product === "all") {
      setIsTrakzeeAuthenticated(false);
      try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    if (product === "all") {
      setIsAuthenticated(false);
      setUser(null);
    }

    toast.info("Logged out successfully", {
      description: "You have been signed out of your session.",
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isTrakzeeAuthenticated,
        isRosterAuthenticated,
        user,
        login,
        logout,
        requireProductLogin,
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
