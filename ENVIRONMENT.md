# Environment Variables

This document lists the required environment variables for the Xonora project.

## Canister IDs

The following environment variables must be set for the application to connect to the correct canisters:

### Development
```bash
# Backend canister ID (Motoko)
CANISTER_ID_XONORA_BACKEND=<your_backend_canister_id>

# Frontend canister ID (Assets)
CANISTER_ID_XONORA_FRONTEND=<your_frontend_canister_id>
```

### Production
```bash
# Backend canister ID (Motoko)
CANISTER_ID_XONORA_BACKEND=<production_backend_canister_id>

# Frontend canister ID (Assets)
CANISTER_ID_XONORA_FRONTEND=<production_frontend_canister_id>
```

## DFX Network Configuration

```bash
# Set to "ic" for mainnet, "local" for local development
DFX_NETWORK=ic
```

## CI/CD Setup

When setting up CI/CD pipelines, ensure the following environment variables are configured:

1. **CANISTER_ID_XONORA_BACKEND**: The deployed backend canister ID
2. **CANISTER_ID_XONORA_FRONTEND**: The deployed frontend canister ID
3. **DFX_NETWORK**: Set to "ic" for mainnet deployments

### Example GitHub Actions Environment Variables

```yaml
env:
  CANISTER_ID_XONORA_BACKEND: ${{ secrets.CANISTER_ID_XONORA_BACKEND }}
  CANISTER_ID_XONORA_FRONTEND: ${{ secrets.CANISTER_ID_XONORA_FRONTEND }}
  DFX_NETWORK: ic
```

### Example Vercel Environment Variables

```
CANISTER_ID_XONORA_BACKEND=your_backend_canister_id
CANISTER_ID_XONORA_FRONTEND=your_frontend_canister_id
DFX_NETWORK=ic
```

## Getting Canister IDs

After deploying with `dfx deploy`, the canister IDs can be found in:

- `.dfx/local/canister_ids.json` (local development)
- `.dfx/ic/canister_ids.json` (mainnet deployment)

Or by running:
```bash
dfx canister id xonora_backend
dfx canister id xonora_frontend
```
