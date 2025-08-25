#!/bin/bash

# Xonora Mainnet Deployment Script
# This script deploys the frontend to IC mainnet

set -e

echo "🚀 Starting Xonora mainnet deployment..."

# Check if backend canister ID is set
if [ -z "$VITE_CANISTER_ID_XONORA_BACKEND" ]; then
    echo "✅ Using deployed backend canister ID: dtzfv-syaaa-aaaap-qqcjq-cai"
    export VITE_CANISTER_ID_XONORA_BACKEND=dtzfv-syaaa-aaaap-qqcjq-cai
else
    echo "✅ Backend canister ID already set: $VITE_CANISTER_ID_XONORA_BACKEND"
fi

# Set network to mainnet
export VITE_DFX_NETWORK=ic
export VITE_IC_HOST=https://ic0.app
export VITE_IDENTITY_PROVIDER=https://identity.ic0.app

echo "🌐 Network configuration:"
echo "   - Network: $VITE_DFX_NETWORK"
echo "   - IC Host: $VITE_IC_HOST"
echo "   - Identity Provider: $VITE_IDENTITY_PROVIDER"

# Verify backend canister is running
echo "🔍 Verifying backend canister status..."
if ! dfx canister status dtzfv-syaaa-aaaap-qqcjq-cai --network ic > /dev/null 2>&1; then
    echo "❌ Error: Backend canister is not accessible"
    echo "   Please ensure the backend is deployed and running"
    exit 1
fi

echo "✅ Backend canister is accessible"

# Build the frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Frontend built successfully"

# Deploy to IC
echo "🚀 Deploying to IC mainnet..."
dfx deploy xonora_frontend --network ic

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo "✅ Deployment successful!"

# Get the frontend canister ID
FRONTEND_CANISTER_ID=$(dfx canister id xonora_frontend --network ic)
echo "🎉 Frontend deployed to: $FRONTEND_CANISTER_ID"

# Display access URLs
echo ""
echo "🌐 Access URLs:"
echo "   - Frontend: https://$FRONTEND_CANISTER_ID.icp0.io"
echo "   - Backend Candid: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=dtzfv-syaaa-aaaap-qqcjq-cai"
echo ""
echo "🔧 Environment Variables Used:"
echo "   - VITE_CANISTER_ID_XONORA_BACKEND=$VITE_CANISTER_ID_XONORA_BACKEND"
echo "   - VITE_DFX_NETWORK=$VITE_DFX_NETWORK"
echo "   - VITE_IC_HOST=$VITE_IC_HOST"
echo "   - VITE_IDENTITY_PROVIDER=$VITE_IDENTITY_PROVIDER"
echo ""
echo "🎯 Next Steps:"
echo "   1. Test the application at: https://$FRONTEND_CANISTER_ID.icp0.io"
echo "   2. Verify authentication works with Internet Identity"
echo "   3. Test staking functionality"
echo "   4. Monitor canister cycles and performance"
echo ""
echo "✅ Deployment complete!"




