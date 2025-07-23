# 🚀 Xonora - Bitcoin Yield Farming on ICP

A decentralized yield farming platform built on the Internet Computer (ICP) that allows users to stake ckBTC (wrapped Bitcoin) and earn yields through AI-optimized strategies.

---

## 🛠️ Quick Start for Local Development

### Prerequisites
- Node.js 18+ and npm
- DFX (Internet Computer SDK) - Version 0.27.0
- Mops (Motoko package manager)

### 1. Clone and Install
```bash
git clone https://github.com/Goodnessmbakara/xonora.git
cd xonora
npm install
mops install
```

### 2. Start the Local ICP Replica
```bash
dfx start --clean --background
```

### 3. Deploy All Canisters (Backend, Frontend, Internet Identity)
```bash
dfx deploy
```

- **Canister IDs:**
  - Backend: `xonora_backend` (will be generated on deployment)
  - Frontend: `xonora_frontend` (will be generated on deployment)
  - Internet Identity: `internet_identity` (will be generated on deployment)

### 4. Initialize the Backend System
```bash
dfx canister call xonora_backend initialize
```

### 5. Start the Frontend (on 127.0.0.1)
```bash
npm run dev -- --host 127.0.0.1
```
- Open [http://127.0.0.1:8080](http://127.0.0.1:8080) (or the port Vite prints)

### 6. Internet Identity (Local Auth)
- The app uses a local Internet Identity canister for authentication.
- When prompted to log in, a popup will use:
  - `http://127.0.0.1:8000?canisterId=ulvla-h7777-77774-qaacq-cai`
- You can create a new identity or use an existing one.

### 7. Troubleshooting
- **Auth stuck on "Loading..."?**
  - Make sure you use `127.0.0.1` (not `localhost`) everywhere.
  - Make sure all canisters are deployed and running.
  - Check browser console for CORS or network errors.
- **Internet Identity errors?**
  - Ensure you have both `internet_identity.did` and `internet_identity.wasm` in `src/declarations/internet_identity/`.
  - If you see "Canister not found", make sure you deployed II and are using the correct canister ID.
- **Canister import errors?**
  - Run `dfx generate` to regenerate canister bindings if you change the backend interface.

---

## 🌟 Features

- **ckBTC Staking**: Stake your Bitcoin on ICP with multiple risk profiles
- **Yield Optimization**: AI-powered strategies for maximum returns
- **Real-time Analytics**: Track your portfolio performance and yields
- **Internet Identity**: Secure authentication using ICP's native identity system
- **Multiple Risk Profiles**: Choose from Stable (5% APY), Balanced (10% APY), or Aggressive (15% APY)
- **Portfolio Management**: Comprehensive dashboard for managing your stakes

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **React Query** for data fetching
- **React Router** for navigation

### Backend
- **Motoko** canisters on ICP
- **Stable storage** for persistent data
- **Real-time yield calculations**
- **Portfolio management system**

### Key Canisters
- `xonora_backend`: Core business logic and state management
- `xonora_frontend`: Deployed React application
- `internet_identity`: Local authentication (required for local dev)

## 📁 Project Structure

```
xonora/
├── src/
│   ├── backend/                 # Motoko canisters
│   │   └── main.mo             # Main backend logic
│   ├── components/             # React components
│   ├── pages/                  # Page components
│   ├── services/               # Canister service layer
│   └── declarations/           # Auto-generated canister interfaces
├── dfx.json                    # ICP project configuration
├── mops.toml                   # Motoko dependencies
└── package.json                # Frontend dependencies
```

## 🔧 Development

### Backend Development
- **Stake Management**: Create, view, and unstake positions
- **Pool Management**: Multiple yield pools with different risk profiles
- **Portfolio Tracking**: User portfolio management and analytics
- **Yield Calculations**: Real-time APY and earnings calculations

### Frontend Development
- **Landing Page**: Project introduction and features
- **Staking Interface**: Connect wallet and stake ckBTC
- **Dashboard**: Portfolio overview and analytics
- **Responsive Design**: Works on desktop and mobile

### Key Components
- `CanisterService`: Handles all backend communication
- `StakingPage`: Main staking interface
- `Dashboard`: Portfolio management
- `Header`: Navigation and wallet connection

## 🛡️ Security Features
- **Internet Identity Authentication**: Secure user authentication
- **Input Validation**: All user inputs are validated
- **Access Control**: Proper authorization checks
- **Stable Storage**: Persistent data storage on ICP

## 🚀 ICP Tech Features

### Currently Integrated
- ✅ **Internet Identity**: Passwordless authentication using ICP's native identity system
- ✅ **Canister Smart Contracts**: Decentralized backend logic on ICP
- ✅ **Stable Storage**: Persistent data storage across canister upgrades

### Potential Integrations for Xonora

#### 🔐 **Threshold ECDSA** (Recommended for DeFi)
- **Use Case**: Multi-signature wallet for yield farming operations
- **Benefits**: Enhanced security for large staking operations, institutional-grade custody
- **Implementation**: Use for pool management and emergency withdrawals

#### 🔗 **Chain Fusion** (Future Enhancement)
- **Use Case**: Cross-chain yield farming beyond just Bitcoin
- **Benefits**: Access to yields from Ethereum, Solana, and other chains
- **Implementation**: Integrate with EVM and Solana subnets on ICP

#### 🔑 **VetKeys** (Advanced Security)
- **Use Case**: Verifiable credentials for KYC/AML compliance
- **Benefits**: Regulatory compliance while maintaining privacy
- **Implementation**: Optional KYC for institutional users

#### ⛽ **Reverse Gas Fee Model** (User Experience)
- **Use Case**: Users don't pay gas fees for transactions
- **Benefits**: Better UX, no wallet setup required
- **Implementation**: Already partially implemented with Internet Identity

#### 🤖 **AI/LLM Integration** (Yield Optimization)
- **Use Case**: AI-powered yield strategy recommendations
- **Benefits**: Optimized returns based on market conditions
- **Implementation**: Local LLM or cloud APIs via HTTP outcalls

## 📊 API Reference

### Backend Canister Methods
```motoko
// Initialize the system
initialize() -> Result.Result<Text, Text>

// Stake ckBTC
stake(amount: Amount, poolId: PoolId) -> Result.Result<StakeId, Text>

// Unstake ckBTC
unstake(stakeId: StakeId) -> Result.Result<Amount, Text>

// Get all pools
getPools() -> [Pool]

// Get user portfolio
getPortfolio(userId: UserId) -> Result.Result<Portfolio, Text>

// Get user stakes
getUserStakes(userId: UserId) -> [Stake]
```

## 🚀 Deployment

### Local Development
```bash
dfx start --clean
dfx deploy
npm run dev -- --host 127.0.0.1
```

### Testnet Deployment
```bash
dfx deploy --network ic_testnet
```

### Mainnet Deployment
```bash
dfx deploy --network ic
```

## 🤖 LLM Implementation Options

### Option 1: Free Local LLM (Recommended for Hackathon)
- **Cost**: $0
- **Setup**: Use Ollama with local models (llama3.1:8b)
- **Pros**: No costs, full control, works offline
- **Cons**: Requires local setup, limited model capabilities
- **Implementation**: Follow the [Motoko Vibe Template LLM guide](https://github.com/pt-icp-hub/IC-Vibe-Coding-Template-Motoko#4-running-ollama)

### Option 2: Cloud LLM APIs
- Use OpenAI, Google, or other cloud LLM APIs (cost per call)
- Update the backend to call the cloud API from Motoko

### Option 3: Skip LLM for MVP
- Recommended for hackathon if you want to focus on core DeFi features

---

## 🧑‍💻 Contributing
- Fork the repo and create a feature branch
- Make your changes and submit a pull request
- See the issues tab for open tasks

## �� License
MIT

## 🆘 Support

- **Documentation**: [ICP Docs](https://internetcomputer.org/docs)
- **Community**: [ICP Discord](https://discord.gg/icp)
- **Issues**: [GitHub Issues](https://github.com/Goodnessmbakara/yieldbtc/issues)

## 🏆 Hackathon Submission

This project is being developed for the **WCHL Bitcoin DeFi Track** hackathon.

### Submission Requirements Met:
- ✅ ICP project with dfx.json
- ✅ Multiple commits showing development progress
- ✅ Feature-rich yield farming platform
- ✅ Working dApp (ready for mainnet deployment)
- ✅ Open source with MIT license
- ✅ Comprehensive documentation

### Demo Features:
- Bitcoin-themed yield farming interface
- Multiple risk profile options
- Real-time portfolio tracking
- Internet Identity authentication
- Responsive design for all devices

---

**Built with ❤️ for the ICP ecosystem**
