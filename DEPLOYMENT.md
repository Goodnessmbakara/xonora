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

### 4. Set Environment Variables

Update your environment variables with the actual canister IDs:

```bash
export CANISTER_ID_XONORA_BACKEND=<actual_backend_canister_id>
export CANISTER_ID_XONORA_FRONTEND=<actual_frontend_canister_id>
export DFX_NETWORK=ic
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

## Post-Deployment Steps

1. **Initialize Backend**: Call the `initialize` method on the backend canister
2. **Set Permissions**: Configure canister permissions if needed
3. **Update Frontend**: Ensure frontend is built and deployed with correct canister IDs
4. **Test Functionality**: Verify all features work correctly

## Troubleshooting

### Common Issues

1. **Canister ID Mismatch**: Ensure environment variables match deployed canister IDs
2. **TypeScript Errors**: Run `dfx generate` to regenerate type definitions
3. **Network Issues**: Check `dfx config --network` and ensure correct network is set
4. **Cycles**: Ensure canisters have sufficient cycles for operations

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
