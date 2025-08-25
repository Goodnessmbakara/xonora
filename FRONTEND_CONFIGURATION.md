# Frontend Configuration Guide

## Overview

This document explains how the Xonora frontend is configured for mainnet deployment and how environment variables are handled in Internet Computer canisters.

## The Problem

When deploying frontend canisters to the Internet Computer, environment variables set during the build process are **not available** at runtime. This is because:

1. **Build-time vs Runtime**: Environment variables are only available during the build process
2. **Canister Isolation**: Deployed canisters run in isolated environments
3. **No Environment Access**: Canisters cannot access host environment variables

## The Solution

### Hardcoded Configuration

The frontend now uses **hardcoded canister IDs** for mainnet deployment:

```typescript
// src/config/canister.ts
const DEPLOYED_CANISTER_IDS = {
  xonora_backend: 'dtzfv-syaaa-aaaap-qqcjq-cai',
  xonora_frontend: 'dg6uy-tqaaa-aaaap-qqcka-cai'
} as const;
```

### Fallback Strategy

The configuration uses a fallback strategy:

1. **Primary**: Use hardcoded deployed canister IDs
2. **Fallback**: Use environment variables (for local development)
3. **Default**: Use known canister IDs as final fallback

```typescript
export const getCanisterId = (canisterName: 'xonora_backend' | 'internet_identity'): string => {
  if (canisterName === 'xonora_backend') {
    return DEPLOYED_CANISTER_IDS.xonora_backend || 
           import.meta.env.VITE_CANISTER_ID_XONORA_BACKEND || 
           'dtzfv-syaaa-aaaap-qqcjq-cai';
  }
  // ...
};
```

## Configuration Details

### Backend Canister
- **ID**: `dtzfv-syaaa-aaaap-qqcjq-cai`
- **Status**: Running on mainnet
- **Functions**: Staking, portfolio management, pool queries

### Frontend Canister
- **ID**: `dg6uy-tqaaa-aaaap-qqcka-cai`
- **Status**: Running on mainnet
- **URL**: https://dg6uy-tqaaa-aaaap-qqcka-cai.icp0.io/

### Network Configuration
- **Network**: `ic` (mainnet)
- **IC Host**: `https://ic0.app`
- **Identity Provider**: `https://identity.ic0.app`

## Development vs Production

### Local Development
```bash
# Environment variables work during development
VITE_CANISTER_ID_XONORA_BACKEND=your-local-canister-id
npm run dev
```

### Production Deployment
```bash
# Hardcoded IDs are used in production
npm run build
dfx deploy xonora_frontend --network ic
```

## Alternative Approaches

### 1. Configuration Canister
Create a separate configuration canister that stores settings:

```motoko
// config.mo
actor Config {
  public query func getBackendCanisterId() : async Text {
    "dtzfv-syaaa-aaaap-qqcjq-cai"
  }
}
```

### 2. Environment Detection
Detect environment and use appropriate configuration:

```typescript
const isProduction = window.location.hostname.includes('icp0.io');
const backendId = isProduction 
  ? 'dtzfv-syaaa-aaaap-qqcjq-cai'  // Production
  : import.meta.env.VITE_CANISTER_ID_XONORA_BACKEND; // Development
```

### 3. Build-time Configuration
Use build-time environment variables to generate configuration files:

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    __BACKEND_CANISTER_ID__: JSON.stringify(process.env.VITE_CANISTER_ID_XONORA_BACKEND)
  }
});
```

## Current Implementation

The current implementation uses **hardcoded canister IDs** because:

1. **Simplicity**: No additional complexity
2. **Reliability**: Always works regardless of environment
3. **Performance**: No additional network calls
4. **Security**: No external configuration dependencies

## Updating Canister IDs

To update canister IDs in the future:

1. **Update the configuration**:
   ```typescript
   const DEPLOYED_CANISTER_IDS = {
     xonora_backend: 'new-backend-canister-id',
     xonora_frontend: 'new-frontend-canister-id'
   };
   ```

2. **Rebuild and redeploy**:
   ```bash
   npm run build
   dfx deploy xonora_frontend --network ic
   ```

## Verification

To verify the configuration is working:

1. **Check browser console** for configuration logs
2. **Test backend connection** by visiting the staking page
3. **Verify authentication** works with Internet Identity
4. **Test API calls** to backend functions

## Troubleshooting

### Frontend Can't Connect to Backend
- Verify canister IDs are correct
- Check backend canister is running
- Ensure network configuration is correct

### Authentication Issues
- Verify Internet Identity provider URL
- Check CORS configuration
- Ensure proper certificate validation

### Build Errors
- Check environment variables for local development
- Verify TypeScript compilation
- Ensure all dependencies are installed

## Best Practices

1. **Always test locally** before deploying
2. **Use hardcoded IDs** for production deployments
3. **Keep configuration simple** and reliable
4. **Document all canister IDs** clearly
5. **Version control** configuration changes
6. **Monitor canister status** regularly

## Conclusion

The current configuration approach ensures that the frontend canister can reliably connect to the backend canister on mainnet, regardless of environment variable availability. This provides a robust and maintainable solution for production deployment.
