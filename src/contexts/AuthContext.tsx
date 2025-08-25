import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  retryConnection: () => Promise<boolean>;
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
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    setConnectionStatus('disconnected');
  }, []);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    if (retryCount >= 3) {
      setError('Maximum retry attempts reached. Please try again later.');
      return false;
    }

    try {
      setConnectionStatus('connecting');
      setError(null);
      
      const success = await canisterService.retryConnection();
      if (success) {
        setConnectionStatus('connected');
        setRetryCount(0);
        return true;
      } else {
        throw new Error('Retry connection failed');
      }
    } catch (error) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      setConnectionStatus('error');
      
      if (newRetryCount < 3) {
        const delay = Math.pow(2, newRetryCount - 1) * 1000; // 1s, 2s, 4s
        retryTimeoutRef.current = setTimeout(() => {
          retryConnection();
        }, delay);
      } else {
        setError('Connection failed after multiple attempts. Please check your network connection and try again.');
      }
      return false;
    }
  }, [retryCount]);

  const initialize = async () => {
    try {
      setIsLoading(true);
      setConnectionStatus('connecting');
      clearError();
      
      const success = await canisterService.initialize();
      if (success) {
        // Fix: Use await for async authentication check
        const authenticated = await canisterService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const userPrincipal = canisterService.getPrincipal();
          setPrincipal(userPrincipal);
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } else {
        setConnectionStatus('error');
        setError('Failed to connect to backend services. Please try again.');
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      setConnectionStatus('error');
      
      // Categorize errors for user-friendly messages
      if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          setError('Network connection failed. Please check your internet connection and try again.');
        } else if (error.message.includes('canister') || error.message.includes('backend')) {
          setError('Backend service unavailable. Please try again later.');
        } else {
          setError('Initialization failed. Please refresh the page and try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      setConnectionStatus('connecting');
      clearError();
      
      await canisterService.login();
      setIsAuthenticated(true);
      const userPrincipal = canisterService.getPrincipal();
      setPrincipal(userPrincipal);
      setConnectionStatus('connected');
    } catch (error) {
      console.error("Login failed:", error);
      setConnectionStatus('error');
      
      // Categorize authentication errors
      if (error instanceof Error) {
        if (error.message.includes('authentication') || error.message.includes('identity')) {
          setError('Authentication failed. Please try logging in again.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setError('Network error during authentication. Please check your connection and try again.');
        } else if (error.message.includes('canister') || error.message.includes('backend')) {
          setError('Backend service error. Please try again later.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
      
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
      clearError();
    } catch (error) {
      console.error("Logout failed:", error);
      // Don't set error state for logout failures as user is already logged out
    }
  };

  // Sync connection status with canister service
  useEffect(() => {
    const syncConnectionStatus = async () => {
      try {
        const status = await canisterService.getConnectionStatus();
        if (status === 'connected' && isAuthenticated) {
          setConnectionStatus('connected');
        } else if (status === 'error' && connectionStatus !== 'connecting') {
          setConnectionStatus('error');
        }
      } catch (error) {
        console.error('Failed to sync connection status:', error);
      }
    };

    // Sync on mount and when authentication state changes
    syncConnectionStatus();
    
    // Set up periodic sync every 30 seconds
    const interval = setInterval(syncConnectionStatus, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated, connectionStatus]);

  // Initialize on mount
  useEffect(() => {
    initialize();
    
    // Cleanup retry timeout on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
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
    retryConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
