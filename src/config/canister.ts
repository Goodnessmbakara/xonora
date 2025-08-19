// Canister configuration for different environments

export const CANISTER_IDS = {
  // Local development canister IDs
  local: {
    xonora_backend: 'uxrrr-q7777-77774-qaaaq-cai',
    internet_identity: 'uzt4z-lp777-77774-qaabq-cai',
  },
  // Production canister IDs (to be updated when deployed)
  ic: {
    xonora_backend: import.meta.env.VITE_CANISTER_ID_XONORA_BACKEND || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    internet_identity: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  }
};

export const getCanisterId = (canisterName: keyof typeof CANISTER_IDS.local) => {
  const network = import.meta.env.VITE_NETWORK || (import.meta.env.PROD ? 'ic' : 'local');
  return CANISTER_IDS[network as keyof typeof CANISTER_IDS][canisterName];
};

export const getICHost = () => {
  return import.meta.env.VITE_IC_HOST || 
    (import.meta.env.PROD ? 'https://ic0.app' : 'http://127.0.0.1:8000');
};

export const getIdentityProvider = () => {
  // Use production Internet Identity for both local and production
  // This is a common practice and ensures reliability
  return 'https://identity.ic0.app';
};
