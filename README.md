# 🚀 YieldBTC - Bitcoin Yield Farming on ICP

A decentralized yield farming platform built on the Internet Computer (ICP) that allows users to stake ckBTC (wrapped Bitcoin) and earn yields through AI-optimized strategies.

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
- `yieldbtc_backend`: Core business logic and state management
- `yieldbtc_frontend`: Deployed React application
- `llm`: AI-powered yield optimization (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- DFX (Internet Computer SDK)
- Mops (Motoko package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Goodnessmbakara/yieldbtc.git
   cd yieldbtc
   ```

2. **Install dependencies**
   ```bash
   npm install
   mops install
   ```

3. **Start local development**
   ```bash
   # Terminal 1: Start dfx
   dfx start --clean
   
   # Terminal 2: Deploy canisters
   dfx deploy
   
   # Terminal 3: Start frontend dev server
   npm run dev
   ```

4. **Initialize the system**
   ```bash
   dfx canister call yieldbtc_backend initialize
   ```

5. **Build for production**
   ```bash
   npm run build:icp
   dfx deploy --network ic
   ```

## 📁 Project Structure

```
yieldbtc/
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

The backend is written in Motoko and includes:

- **Stake Management**: Create, view, and unstake positions
- **Pool Management**: Multiple yield pools with different risk profiles
- **Portfolio Tracking**: User portfolio management and analytics
- **Yield Calculations**: Real-time APY and earnings calculations

### Frontend Development

The frontend provides:

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
npm run dev
```

### Testnet Deployment
```bash
dfx deploy --network ic_testnet
```

### Mainnet Deployment
```bash
dfx deploy --network ic
```

## 📈 Roadmap

- [ ] **Phase 1**: Basic staking functionality ✅
- [ ] **Phase 2**: Real ckBTC integration
- [ ] **Phase 3**: AI-powered yield optimization
- [ ] **Phase 4**: Advanced analytics and reporting
- [ ] **Phase 5**: Mobile app development
- [ ] **Phase 6**: Cross-chain integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
