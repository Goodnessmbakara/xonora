#!/bin/bash

# Xonora Backend Deployment to IC Mainnet
echo "🚀 Deploying Xonora Backend to IC Mainnet..."

# Set environment variable to suppress identity warning
export DFX_WARNING=-mainnet_plaintext_identity

# Validate environment variables
echo "🔍 Validating environment variables..."
if [ -z "$VITE_CANISTER_ID_XONORA_BACKEND" ]; then
    echo "⚠️  VITE_CANISTER_ID_XONORA_BACKEND is not set (this is expected for first deployment)"
else
    echo "✅ VITE_CANISTER_ID_XONORA_BACKEND is set: $VITE_CANISTER_ID_XONORA_BACKEND"
fi

if [ "$VITE_NETWORK" != "ic" ]; then
    echo "⚠️  VITE_NETWORK should be set to 'ic' for production deployment"
fi

# Check cycles balance
echo "💰 Checking cycles balance..."
dfx cycles balance --network ic

# Check if we have enough cycles
CYCLES=$(dfx cycles balance --network ic | grep -oE '[0-9]+\.[0-9]+')
if (( $(echo "$CYCLES < 0.1" | bc -l) )); then
    echo "❌ Insufficient cycles. You need at least 0.1 TC to deploy."
    echo "💡 Get free cycles from: https://faucet.dfinity.org/"
    exit 1
fi

# Deploy backend canister
echo "📦 Deploying backend canister..."
dfx deploy xonora_backend --network ic

if [ $? -eq 0 ]; then
    echo "✅ Backend deployed successfully!"
    
    # Get the canister ID
    CANISTER_ID=$(dfx canister id xonora_backend --network ic)
    echo "🆔 Backend Canister ID: $CANISTER_ID"
    
    # Initialize the backend
    echo "🔧 Initializing backend..."
    dfx canister call xonora_backend initialize --network ic
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend initialized successfully!"
        echo ""
        echo "🎉 DEPLOYMENT COMPLETE!"
        echo "📋 Next steps:"
        echo "1. Set these environment variables in your deployment platform:"
        echo "   VITE_CANISTER_ID_XONORA_BACKEND=$CANISTER_ID"
        echo "   VITE_NETWORK=ic"
        echo "   VITE_IC_HOST=https://ic0.app"
        echo "2. Verify canister accessibility:"
        echo "   dfx canister call $CANISTER_ID whoami --network ic"
        echo "3. Build and deploy your frontend with the new environment variables"
        echo "4. Your live site will now work with the backend!"
    else
        echo "❌ Failed to initialize backend"
    fi
else
    echo "❌ Failed to deploy backend"
fi




