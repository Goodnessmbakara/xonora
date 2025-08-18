import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Staking = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPool, setSelectedPool] = useState('balanced');
  const [stakeAmount, setStakeAmount] = useState('');
  const [userStakes, setUserStakes] = useState([
    { id: 1, pool: 'balanced', amount: 0.5, apy: 10.5, startDate: '2024-01-10', earned: 0.023 },
    { id: 2, pool: 'aggressive', amount: 1.2, apy: 15.2, startDate: '2024-01-05', earned: 0.045 }
  ]);

  const pools = [
    {
      id: 'stable',
      name: 'Stable Pool',
      apy: 5.0,
      risk: 'Low',
      description: 'Conservative strategy with stable returns',
      maxCapacity: 1000,
      totalStaked: 450
    },
    {
      id: 'balanced',
      name: 'Balanced Pool',
      apy: 10.0,
      risk: 'Medium',
      description: 'Balanced risk and reward strategy',
      maxCapacity: 1000,
      totalStaked: 750
    },
    {
      id: 'aggressive',
      name: 'Aggressive Pool',
      apy: 15.0,
      risk: 'High',
      description: 'High-risk, high-reward strategy',
      maxCapacity: 1000,
      totalStaked: 300
    }
  ];

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;

    setIsLoading(true);
    try {
      // Simulate staking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new stake to user stakes
      const newStake = {
        id: Date.now(),
        pool: selectedPool,
        amount: parseFloat(stakeAmount),
        apy: pools.find(p => p.id === selectedPool)?.apy || 10,
        startDate: new Date().toISOString().split('T')[0],
        earned: 0
      };
      
      setUserStakes([...userStakes, newStake]);
      setStakeAmount('');
      alert('Successfully staked!');
    } catch (error) {
      alert('Staking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async (stakeId: number) => {
    setIsLoading(true);
    try {
      // Simulate unstaking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUserStakes(userStakes.filter(stake => stake.id !== stakeId));
      alert('Successfully unstaked!');
    } catch (error) {
      alert('Unstaking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please connect your wallet</h1>
          <p className="text-gray-400">You need to be authenticated to access staking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-white">
            Stake Your ckBTC
          </h1>
          <p className="text-xl text-gray-400">
            Choose your strategy and start earning Bitcoin yields with our AI-optimized pools.
          </p>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-xonora-primary-400">Loading...</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Staking Form */}
          <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-tech font-bold mb-4 text-xonora-primary-400">
              New Stake
            </h3>
            
            <form onSubmit={handleStake} className="space-y-6">
              {/* Pool Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Pool
                </label>
                <div className="grid gap-3">
                  {pools.map((pool) => (
                    <label
                      key={pool.id}
                      className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedPool === pool.id
                          ? "border-xonora-primary-400 bg-xonora-primary-400/10"
                          : "border-yield-gray-600 hover:border-xonora-primary-400/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pool"
                        value={pool.id}
                        checked={selectedPool === pool.id}
                        onChange={(e) => setSelectedPool(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-white">{pool.name}</h4>
                          <p className="text-sm text-gray-400">{pool.description}</p>
                          <span className="text-xs text-gray-500">Risk: {pool.risk}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-xonora-primary-400 mb-2">
                            {pool.apy}%
                          </div>
                          <div className="text-sm text-gray-400">APY</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (ckBTC)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  step="0.001"
                  min="0.001"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-yield-gray-600 rounded-lg text-xonora-light focus:border-xonora-primary-400 focus:outline-none"
                  placeholder="0.000"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Minimum stake: 0.001 ckBTC
                </p>
              </div>

              {/* Estimated Returns */}
              {stakeAmount && parseFloat(stakeAmount) > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Estimated Returns</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily:</span>
                      <span className="text-xonora-primary-400">
                        {((parseFloat(stakeAmount) * (pools.find(p => p.id === selectedPool)?.apy || 10) / 100) / 365).toFixed(6)} ckBTC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly:</span>
                      <span className="text-xonora-primary-400">
                        {((parseFloat(stakeAmount) * (pools.find(p => p.id === selectedPool)?.apy || 10) / 100) / 12).toFixed(6)} ckBTC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Yearly:</span>
                      <span className="text-xonora-primary-400">
                        {(parseFloat(stakeAmount) * (pools.find(p => p.id === selectedPool)?.apy || 10) / 100).toFixed(6)} ckBTC
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                className="w-full px-6 py-3 border-2 border-xonora-primary-400 text-xonora-primary-400 rounded-lg font-semibold hover:bg-xonora-primary-400 hover:text-xonora-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Stake ckBTC'}
              </button>
            </form>
          </div>

          {/* Active Stakes */}
          <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-tech font-bold mb-2 text-xonora-primary-400">
              Active Stakes
            </h3>
            <p className="text-gray-400 mb-6">Manage your existing staking positions</p>

            {userStakes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No active stakes found.</p>
                <p className="text-sm text-gray-500 mt-2">Start staking to see your positions here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userStakes.map((stake) => (
                  <div key={stake.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-white capitalize">{stake.pool} Pool</h4>
                        <p className="text-sm text-gray-400">Started: {stake.startDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-xonora-primary-400">
                          {stake.apy}% APY
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Staked Amount</p>
                        <p className="font-semibold text-white">{stake.amount} ckBTC</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Earned</p>
                        <p className="font-semibold text-xonora-primary-400">{stake.earned} ckBTC</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnstake(stake.id)}
                      disabled={isLoading}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Unstake'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;
