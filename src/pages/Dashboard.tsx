
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  // Mock data
  const portfolioData = {
    stakedAmount: 0.01,
    projectedAPY: 10,
    dailyYield: 0.0000274,
    totalValue: 600 // USD
  };

  const allocations = [
    { name: 'Lending Pools', percentage: 50, color: '#34C759' },
    { name: 'Liquidity Mining', percentage: 50, color: '#6B7280' }
  ];

  const recentTransactions = [
    { type: 'Stake', amount: 0.01, date: '2024-01-15', status: 'Completed' },
    { type: 'Yield', amount: 0.0000274, date: '2024-01-14', status: 'Completed' },
    { type: 'Yield', amount: 0.0000274, date: '2024-01-13', status: 'Completed' },
    { type: 'Yield', amount: 0.0000274, date: '2024-01-12', status: 'Completed' },
    { type: 'Yield', amount: 0.0000274, date: '2024-01-11', status: 'Completed' }
  ];

  return (
    <div className="min-h-screen bg-yield-dark text-yield-light">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20"></div>
          
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <svg viewBox="0 0 120 120" className="w-24 h-24">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34C759" />
                      <stop offset="100%" stopColor="#22A447" />
                    </linearGradient>
                  </defs>
                  <path d="M20 80 L35 60 L50 70 L65 40 L80 50 L95 20" stroke="url(#chartGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="35" cy="60" r="3" fill="url(#chartGradient)" />
                  <circle cx="65" cy="40" r="3" fill="url(#chartGradient)" />
                  <circle cx="95" cy="20" r="3" fill="url(#chartGradient)" />
                  <path d="M90 20 L95 20 L95 25" stroke="url(#chartGradient)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-tech font-bold mb-4">
                Your <span className="text-gradient">YieldBTC</span> Dashboard
              </h1>
              <p className="text-xl text-yield-gray-400 max-w-2xl mx-auto">
                Track your yields and manage your stakes with real-time insights and analytics.
              </p>
            </div>

            {/* Portfolio Overview */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Portfolio Card */}
              <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
                <h2 className="text-2xl font-tech font-bold mb-6 text-yield-green-400">
                  Portfolio Overview
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-tech font-bold text-yield-green-400 mb-2">
                      {portfolioData.stakedAmount} ckBTC
                    </div>
                    <div className="text-sm text-yield-gray-400">Staked Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-tech font-bold text-yield-green-400 mb-2">
                      {portfolioData.projectedAPY}%
                    </div>
                    <div className="text-sm text-yield-gray-400">Projected APY</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-tech font-bold text-yield-green-400 mb-2">
                      {portfolioData.dailyYield.toFixed(7)}
                    </div>
                    <div className="text-sm text-yield-gray-400">Est. Daily Yield</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-yield-gray-400">Portfolio Value</span>
                    <span className="text-yield-light font-semibold">${portfolioData.totalValue}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yield-green-400 to-yield-green-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/staking" className="btn-primary text-center">
                    Add More ckBTC
                  </a>
                  <button className="px-6 py-3 border-2 border-yield-green-400 text-yield-green-400 rounded-lg font-semibold hover:bg-yield-green-400 hover:text-yield-dark transition-all duration-300">
                    Unstake
                  </button>
                </div>
              </div>

              {/* Pool Allocations */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-xl font-tech font-bold mb-6 text-yield-green-400">
                  Pool Allocations
                </h3>
                
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="8" />
                    {/* Lending Pools */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#34C759" 
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.5} ${2 * Math.PI * 40}`}
                      strokeLinecap="round"
                    />
                    {/* Liquidity Mining */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#6B7280" 
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.5} ${2 * Math.PI * 40}`}
                      strokeDashoffset={`-${2 * Math.PI * 40 * 0.5}`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="space-y-4">
                  {allocations.map((allocation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: allocation.color }}
                        ></div>
                        <span className="text-yield-gray-400 text-sm">{allocation.name}</span>
                      </div>
                      <span className="font-semibold">{allocation.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-tech font-bold mb-6 text-yield-green-400">
                Recent Transactions
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-yield-gray-600">
                      <th className="text-left py-3 text-yield-gray-400 font-medium">Type</th>
                      <th className="text-left py-3 text-yield-gray-400 font-medium">Amount</th>
                      <th className="text-left py-3 text-yield-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 text-yield-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-yield-gray-600/30 hover:bg-gray-700/30 transition-colors duration-200"
                      >
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            tx.type === 'Stake' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 font-mono">
                          {tx.amount} ckBTC
                        </td>
                        <td className="py-4 text-yield-gray-400">
                          {tx.date}
                        </td>
                        <td className="py-4">
                          <span className="text-green-400 text-sm">
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
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
