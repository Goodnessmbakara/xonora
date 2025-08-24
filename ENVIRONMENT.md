# Environment Variables

This document lists the required environment variables for the Xonora project.

## Required vs Optional Variables

### Required Variables (Production)
- `VITE_CANISTER_ID_XONORA_BACKEND`: The deployed backend canister ID
- `VITE_NETWORK`: Network configuration ('local' or 'ic')

### Optional Variables
- `VITE_IC_HOST`: Custom IC host URL (defaults to 'https://ic0.app' for production, 'http://127.0.0.1:8000' for local)
- `VITE_IDENTITY_PROVIDER`: Custom Internet Identity provider URL (defaults to 'https://identity.ic0.app')
- `VITE_CANISTER_ID_INTERNET_IDENTITY`: Custom Internet Identity canister ID (defaults to production II)

## Environment Configuration

### Development
```bash
# Required
VITE_NETWORK=local

# Optional - for local development
VITE_IC_HOST=http://127.0.0.1:8000
VITE_IDENTITY_PROVIDER=https://identity.ic0.app
```

### Production
```bash
# Required
VITE_CANISTER_ID_XONORA_BACKEND=your_production_backend_canister_id
VITE_NETWORK=ic

# Optional
VITE_IC_HOST=https://ic0.app
VITE_IDENTITY_PROVIDER=https://identity.ic0.app
VITE_CANISTER_ID_INTERNET_IDENTITY=rdmx6-jaaaa-aaaaa-aaadq-cai
```

## CI/CD Setup

When setting up CI/CD pipelines, ensure the following environment variables are configured:

### Example GitHub Actions Environment Variables

```yaml
env:
  VITE_CANISTER_ID_XONORA_BACKEND: ${{ secrets.VITE_CANISTER_ID_XONORA_BACKEND }}
  VITE_NETWORK: ic
  VITE_IC_HOST: https://ic0.app
```

### Example Vercel Environment Variables

```
VITE_CANISTER_ID_XONORA_BACKEND=your_production_backend_canister_id
VITE_NETWORK=ic
VITE_IC_HOST=https://ic0.app
```

## Getting Canister IDs

After deploying with `dfx deploy`, the canister IDs can be found in:

- `.dfx/local/canister_ids.json` (local development)
- `.dfx/ic/canister_ids.json` (mainnet deployment)

Or by running:
```bash
dfx canister id xonora_backend
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: The application will show helpful error messages if required variables are missing
2. **Network Configuration**: Ensure `VITE_NETWORK` is set correctly for your environment
3. **Canister ID Format**: Verify that canister IDs follow the correct format (e.g., `uxrrr-q7777-77774-qaaaq-cai`)

### Validation Commands

Check if environment variables are properly set:
```bash
# Check if VITE_ variables are available
echo $VITE_CANISTER_ID_XONORA_BACKEND
echo $VITE_NETWORK

# For local development, check DFX canister IDs
dfx canister id xonora_backend
```

### Example .env.local (Development)
```bash
VITE_NETWORK=local
VITE_IC_HOST=http://127.0.0.1:8000
```

### Example .env.production (Production)
```bash
VITE_CANISTER_ID_XONORA_BACKEND=your_actual_canister_id
VITE_NETWORK=ic
VITE_IC_HOST=https://ic0.app
```
