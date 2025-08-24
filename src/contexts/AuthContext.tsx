import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { canisterService } from "../services/canister";

interface AuthContextType {
  isAuthenticated: boolean;
  principal: string | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initialize = async () => {
    try {
      setIsLoading(true);
      const success = await canisterService.initialize();
      if (success) {
        const authenticated = canisterService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          const userPrincipal = canisterService.getPrincipal();
          setPrincipal(userPrincipal);
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      await canisterService.login();
      setIsAuthenticated(true);
      const userPrincipal = canisterService.getPrincipal();
      setPrincipal(userPrincipal);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await canisterService.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    principal,
    isLoading,
    login,
    logout,
    initialize,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
