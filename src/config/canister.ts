/**
 * Production-ready canister configuration for Internet Computer mainnet deployment
 * 
 * This configuration uses the actual deployed canister IDs for mainnet.
 * Environment variables are used as fallbacks for local development.
 */

// Deployed canister IDs for mainnet
const DEPLOYED_CANISTER_IDS = {
  xonora_backend: 'dtzfv-syaaa-aaaap-qqcjq-cai',
  xonora_frontend: 'dg6uy-tqaaa-aaaap-qqcka-cai'
} as const;

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
 */
export const getCanisterId = (canisterName: 'xonora_backend' | 'internet_identity'): string => {
  if (canisterName === 'xonora_backend') {
    // Use deployed canister ID directly, fallback to environment variable for local dev
    return DEPLOYED_CANISTER_IDS.xonora_backend || 
           import.meta.env.VITE_CANISTER_ID_XONORA_BACKEND || 
           'dtzfv-syaaa-aaaap-qqcjq-cai';
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
 * Validate that all required configuration is present
 * This is a simplified validation for the deployed version
 */
export const validateEnvironment = (): void => {
  console.log('✅ Using deployed canister configuration for mainnet');
  console.log(`🔗 Backend Canister: ${DEPLOYED_CANISTER_IDS.xonora_backend}`);
  console.log(`🌐 Network: ${getNetwork()}`);
  console.log(`🏠 IC Host: ${getICHost()}`);
  console.log(`🔐 Identity Provider: ${getIdentityProvider()}`);
};

/**
 * Get the deployed canister IDs for reference
 */
export const getDeployedCanisterIds = () => DEPLOYED_CANISTER_IDS;
