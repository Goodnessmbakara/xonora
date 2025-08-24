import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface IdentityConnectionProps {
  showFullInterface?: boolean;
  className?: string;
}

const IdentityConnection: React.FC<IdentityConnectionProps> = ({ 
  showFullInterface = false, 
  className = '' 
}) => {
  const { 
    isAuthenticated, 
    principal, 
    isLoading, 
    connectionStatus, 
    error, 
    login, 
    logout, 
    clearError 
  } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      clearError();
      await login();
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Disconnect failed:', err);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-xonora-accent-400" />;
      case 'connecting':
        return <Loader2 className="w-4 h-4 text-xonora-accent-400 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <User className="w-4 h-4 text-xonora-secondary-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 6)}...${principal.slice(-6)}`;
  };

  if (showFullInterface) {
    return (
      <div className={`bg-xonora-secondary-700 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Internet Identity</h3>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm text-xonora-secondary-300">{getStatusText()}</span>
          </div>
        </div>

        {error && (
          <Alert className="mb-4 border-red-500 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-xonora-secondary-600 rounded-lg p-4">
              <div className="text-sm text-xonora-secondary-400 mb-1">Principal ID</div>
              <div className="text-white font-mono text-sm break-all">
                {principal}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-xonora-accent-400" />
                <span className="text-xonora-accent-400 font-medium">Identity Connected</span>
              </div>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xonora-secondary-300 text-center py-8">
              <User className="w-12 h-12 mx-auto mb-4 text-xonora-secondary-500" />
              <p className="mb-2 font-body">Connect with Internet Identity</p>
              <p className="text-sm text-xonora-secondary-500 font-body">
                Securely authenticate to access Xonora's Bitcoin yield farming platform
              </p>
            </div>
            
            <Button
              onClick={handleConnect}
              disabled={isLoading || isConnecting}
              className="w-full bg-gradient-to-r from-xonora-amber-400 to-xonora-amber-600 hover:from-xonora-amber-500 hover:to-xonora-amber-700 text-xonora-dark font-semibold"
            >
              {isLoading || isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Compact version for header
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isAuthenticated ? (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-xonora-secondary-700 px-3 py-2 rounded-lg">
            {getStatusIcon()}
            <span className="text-sm text-xonora-secondary-300 font-mono">
              {principal ? formatPrincipal(principal) : 'Connected'}
            </span>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            size="sm"
            className="border-xonora-secondary-500 text-xonora-secondary-300 hover:border-red-400 hover:text-red-400"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isLoading || isConnecting}
          className="bg-gradient-to-r from-xonora-amber-400 to-xonora-amber-600 hover:from-xonora-amber-500 hover:to-xonora-amber-700 text-xonora-dark font-semibold"
        >
          {isLoading || isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" />
              Login with Internet Identity
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default IdentityConnection;

