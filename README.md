# Xonora - Internet Computer Staking Platform

## 🚀 Live on Mainnet

**Xonora is now live on the Internet Computer mainnet!**

- **🌐 Live Application**: https://dg6uy-tqaaa-aaaap-qqcka-cai.icp0.io/
- **📊 Backend API**: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=dtzfv-syaaa-aaaap-qqcjq-cai
- **📧 Contact**: xonora25@gmail.com
- **🐦 Twitter**: @Xonora_btc

## 🎯 About Xonora

Xonora is a decentralized staking platform built on the Internet Computer (ICP) that allows users to stake their assets and earn yields through various staking pools. The platform features a modern, user-friendly interface with real-time yield calculations and portfolio management.

## ✨ Features

- **🔐 Secure Authentication**: Internet Identity integration
- **📈 Multiple Staking Pools**: Stable (5%), Balanced (10%), Aggressive (15%) APY
- **💼 Portfolio Dashboard**: Real-time portfolio tracking and metrics
- **🎨 Modern UI**: Responsive design with brand-consistent styling
- **⚡ Real-time Data**: Live backend integration for up-to-date information
- **🛡️ Security**: HTTPS enforced with proper CORS and certificate validation

## 🏗️ Architecture

### Backend (Motoko)
- **Canister ID**: `dtzfv-syaaa-aaaap-qqcjq-cai`
- **Language**: Motoko
- **Features**: Staking pools, user management, yield calculations

### Frontend (React + TypeScript)
- **Canister ID**: `dg6uy-tqaaa-aaaap-qqcka-cai`
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Authentication**: Internet Identity integration

## 🚀 Quick Start

### For Users
1. Visit the live application: https://dg6uy-tqaaa-aaaap-qqcka-cai.icp0.io/
2. Connect with Internet Identity
3. Choose a staking pool
4. Start earning yields!

### For Developers

#### Prerequisites
- Node.js 18+ and npm
- DFX (DFINITY Canister SDK)
- Internet Identity account

#### Local Development
```bash
# Clone the repository
git clone https://github.com/Goodnessmbakara/xonora.git
cd xonora

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

#### Environment Configuration
Create a `.env.local` file with:
```bash
VITE_CANISTER_ID_XONORA_BACKEND=dtzfv-syaaa-aaaap-qqcjq-cai
VITE_DFX_NETWORK=ic
VITE_IC_HOST=https://ic0.app
VITE_IDENTITY_PROVIDER=https://identity.ic0.app
```

## 📚 Documentation

- **[Environment Setup](ENVIRONMENT.md)**: Complete environment configuration guide
- **[Testing Guide](TESTING.md)**: Comprehensive testing procedures and results
- **[Deployment Guide](DEPLOYMENT.md)**: Step-by-step deployment instructions
- **[Deployment Summary](DEPLOYMENT_SUMMARY.md)**: Complete deployment overview

## 🔧 Development

### Project Structure
```
xonora/
├── src/
│   ├── backend/          # Motoko backend canister
│   ├── components/       # React components
│   ├── pages/           # Application pages
│   ├── services/        # Backend service layer
│   ├── contexts/        # React contexts
│   └── utils/           # Utility functions
├── public/              # Static assets
└── docs/               # Documentation
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🛡️ Security

- **Secure Identity**: Encrypted mainnet identity for deployment
- **HTTPS**: All connections encrypted
- **Input Validation**: Comprehensive backend validation
- **Error Handling**: Secure error responses
- **CORS**: Proper cross-origin configuration

## 📊 Performance

### Backend
- **Memory**: 190 Bytes
- **Cycles**: 99.6B remaining
- **Response Time**: < 100ms

### Frontend
- **Bundle Size**: 681KB (gzipped: 210KB)
- **Load Time**: < 2 seconds
- **Memory**: 5.4MB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Email**: xonora25@gmail.com
- **Twitter**: @Xonora_btc
- **Issues**: [GitHub Issues](https://github.com/Goodnessmbakara/xonora/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Status

**✅ LIVE ON MAINNET** - Ready for users to start staking and earning yields!

---

**Built with ❤️ on the Internet Computer**
