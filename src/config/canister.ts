/**
 * Production-ready canister configuration for Internet Computer deployment
 * 
 * Environment Variables Required:
 * - VITE_CANISTER_ID_XONORA_BACKEND: The deployed backend canister ID
 * - VITE_NETWORK: Network to use ('local' or 'ic')
 * - VITE_IC_HOST: (Optional) Custom IC host URL
 * - VITE_IDENTITY_PROVIDER: (Optional) Custom Internet Identity provider URL
 */

/**
 * Get the current network configuration
 * Priority: VITE_NETWORK > VITE_DFX_NETWORK > PROD flag fallback
 */
export const getNetwork = (): 'local' | 'ic' => {
  return (import.meta.env.VITE_NETWORK || 
          import.meta.env.VITE_DFX_NETWORK || 
          (import.meta.env.PROD ? 'ic' : 'local')) as 'local' | 'ic';
};

/**
 * Check if the current environment is production
 */
export const isProduction = (): boolean => {
  return getNetwork() === 'ic';
};

/**
 * Get canister ID for the specified canister
 * @param canisterName - The name of the canister
 * @returns The canister ID
 * @throws Error if required environment variables are missing in production
 */
export const getCanisterId = (canisterName: 'xonora_backend' | 'internet_identity'): string => {
  const network = getNetwork();
  
  if (network === 'ic') {
    // Production: require environment variables
    if (canisterName === 'xonora_backend') {
      const canisterId = import.meta.env.VITE_CANISTER_ID_XONORA_BACKEND;
      if (!canisterId) {
        throw new Error(
          'VITE_CANISTER_ID_XONORA_BACKEND environment variable is required for production deployment. ' +
          'Please set this to your deployed backend canister ID.'
        );
      }
      return canisterId;
    }
    
    if (canisterName === 'internet_identity') {
      return import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai';
    }
  } else {
    // Local development: use local canister IDs
    const localCanisterIds = {
      xonora_backend: 'uxrrr-q7777-77774-qaaaq-cai',
      internet_identity: 'uzt4z-lp777-77774-qaabq-cai',
    };
    return localCanisterIds[canisterName];
  }
  
  throw new Error(`Unknown canister: ${canisterName}`);
};

/**
 * Get the IC host URL
 * @returns The IC host URL for the current network
 */
export const getICHost = (): string => {
  const network = getNetwork();
  
  if (network === 'ic') {
    return import.meta.env.VITE_IC_HOST || 'https://ic0.app';
  } else {
    return import.meta.env.VITE_IC_HOST || 'http://127.0.0.1:8000';
  }
};

/**
 * Get the Internet Identity provider URL
 * @returns The Internet Identity provider URL
 */
export const getIdentityProvider = (): string => {
  return import.meta.env.VITE_IDENTITY_PROVIDER || 'https://identity.ic0.app';
};

/**
 * Validate that all required environment variables are present
 * @throws Error if required variables are missing
 */
export const validateEnvironment = (): void => {
  const network = getNetwork();
  
  if (network === 'ic') {
    const missingVars: string[] = [];
    
    if (!import.meta.env.VITE_CANISTER_ID_XONORA_BACKEND) {
      missingVars.push('VITE_CANISTER_ID_XONORA_BACKEND');
    }
    
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables for production deployment: ${missingVars.join(', ')}\n` +
        'Please set these variables in your deployment environment.'
      );
    }
  }
  
  console.log(`✅ Environment validation passed for network: ${network}`);
};
