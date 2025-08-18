import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState({
    totalStaked: 0.0,
    totalEarned: 0.0,
    currentAPY: 12.5,
    activeStakes: 3
  });

  const [recentTransactions] = useState([
    { id: 1, type: 'Stake', amount: 0.5, date: '2024-01-15', status: 'Completed' },
    { id: 2, type: 'Earn', amount: 0.023, date: '2024-01-14', status: 'Completed' },
    { id: 3, type: 'Stake', amount: 1.2, date: '2024-01-12', status: 'Completed' },
    { id: 4, type: 'Earn', amount: 0.045, date: '2024-01-11', status: 'Completed' }
  ]);

  useEffect(() => {
    // Fetch portfolio data from backend
    // This would typically call your canister service
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
              <defs>
                <linearGradient id="walletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
              <rect x="20" y="40" width="80" height="40" rx="8" fill="none" stroke="url(#walletGradient)" strokeWidth="3" />
              <circle cx="35" cy="60" r="3" fill="url(#walletGradient)" />
              <path d="M45 55 L75 55 M45 65 L65 65" stroke="url(#walletGradient)" strokeWidth="2" strokeLinecap="round" />
              <path d="M85 50 L95 60 L85 70" stroke="url(#walletGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Please connect your wallet</h1>
          <p className="text-gray-400">You need to be authenticated to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header with Bitcoin Tree Illustration */}
        <div className="mb-8 text-center">
          <div className="mb-6">
            <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto">
              <defs>
                <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
                <linearGradient id="bitcoinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
                <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6b7280" />
                  <stop offset="100%" stopColor="#4b5563" />
                </linearGradient>
              </defs>
              
              {/* Tree trunk */}
              <rect x="95" y="140" width="10" height="40" fill="url(#trunkGradient)" rx="5" />
              
              {/* Main branches */}
              <path d="M100 150 Q70 120 50 100" stroke="url(#trunkGradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M100 150 Q130 120 150 100" stroke="url(#trunkGradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M100 140 Q100 100 100 80" stroke="url(#trunkGradient)" strokeWidth="5" fill="none" strokeLinecap="round" />
              
              {/* Bitcoin symbols as fruits */}
              <g className="animate-float">
                <circle cx="50" cy="100" r="15" fill="url(#bitcoinGradient)" />
                <text x="50" y="107" textAnchor="middle" className="font-bold text-lg" fill="#121212">₿</text>
              </g>
              
              <g className="animate-float" style={{ animationDelay: '0.5s' }}>
                <circle cx="150" cy="100" r="15" fill="url(#bitcoinGradient)" />
                <text x="150" y="107" textAnchor="middle" className="font-bold text-lg" fill="#121212">₿</text>
              </g>
              
              <g className="animate-float" style={{ animationDelay: '1s' }}>
                <circle cx="100" cy="80" r="20" fill="url(#bitcoinGradient)" />
                <text x="100" y="90" textAnchor="middle" className="font-bold text-xl" fill="#121212">₿</text>
              </g>
              
              {/* Leaves */}
              <g className="animate-float" style={{ animationDelay: '0.3s' }}>
                <ellipse cx="80" cy="90" rx="4" ry="8" fill="url(#treeGradient)" transform="rotate(-30 80 90)" />
                <ellipse cx="120" cy="90" rx="4" ry="8" fill="url(#treeGradient)" transform="rotate(30 120 90)" />
              </g>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Your Xonora Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Track your Bitcoin yields and manage your staking positions in real-time.
          </p>
        </div>

        {/* Portfolio Overview with Enhanced Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-xonora-primary-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <svg className="w-8 h-8 text-xonora-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Staked</h3>
              <div className="text-xonora-primary-400 text-xl font-bold">
                {portfolio.totalStaked.toFixed(3)} ckBTC
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-xonora-primary-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <svg className="w-8 h-8 text-xonora-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Earned</h3>
              <div className="text-xonora-primary-400 text-xl font-bold">
                {portfolio.totalEarned.toFixed(3)} ckBTC
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-xonora-primary-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <svg className="w-8 h-8 text-xonora-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Current APY</h3>
              <div className="text-xonora-primary-400 text-xl font-bold">
                {portfolio.currentAPY}%
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-xonora-primary-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <svg className="w-8 h-8 text-xonora-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Active Stakes</h3>
              <div className="text-xonora-primary-400 text-xl font-bold">
                {portfolio.activeStakes}
              </div>
            </div>
          </div>
        </div>

        {/* APY Progress Bar with Enhanced Visualization */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-xonora-primary-400/10 to-transparent rounded-bl-full"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-tech font-bold mb-6 text-xonora-primary-400">
                Yield Performance
              </h2>
              <span className="text-gray-400">{portfolio.currentAPY}% APY</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2 relative">
              <div 
                className="bg-gradient-to-r from-xonora-primary-400 to-xonora-primary-600 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${(portfolio.currentAPY / 15) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Target: 15% APY</p>
          </div>
        </div>

        {/* Quick Actions with Enhanced Icons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-xonora-primary-400/10 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-tech font-bold mb-6 text-xonora-primary-400">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <a
                  href="/staking"
                  className="px-6 py-3 border-2 border-xonora-primary-400 text-xonora-primary-400 rounded-lg font-semibold hover:bg-xonora-primary-400 hover:text-xonora-dark transition-all duration-300 block text-center group"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Stake More ckBTC
                  </div>
                </a>
                <button className="w-full px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold hover:border-xonora-primary-400 hover:text-xonora-primary-400 transition-all duration-300 group">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Withdraw Earnings
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-xonora-primary-400/10 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-tech font-bold mb-6 text-xonora-primary-400">
                Portfolio Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-white">{(portfolio.totalStaked + portfolio.totalEarned).toFixed(3)} ckBTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Earnings:</span>
                  <span className="text-xonora-primary-400">~0.004 ckBTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Earnings:</span>
                  <span className="text-xonora-primary-400">~0.12 ckBTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions with Enhanced Table */}
        <div className="bg-gray-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-xonora-primary-400/10 to-transparent rounded-bl-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-tech font-bold mb-6 text-xonora-primary-400">
              Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                      <td className="py-3 px-4 text-white">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${tx.type === 'Stake' ? 'bg-xonora-primary-400' : 'bg-green-400'}`}></div>
                          {tx.type}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xonora-primary-400 font-mono">{tx.amount} ckBTC</td>
                      <td className="py-3 px-4 text-gray-400">{tx.date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
