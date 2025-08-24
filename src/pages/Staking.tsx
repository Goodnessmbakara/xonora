import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import IdentityConnection from '../components/IdentityConnection';
import { canisterService } from '../services/canister';
import type { Pool, Stake } from '../services/canister';

const Staking = () => {
  const { isAuthenticated, principal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPool, setSelectedPool] = useState('balanced');
  const [stakeAmount, setStakeAmount] = useState('');
  const [pools, setPools] = useState<Pool[]>([]);
  const [userStakes, setUserStakes] = useState<Stake[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load pools and user stakes from backend
  const loadData = async () => {
    try {
      setLoadingData(true);
      setError(null);
      
      console.log('Loading pools and user stakes...');
      
      // Load pools
      const poolsData = await canisterService.getPools();
      console.log('Loaded pools:', poolsData);
      setPools(poolsData);
      
      // Load user stakes if authenticated
      if (isAuthenticated && principal) {
        try {
          const stakesData = await canisterService.getUserStakes(principal);
          console.log('Loaded user stakes:', stakesData);
          setUserStakes(stakesData);
        } catch (err) {
          console.warn('Failed to load user stakes:', err);
          // Don't fail the whole load if user stakes fail
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      
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

    const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;

    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      console.log('=== STAKING ATTEMPT ===');
      console.log('Amount:', stakeAmount, 'Pool:', selectedPool);

      // Convert amount to satoshis (multiply by 100,000,000)
      const amountInSatoshis = BigInt(Math.floor(parseFloat(stakeAmount) * 100_000_000));
      console.log('Amount in satoshis:', amountInSatoshis.toString());

      // Check if we're properly authenticated first
      if (!canisterService.isAuthenticated()) {
        throw new Error('Not authenticated. Please connect your wallet first.');
      }

      const result = await canisterService.stake(amountInSatoshis, selectedPool);
      console.log('Stake result:', result);

      if ('ok' in result) {
        console.log('✅ Stake successful, ID:', result.ok);
        alert(`Successfully staked! Stake ID: ${result.ok}`);
        setStakeAmount('');
        // Reload data to show new stake
        await loadData();
      } else {
        throw new Error(result.err || 'Staking failed');
      }
    } catch (error) {
      console.error('❌ Staking error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Staking failed: ${errorMessage}`);
      
      // If it's a certificate error, provide specific guidance
      if (errorMessage.includes('certificate') || errorMessage.includes('signature')) {
        if (import.meta.env.PROD) {
          setError('🚧 Backend Not Yet Deployed: The Xonora backend canister is not yet deployed to IC mainnet. For testing, please use the local development version at localhost:8080');
        } else {
          setError(`Certificate error: ${errorMessage}. Try refreshing the page and reconnecting your wallet.`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async (stakeId: bigint) => {
    setIsLoading(true);
    try {
      console.log('Unstaking stake ID:', stakeId);
      
      const result = await canisterService.unstake(Number(stakeId));
      console.log('Unstake result:', result);
      
      if ('ok' in result) {
        const amountInBTC = Number(result.ok) / 100_000_000;
        console.log('Unstake successful, amount:', amountInBTC);
        alert(`Successfully unstaked! Received: ${amountInBTC.toFixed(8)} BTC`);
        // Reload data to update stakes
        await loadData();
      } else {
        throw new Error(result.err || 'Unstaking failed');
      }
    } catch (error) {
      console.error('Unstaking error:', error);
      alert(`Unstaking failed: ${error instanceof Error ? error.message : error}`);
    } finally {
      setIsLoading(false);
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
            <h1 className="text-3xl font-bold text-xonora-light mb-4 font-tech">Staking Access</h1>
                          <p className="text-xonora-secondary-400 font-body">Connect with Internet Identity to start staking your Bitcoin and earning yields through our AI-optimized pools.</p>
          </div>
          <IdentityConnection showFullInterface={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 pt-20">
      <div className="container mx-auto px-6 py-8">


        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-xonora-light font-tech">
            Stake Your ckBTC
          </h1>
          <p className="text-xl text-xonora-secondary-400 font-body">
            Choose your strategy and start earning Bitcoin yields with our AI-optimized pools.
          </p>
        </div>

        {(isLoading || loadingData) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-xonora-secondary-700 rounded-lg p-8 text-center">
              <div className="text-xonora-primary-400">
                {loadingData ? 'Loading pools and stakes...' : 'Processing...'}
              </div>
            </div>
          </div>
        )}

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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Staking Form */}
          <div className="bg-xonora-secondary-700 rounded-xl p-8">
            <h3 className="text-2xl font-tech font-bold mb-4 text-xonora-primary-400">
              New Stake
            </h3>
            
            <form onSubmit={handleStake} className="space-y-6">
              {/* Pool Selection */}
              <div>
                <label className="block text-sm font-medium text-xonora-secondary-300 mb-3 font-body">
                  Select Pool
                </label>
                                <div className="grid gap-3">
                  {pools.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xonora-secondary-400">No pools available.</p>
                      <p className="text-sm text-xonora-secondary-500 mt-2 font-body">Please try again later.</p>
                    </div>
                  ) : (
                    pools.map((pool) => {
                      const utilizationPercent = pool.maxCapacity > 0n 
                        ? (Number(pool.totalStaked) / Number(pool.maxCapacity)) * 100 
                        : 0;
                      
                      return (
                        <label
                          key={pool.id}
                          className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 ${
                            selectedPool === pool.id
                              ? "border-xonora-primary-400 bg-xonora-primary-400/10"
                              : "border-xonora-secondary-500 hover:border-xonora-primary-400/50"
                          } ${!pool.isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <input
                            type="radio"
                            name="pool"
                            value={pool.id}
                            checked={selectedPool === pool.id}
                            onChange={(e) => setSelectedPool(e.target.value)}
                            disabled={!pool.isActive}
                            className="sr-only"
                          />
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-xonora-light">{pool.name}</h4>
                              <div className="text-xs text-xonora-secondary-500 mt-1">
                                Capacity: {utilizationPercent.toFixed(1)}% used
                              </div>
                              <div className="text-xs text-xonora-secondary-500">
                                Total Staked: {(Number(pool.totalStaked) / 100_000_000).toFixed(8)} BTC
                              </div>
                              {!pool.isActive && (
                                <span className="text-xs text-red-400">Inactive</span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-xonora-primary-400 mb-2">
                                {pool.apy}%
                              </div>
                              <div className="text-sm text-xonora-secondary-400">APY</div>
                            </div>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-xonora-secondary-300 mb-2 font-body">
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
                  className="w-full px-4 py-3 bg-xonora-secondary-600 border border-xonora-secondary-500 rounded-lg text-xonora-light focus:border-xonora-primary-400 focus:outline-none"
                  placeholder="0.000"
                />
                <p className="text-sm text-xonora-secondary-400 mt-1 font-body">
                  Minimum stake: 0.001 ckBTC
                </p>
              </div>

              {/* Estimated Returns */}
              {stakeAmount && parseFloat(stakeAmount) > 0 && (
                <div className="bg-xonora-secondary-600 rounded-lg p-4">
                  <h4 className="font-semibold text-xonora-light mb-2">Estimated Returns</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-xonora-secondary-400">Daily:</span>
                      <span className="text-xonora-primary-400">
                        {((parseFloat(stakeAmount) * (pools.find(p => p.id === selectedPool)?.apy || 10) / 100) / 365).toFixed(6)} ckBTC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xonora-secondary-400">Monthly:</span>
                      <span className="text-xonora-primary-400">
                        {((parseFloat(stakeAmount) * (pools.find(p => p.id === selectedPool)?.apy || 10) / 100) / 12).toFixed(6)} ckBTC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xonora-secondary-400">Yearly:</span>
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
          <div className="bg-xonora-secondary-700 rounded-xl p-8">
            <h3 className="text-2xl font-tech font-bold mb-2 text-xonora-primary-400">
              Active Stakes
            </h3>
            <p className="text-xonora-secondary-400 mb-6 font-body">Manage your existing staking positions</p>

            {userStakes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xonora-secondary-400">No active stakes found.</p>
                <p className="text-sm text-xonora-secondary-500 mt-2 font-body">Start staking to see your positions here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userStakes.map((stake) => {
                  const pool = pools.find(p => p.id === stake.poolId);
                  const stakeAmountBTC = Number(stake.amount) / 100_000_000;
                  const startDate = new Date(Number(stake.startTime) / 1_000_000).toLocaleDateString();
                  
                  return (
                    <div key={Number(stake.id)} className="bg-xonora-secondary-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                                                      <h4 className="font-semibold text-xonora-light capitalize">{pool?.name || stake.poolId}</h4>
                          <p className="text-sm text-xonora-secondary-400">Started: {startDate}</p>
                          <p className="text-sm text-xonora-secondary-400">Stake ID: {Number(stake.id)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-xonora-primary-400">
                            {pool?.apy || 0}% APY
                          </div>
                          <div className={`text-sm ${stake.isActive ? 'text-success' : 'text-danger'}`}>
                            {stake.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-xonora-secondary-400">Staked Amount</p>
                          <p className="font-semibold text-xonora-light">{stakeAmountBTC.toFixed(8)} BTC</p>
                        </div>
                        <div>
                          <p className="text-sm text-xonora-secondary-400">Status</p>
                          <p className={`font-semibold ${stake.isActive ? 'text-success' : 'text-xonora-secondary-400'}`}>
                            {stake.isActive ? 'Earning' : 'Completed'}
                          </p>
                        </div>
                      </div>

                      {stake.isActive && (
                        <button
                          onClick={() => handleUnstake(stake.id)}
                          disabled={isLoading}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Processing...' : 'Unstake'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staking;
