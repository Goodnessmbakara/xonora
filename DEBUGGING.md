# Debugging Guide for Xonora Authentication Issues

## Overview

This guide helps troubleshoot authentication and actor initialization issues in the Xonora application.

## Common Issues and Solutions

### 1. "Actor not initialized" Error

**Symptoms:**
- Error message: "Actor not initialized"
- Console shows: `{isAuth: false, hasActor: false}`
- Pools show "No pools available"

**Root Cause:**
The frontend cannot create an authenticated actor to communicate with the backend canister.

**Debugging Steps:**

#### Step 1: Check Browser Console
Open the browser developer console and look for these log messages:

```
🚀 Starting canister service initialization...
✅ Using deployed canister configuration for mainnet
🔗 Backend Canister: dtzfv-syaaa-aaaap-qqcjq-cai
🌐 Network: ic
🏠 IC Host: https://ic0.app
🔐 Identity Provider: https://identity.ic0.app
🔐 Creating AuthClient...
✅ AuthClient created successfully
🔍 Checking authentication status...
🔐 Authentication status: false
👤 User is not authenticated, ready for login
```

#### Step 2: Verify Configuration
Ensure the configuration is correct:

```typescript
// Expected configuration
Backend Canister: dtzfv-syaaa-aaaap-qqcjq-cai
Network: ic
IC Host: https://ic0.app
Identity Provider: https://identity.ic0.app
```

#### Step 3: Test Backend Connectivity
Verify the backend canister is accessible:

```bash
# Test backend directly
dfx canister call dtzfv-syaaa-aaaap-qqcjq-cai getSystemInfo --network ic
```

### 2. Authentication Flow Issues

**Symptoms:**
- Login button doesn't work
- Internet Identity popup doesn't appear
- Authentication fails silently

**Debugging Steps:**

#### Step 1: Check Internet Identity
1. Visit https://identity.ic0.app
2. Ensure you can create or access an identity
3. Check if your browser supports the required features

#### Step 2: Browser Compatibility
Ensure your browser supports:
- Web Crypto API
- IndexedDB
- Modern JavaScript features

#### Step 3: Network Issues
Check for:
- CORS errors in console
- Network connectivity to ic0.app
- Firewall or proxy blocking connections

### 3. Actor Creation Failures

**Symptoms:**
- Error during actor setup
- "Failed to load data" errors
- Backend calls failing

**Debugging Steps:**

#### Step 1: Check Actor Setup Logs
Look for these messages in console:

```
🔧 Setting up actor with identity...
👤 Identity principal: [principal-id]
🏠 Creating agent with host: https://ic0.app
✅ Agent created successfully
🔗 Using backend canister ID: dtzfv-syaaa-aaaap-qqcjq-cai
🎭 Creating actor...
✅ Actor created successfully
🧪 Testing actor connection...
✅ Actor connection test successful: [system-info]
```

#### Step 2: Verify Canister Status
Check if the backend canister is running:

```bash
dfx canister status dtzfv-syaaa-aaaap-qqcjq-cai --network ic
```

#### Step 3: Test Backend Functions
Test backend functions directly:

```bash
# Test system info
dfx canister call dtzfv-syaaa-aaaap-qqcjq-cai getSystemInfo --network ic

# Test pools
dfx canister call dtzfv-syaaa-aaaap-qqcjq-cai getPools --network ic
```

## Debugging Tools

### 1. Browser Developer Tools

#### Console Logs
The application provides detailed console logs with emojis for easy identification:

- 🚀 Initialization steps
- 🔐 Authentication steps
- 🔧 Actor setup steps
- ✅ Success messages
- ❌ Error messages
- ⚠️ Warning messages

#### Network Tab
Check for:
- Failed requests to ic0.app
- CORS errors
- Authentication requests

#### Application Tab
Check for:
- IndexedDB storage
- Local storage
- Session storage

### 2. Command Line Tools

#### DFX Commands
```bash
# Check canister status
dfx canister status dtzfv-syaaa-aaaap-qqcjq-cai --network ic

# Test backend functions
dfx canister call dtzfv-syaaa-aaaap-qqcjq-cai getSystemInfo --network ic

# Check cycles balance
dfx canister info dtzfv-syaaa-aaaap-qqcjq-cai --network ic
```

#### Curl Commands
```bash
# Test frontend accessibility
curl -I https://dg6uy-tqaaa-aaaap-qqcka-cai.icp0.io/

# Test backend Candid interface
curl -I "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=dtzfv-syaaa-aaaap-qqcjq-cai"
```

## Common Solutions

### 1. Clear Browser Data
If authentication is stuck:
1. Clear browser cache and cookies
2. Clear IndexedDB storage
3. Refresh the page

### 2. Use Incognito Mode
Test in incognito/private browsing mode to rule out browser extensions or cached data.

### 3. Check Network
Ensure you can access:
- https://ic0.app
- https://identity.ic0.app
- https://dg6uy-tqaaa-aaaap-qqcka-cai.icp0.io/

### 4. Browser Extensions
Disable browser extensions that might interfere with:
- Web Crypto API
- IndexedDB
- Network requests

## Error Messages and Meanings

### "Actor not initialized"
- **Cause**: No authenticated actor available
- **Solution**: Complete Internet Identity authentication

### "Auth client not initialized"
- **Cause**: AuthClient creation failed
- **Solution**: Check browser compatibility and network

### "Failed to load data"
- **Cause**: Backend call failed
- **Solution**: Verify backend canister is running

### "Network error"
- **Cause**: Cannot connect to IC network
- **Solution**: Check internet connection and firewall

### "Canister not found"
- **Cause**: Invalid canister ID
- **Solution**: Verify canister deployment

## Getting Help

If you're still experiencing issues:

1. **Check the console logs** for detailed error messages
2. **Verify the backend canister** is running and accessible
3. **Test with a different browser** to rule out browser-specific issues
4. **Check network connectivity** to IC endpoints
5. **Review the configuration** to ensure canister IDs are correct

## Contact Information

- **Email**: xonora25@gmail.com
- **Twitter**: @Xonora_btc
- **GitHub Issues**: [Create an issue](https://github.com/Goodnessmbakara/xonora/issues)

## Live Application Status

- **Frontend**: https://dg6uy-tqaaa-aaaap-qqcka-cai.icp0.io/
- **Backend**: `dtzfv-syaaa-aaaap-qqcjq-cai`
- **Status**: ✅ Running on mainnet
