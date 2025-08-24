import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import IdentityConnection from '../components/IdentityConnection';
import { canisterService } from '../services/canister';
import type { Portfolio, Stake } from '../services/canister';

interface Transaction {
  id: number;
  type: 'Stake' | 'Unstake' | 'Earn';
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const Dashboard = () => {
  const { isAuthenticated, principal } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [userStakes, setUserStakes] = useState<Stake[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate portfolio metrics from live data
  const portfolioMetrics = {
    totalStaked: portfolio ? Number(portfolio.totalStaked) / 100_000_000 : 0,
    totalEarned: portfolio ? Number(portfolio.totalEarned) / 100_000_000 : 0,
    currentAPY: 12.5, // This would come from pool data
    activeStakes: userStakes.filter(stake => stake.isActive).length
  };

  // Load portfolio data from backend
  const loadData = async () => {
    if (!isAuthenticated || !principal) return;

    try {
      setLoadingData(true);
      setError(null);
      
      console.log('Loading dashboard data for principal:', principal);
      
      // Load portfolio data
      const portfolioResult = await canisterService.getPortfolio(principal);
      if ('ok' in portfolioResult) {
        console.log('Loaded portfolio:', portfolioResult.ok);
        setPortfolio(portfolioResult.ok);
      } else {
        console.warn('Failed to load portfolio:', portfolioResult.err);
        setPortfolio(null);
      }
      
      // Load user stakes
      try {
        const stakesData = await canisterService.getUserStakes(principal);
        console.log('Loaded user stakes:', stakesData);
        setUserStakes(stakesData);
        
        // Generate recent transactions from stakes
        const transactions: Transaction[] = stakesData.map((stake, index) => ({
          id: index + 1,
          type: 'Stake' as const,
          amount: Number(stake.amount) / 100_000_000,
          date: new Date(Number(stake.startTime) / 1_000_000).toLocaleDateString(),
          status: stake.isActive ? 'Completed' as const : 'Completed' as const
        }));
        setRecentTransactions(transactions);
      } catch (err) {
        console.warn('Failed to load user stakes:', err);
        setUserStakes([]);
        setRecentTransactions([]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      
      // Check if this is a production environment issue
      if (import.meta.env.PROD && (errorMessage.includes('signature') || errorMessage.includes('certificate') || errorMessage.includes('Invalid canister'))) {
        setError('🚧 Backend Not Yet Deployed: The Xonora backend canister is not yet deployed to IC mainnet. For testing, please use the local development version at localhost:8080');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoadingData(false);
    }
  };

  // Load data on component mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, principal]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-xonora-light mb-4 font-tech">Dashboard Access</h1>
                          <p className="text-xonora-secondary-400 font-body">Connect with Internet Identity to view your dashboard and manage your Bitcoin yield farming positions.</p>
          </div>
          <IdentityConnection showFullInterface={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 text-xonora-secondary-400 hover:text-xonora-primary-400 transition-colors duration-300 font-body"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Header with Bitcoin Tree Illustration */}
        <div className="mb-8 text-center">
          <div className="mb-6">
            <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto">
              <defs>
                <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--xonora-primary-400))" />
                  <stop offset="100%" stopColor="hsl(var(--xonora-accent-400))" />
                </linearGradient>
                <linearGradient id="bitcoinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--xonora-primary-400))" />
                  <stop offset="100%" stopColor="hsl(var(--xonora-accent-400))" />
                </linearGradient>
                <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--xonora-secondary-600))" />
                  <stop offset="100%" stopColor="hsl(var(--xonora-secondary-700))" />
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
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-xonora-primary-400 to-xonora-accent-400 bg-clip-text text-transparent font-tech">
            Your Xonora Dashboard
          </h1>
          <p className="text-xl text-xonora-secondary-400 max-w-2xl mx-auto font-body">
            Track your Bitcoin yields and manage your staking positions in real-time.
          </p>
        </div>

        {/* Loading State */}
        {loadingData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-xonora-secondary-700 rounded-lg p-8 text-center">
              <div className="text-xonora-primary-400 mb-4">Loading your portfolio...</div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-xonora-primary-400 mx-auto"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="text-red-400 mb-2">Error: {error}</div>
            <div className="space-x-2">
              <button 
                onClick={loadData}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-xonora-secondary-600 text-white rounded hover:bg-xonora-secondary-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}

        {/* Portfolio Overview with Enhanced Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-xonora-secondary-700 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-xonora-primary-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <svg className="w-8 h-8 text-xonora-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xonora-secondary-400 text-sm font-medium mb-2">Total Staked</h3>
              <div className="text-xonora-primary-400 text-xl font-bold">
                {portfolioMetrics.totalStaked.toFixed(3)} ckBTC
              </div>
            </div>
          </div>
          
          <div className="bg-xonora-secondary-700 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300"> 
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-xonora-primary-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <svg className="w-8 h-8 text-xonora-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xonora-secondary-400 text-sm font-medium mb-2">Total Earned</h3>
              <div className="text-xonora-primary-400 text-xl font-bold">
                {portfolioMetrics.totalEarned.toFixed(3)} ckBTC
              </div>
            </div>
          </div>
          
          <div className="bg-xonora-secondary-700 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-xonora-primary-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <svg className="w-8 h-8 text-xonora-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xonora-secondary-400 text-sm font-medium mb-2">Current APY</h3>
              <div className="text-xonora-primary-400 text-xl font-bold">
                {portfolioMetrics.currentAPY}%
              </div>
            </div>
          </div>
          
          <div className="bg-xonora-secondary-700 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-xonora-primary-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <svg className="w-8 h-8 text-xonora-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xonora-secondary-400 text-sm font-medium mb-2">Active Stakes</h3>
              <div className="text-xonora-primary-400 text-xl font-bold">
                {portfolioMetrics.activeStakes}
              </div>
            </div>
          </div>
        </div>

        {/* APY Progress Bar with Enhanced Visualization */}
        <div className="bg-xonora-secondary-700 rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-xonora-primary-400/10 to-transparent rounded-bl-full"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-tech font-bold mb-6 text-xonora-primary-400">
                Yield Performance
              </h2>
              <span className="text-xonora-secondary-400">{portfolioMetrics.currentAPY}% APY</span>
            </div>
            <div className="w-full bg-xonora-secondary-600 rounded-full h-3 mb-2 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-xonora-amber-400 to-xonora-amber-600 h-3 rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${Math.min((portfolioMetrics.currentAPY / 15) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-xonora-secondary-400 text-sm">Target: 15% APY</p>
          </div>
        </div>

        {/* Quick Actions with Enhanced Icons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-xonora-secondary-700 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
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
                <button className="w-full px-6 py-3 border-2 border-xonora-secondary-500 text-xonora-secondary-300 rounded-lg font-semibold hover:border-xonora-primary-400 hover:text-xonora-primary-400 transition-all duration-300 group">
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

          <div className="bg-xonora-secondary-700 rounded-xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-xonora-primary-400/10 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-tech font-bold mb-6 text-xonora-primary-400">
                Portfolio Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xonora-secondary-400">Total Value:</span>
                  <span className="text-xonora-light">{(portfolioMetrics.totalStaked + portfolioMetrics.totalEarned).toFixed(3)} ckBTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xonora-secondary-400">Daily Earnings:</span>
                  <span className="text-xonora-primary-400">~0.004 ckBTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xonora-secondary-400">Monthly Earnings:</span>
                  <span className="text-xonora-primary-400">~0.12 ckBTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions with Enhanced Table */}
        <div className="bg-xonora-secondary-700 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-xonora-primary-400/10 to-transparent rounded-bl-full"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-tech font-bold mb-6 text-xonora-primary-400">
              Recent Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-xonora-secondary-600">
                    <th className="text-left py-3 px-4 text-xonora-secondary-400 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-xonora-secondary-400 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-xonora-secondary-400 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-xonora-secondary-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xonora-secondary-400">
                        <div className="text-center">
                          <p>No transactions found.</p>
                          <p className="text-sm text-xonora-secondary-500 mt-1">Start staking to see your transaction history.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-xonora-secondary-600 hover:bg-xonora-secondary-600/50 transition-colors duration-200">
                      <td className="py-3 px-4 text-xonora-light">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${tx.type === 'Stake' ? 'bg-xonora-primary-400' : 'bg-success'}`}></div>
                          {tx.type}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xonora-primary-400 font-mono">{tx.amount} ckBTC</td>
                      <td className="py-3 px-4 text-xonora-secondary-400">{tx.date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-xonora-accent-500/20 text-xonora-accent-400 rounded-full text-xs">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                  )}
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
