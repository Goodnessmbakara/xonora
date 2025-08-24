#!/bin/bash

# Xonora Backend Deployment to IC Mainnet
echo "🚀 Deploying Xonora Backend to IC Mainnet..."

# Set environment variable to suppress identity warning
export DFX_WARNING=-mainnet_plaintext_identity

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
        echo "1. Add this to Vercel environment variables:"
        echo "   VITE_CANISTER_ID_XONORA_BACKEND=$CANISTER_ID"
        echo "2. Redeploy your frontend on Vercel"
        echo "3. Your live site will now work with the backend!"
    else
        echo "❌ Failed to initialize backend"
    fi
else
    echo "❌ Failed to deploy backend"
fi




