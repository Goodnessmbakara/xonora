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
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
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
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  const initialize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      const success = await canisterService.initialize();
      if (success) {
        const authenticated = canisterService.isAuthenticated();
        const status = canisterService.getConnectionStatus();
        
        setIsAuthenticated(authenticated);
        setConnectionStatus(status);
        
        if (authenticated) {
          const userPrincipal = canisterService.getPrincipal();
          setPrincipal(userPrincipal);
        }
      } else {
        setConnectionStatus('error');
        setError('Failed to initialize wallet connection');
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      setConnectionStatus('error');
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      console.log('AuthContext: Starting login process...');
      await canisterService.login();
      console.log('AuthContext: Login service call completed');
      
      const authenticated = canisterService.isAuthenticated();
      const status = canisterService.getConnectionStatus();
      const userPrincipal = canisterService.getPrincipal();
      
      console.log('AuthContext: Post-login state:', {
        authenticated,
        status,
        principal: userPrincipal
      });
      
      setIsAuthenticated(authenticated);
      setConnectionStatus(status);
      setPrincipal(userPrincipal);
      
      if (!authenticated) {
        throw new Error('Authentication failed - user not authenticated');
      }
      
      if (status === 'error') {
        throw new Error('Connection failed - actor setup error');
      }
      
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      setConnectionStatus('error');
      setIsAuthenticated(false);
      setPrincipal(null);
      setError(error instanceof Error ? error.message : 'Login failed');
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
      setConnectionStatus('disconnected');
      setError(null);
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    principal,
    isLoading,
    connectionStatus,
    error,
    login,
    logout,
    initialize,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
