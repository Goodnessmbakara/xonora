# Deployment Guide

This guide explains how to deploy the Xonora project to the Internet Computer.

## Prerequisites

1. Install DFX (DFINITY Canister SDK)
2. Authenticate with Internet Identity
3. Ensure you have cycles for deployment

## Local Development

### 1. Start Local Replica

```bash
dfx start --clean
```

### 2. Deploy Canisters

```bash
# Deploy all canisters
dfx deploy

# Or deploy individually
dfx deploy xonora_backend
dfx deploy xonora_frontend
```

### 3. Generate TypeScript Definitions

```bash
# Generate TypeScript definitions for backend
dfx generate xonora_backend

# Generate TypeScript definitions for frontend
dfx generate xonora_frontend
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

## Mainnet Deployment

### 1. Set Network to Mainnet

```bash
dfx config --network ic
```

### 2. Deploy Canisters

```bash
# Deploy all canisters to mainnet
dfx deploy --network ic

# Or deploy individually
dfx deploy xonora_backend --network ic
dfx deploy xonora_frontend --network ic
```

### 3. Get Canister IDs

```bash
# Get backend canister ID
dfx canister id xonora_backend --network ic

# Get frontend canister ID
dfx canister id xonora_frontend --network ic
```

## Environment Variable Setup

Before deploying the frontend, you need to set up the environment variables for production.

### 1. Set Environment Variables

Update your environment variables with the actual canister IDs:

```bash
export VITE_CANISTER_ID_XONORA_BACKEND=<actual_backend_canister_id>
export VITE_NETWORK=ic
export VITE_IC_HOST=https://ic0.app
```

### 2. Validate Environment Variables

Ensure all required variables are set:

```bash
echo $VITE_CANISTER_ID_XONORA_BACKEND
echo $VITE_NETWORK
```

### 3. Test Configuration Locally

Before deploying to production, test your configuration:

```bash
# Build the application with production environment
npm run build

# Check that the build completed successfully
ls -la dist/
```

## Canister Configuration

The project uses two canisters:

### xonora_backend (Motoko)
- **Type**: Motoko
- **Main**: `src/backend/main.mo`
- **Dependencies**: None
- **Purpose**: Handles all business logic, staking operations, and data management

### xonora_frontend (Assets)
- **Type**: Assets
- **Source**: `dist` directory
- **Dependencies**: `xonora_backend`
- **Purpose**: Serves the React frontend application

## Production Deployment Checklist

Before deploying to production, ensure you have completed all the following steps:

### Pre-Deployment Checklist

- [ ] **Backend Deployed**: `xonora_backend` canister is deployed to IC mainnet
- [ ] **Canister ID Retrieved**: Backend canister ID is available via `dfx canister id xonora_backend --network ic`
- [ ] **Environment Variables Set**: All required `VITE_*` variables are configured
- [ ] **Local Build Test**: Application builds successfully with production environment
- [ ] **Network Configuration**: `VITE_NETWORK=ic` is set for production
- [ ] **Certificate Validation**: Production deployment uses proper certificate verification

### Post-Deployment Steps

1. **Initialize Backend**: Call the `initialize` method on the backend canister
2. **Set Permissions**: Configure canister permissions if needed
3. **Update Frontend**: Ensure frontend is built and deployed with correct canister IDs
4. **Test Functionality**: Verify all features work correctly
5. **Validate Environment**: Confirm application is using correct production canister IDs
6. **Check Security**: Verify certificate validation is working properly

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Check that all required `VITE_*` variables are set
2. **Canister ID Mismatch**: Ensure `VITE_CANISTER_ID_XONORA_BACKEND` matches deployed canister ID
3. **Network Configuration**: Verify `VITE_NETWORK=ic` is set for production
4. **Certificate Validation**: Production should use proper certificate verification
5. **TypeScript Errors**: Run `dfx generate` to regenerate type definitions
6. **Cycles**: Ensure canisters have sufficient cycles for operations

### Environment Variable Validation

```bash
# Check if required variables are set
echo "VITE_CANISTER_ID_XONORA_BACKEND: $VITE_CANISTER_ID_XONORA_BACKEND"
echo "VITE_NETWORK: $VITE_NETWORK"

# Verify canister ID format
echo $VITE_CANISTER_ID_XONORA_BACKEND | grep -E '^[a-z0-9-]+$'

# Test canister accessibility
dfx canister call $VITE_CANISTER_ID_XONORA_BACKEND whoami --network ic
```

### Useful Commands

```bash
# Check canister status
dfx canister status xonora_backend
dfx canister status xonora_frontend

# View canister logs
dfx canister call xonora_backend whoami

# Check cycles balance
dfx canister info xonora_backend
dfx canister info xonora_frontend
```

## Environment Variables Reference

See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed environment variable configuration.
