# Environment Configuration for Xonora Mainnet

## Overview
Xonora is configured for mainnet-only deployment on the Internet Computer (ICP). This document provides the complete environment setup required for production deployment.

## Required Environment Variables

### Backend Canister ID
```bash
VITE_CANISTER_ID_XONORA_BACKEND=dtzfv-syaaa-aaaap-qqcjq-cai
```

### Network Configuration
```bash
VITE_DFX_NETWORK=ic
VITE_IC_HOST=https://ic0.app
VITE_IDENTITY_PROVIDER=https://identity.ic0.app
```

## Platform-Specific Setup

### Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   ```
   VITE_CANISTER_ID_XONORA_BACKEND=dtzfv-syaaa-aaaap-qqcjq-cai
   VITE_DFX_NETWORK=ic
   VITE_IC_HOST=https://ic0.app
   VITE_IDENTITY_PROVIDER=https://identity.ic0.app
   ```

### Netlify Deployment
1. Go to your Netlify site dashboard
2. Navigate to Site settings → Environment variables
3. Add the following variables:
   ```
   VITE_CANISTER_ID_XONORA_BACKEND=dtzfv-syaaa-aaaap-qqcjq-cai
   VITE_DFX_NETWORK=ic
   VITE_IC_HOST=https://ic0.app
   VITE_IDENTITY_PROVIDER=https://identity.ic0.app
   ```

### IC Frontend Canister
1. Deploy using the provided deployment script:
   ```bash
   ./deploy-to-ic.sh
   ```
2. The script will automatically set the environment variables

## Verification

### Backend Status
- **Canister ID**: `dtzfv-syaaa-aaaap-qqcjq-cai`
- **Status**: Running on mainnet
- **Candid Interface**: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=dtzfv-syaaa-aaaap-qqcjq-cai

### Test Backend Connection
```bash
# Test system info
dfx canister call dtzfv-syaaa-aaaap-qqcjq-cai getSystemInfo --network ic

# Test pools
dfx canister call dtzfv-syaaa-aaaap-qqcjq-cai getPools --network ic
```

## Security Notes
- All environment variables use the `VITE_` prefix for client-side access
- Backend canister is deployed with secure identity
- Internet Identity integration is configured for mainnet
- No local development dependencies remain

## Troubleshooting
- Ensure all environment variables are set before building
- Verify backend canister is running: `dfx canister status dtzfv-syaaa-aaaap-qqcjq-cai --network ic`
- Check cycles balance: `dfx canister info dtzfv-syaaa-aaaap-qqcjq-cai --network ic`
