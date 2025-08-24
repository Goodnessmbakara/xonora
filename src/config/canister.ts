/**
 * Production-ready canister configuration for Internet Computer mainnet deployment
 * 
 * Environment Variables Required:
 * - VITE_CANISTER_ID_XONORA_BACKEND: The deployed backend canister ID
 * - VITE_NETWORK: Network to use (defaults to 'ic' for mainnet)
 * - VITE_IC_HOST: (Optional) Custom IC host URL
 * - VITE_IDENTITY_PROVIDER: (Optional) Custom Internet Identity provider URL
 */

/**
 * Get the current network configuration
 * Always returns 'ic' for mainnet deployment
 */
export const getNetwork = (): 'ic' => {
  // Force mainnet deployment - no local development
  return 'ic';
};

/**
 * Check if the current environment is production
 */
export const isProduction = (): boolean => {
  return true; // Always production for mainnet deployment
};

/**
 * Get canister ID for the specified canister
 * @param canisterName - The name of the canister
 * @returns The canister ID
 * @throws Error if required environment variables are missing
 */
export const getCanisterId = (canisterName: 'xonora_backend' | 'internet_identity'): string => {
  if (canisterName === 'xonora_backend') {
    const canisterId = import.meta.env.VITE_CANISTER_ID_XONORA_BACKEND;
    if (!canisterId) {
      throw new Error(
        'VITE_CANISTER_ID_XONORA_BACKEND environment variable is required for mainnet deployment. ' +
        'Please set this to your deployed backend canister ID.'
      );
    }
    return canisterId;
  }
  
  if (canisterName === 'internet_identity') {
    return import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai';
  }
  
  throw new Error(`Unknown canister: ${canisterName}`);
};

/**
 * Get the IC host URL
 * @returns The IC host URL for mainnet
 */
export const getICHost = (): string => {
  return import.meta.env.VITE_IC_HOST || 'https://ic0.app';
};

/**
 * Get the Internet Identity provider URL
 * @returns The Internet Identity provider URL for mainnet
 */
export const getIdentityProvider = (): string => {
  return import.meta.env.VITE_IDENTITY_PROVIDER || 'https://identity.ic0.app';
};

/**
 * Validate that all required environment variables are present
 * @throws Error if required variables are missing
 */
export const validateEnvironment = (): void => {
  const missingVars: string[] = [];
  
  if (!import.meta.env.VITE_CANISTER_ID_XONORA_BACKEND) {
    missingVars.push('VITE_CANISTER_ID_XONORA_BACKEND');
  }
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables for mainnet deployment: ${missingVars.join(', ')}\n` +
      'Please set these variables in your deployment environment.'
    );
  }
  
  console.log('✅ Environment validation passed for mainnet deployment');
};
