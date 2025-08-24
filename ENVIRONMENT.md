# Environment Configuration for Mainnet Deployment

This document describes the environment variables required for deploying Xonora to the Internet Computer mainnet.

## Required Environment Variables

### Network Configuration
```bash
VITE_NETWORK=ic
```
- **Purpose**: Specifies the network to use
- **Value**: Always `ic` for mainnet deployment
- **Required**: Yes

### Backend Canister ID
```bash
VITE_CANISTER_ID_XONORA_BACKEND=your-deployed-canister-id-here
```
- **Purpose**: The deployed backend canister ID on mainnet
- **Format**: Canister ID (e.g., `abc123-def456-ghi789-jkl012-mno345-pqr678-stu901-vwx234-yz567`)
- **Required**: Yes
- **How to get**: Deploy the backend canister using `dfx deploy --network ic`

### Internet Identity Configuration
```bash
VITE_CANISTER_ID_INTERNET_IDENTITY=rdmx6-jaaaa-aaaaa-aaadq-cai
```
- **Purpose**: The mainnet Internet Identity canister ID
- **Value**: Fixed mainnet canister ID
- **Required**: No (defaults to mainnet ID)

### IC Host Configuration
```bash
VITE_IC_HOST=https://ic0.app
```
- **Purpose**: The Internet Computer mainnet host URL
- **Value**: Mainnet host URL
- **Required**: No (defaults to mainnet URL)

### Identity Provider
```bash
VITE_IDENTITY_PROVIDER=https://identity.ic0.app
```
- **Purpose**: The Internet Identity provider URL
- **Value**: Mainnet identity provider URL
- **Required**: No (defaults to mainnet URL)

## Deployment Setup

### 1. Deploy Backend Canister
```bash
# Build and deploy to mainnet
dfx build --network ic
dfx deploy --network ic --no-wallet

# Get the deployed canister ID
dfx canister id xonora_backend --network ic
```

### 2. Set Environment Variables
Set the following environment variables in your deployment platform:

```bash
VITE_NETWORK=ic
VITE_CANISTER_ID_XONORA_BACKEND=<your-deployed-canister-id>
VITE_CANISTER_ID_INTERNET_IDENTITY=rdmx6-jaaaa-aaaaa-aaadq-cai
VITE_IC_HOST=https://ic0.app
VITE_IDENTITY_PROVIDER=https://identity.ic0.app
```

### 3. Deploy Frontend
```bash
# Build for production
npm run build

# Deploy to your preferred platform (Vercel, Netlify, etc.)
```

## Platform-Specific Setup

### Vercel
1. Go to your project settings
2. Add environment variables in the "Environment Variables" section
3. Deploy your project

### Netlify
1. Go to your site settings
2. Add environment variables in the "Environment variables" section
3. Deploy your site

### IC Frontend
1. Set environment variables in your deployment configuration
2. Deploy using the IC frontend canister

## Troubleshooting

### Missing Canister ID
If you see an error about missing `VITE_CANISTER_ID_XONORA_BACKEND`:
1. Deploy your backend canister first
2. Copy the canister ID from the deployment output
3. Set the environment variable with the correct canister ID

### Authentication Issues
If users can't authenticate:
1. Verify `VITE_IDENTITY_PROVIDER` is set to `https://identity.ic0.app`
2. Ensure `VITE_CANISTER_ID_INTERNET_IDENTITY` is set correctly
3. Check that your backend canister is properly deployed

### Network Issues
If the app can't connect to the IC:
1. Verify `VITE_IC_HOST` is set to `https://ic0.app`
2. Check that your backend canister is accessible
3. Ensure your deployment platform allows HTTPS connections

## Security Notes

- Never commit environment variables to version control
- Use secure environment variable management in your deployment platform
- Regularly rotate any sensitive credentials
- Monitor your canister for unusual activity
