
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Staking = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [riskProfile, setRiskProfile] = useState('balanced');
  const [isStaking, setIsStaking] = useState(false);

  const riskProfiles = [
    { id: 'stable', name: 'Stable', apy: '5%', description: 'Low risk, steady returns' },
    { id: 'balanced', name: 'Balanced', apy: '10%', description: 'Moderate risk, balanced returns' },
    { id: 'aggressive', name: 'Aggressive', apy: '15%', description: 'Higher risk, maximum returns' }
  ];

  const handleConnect = () => {
    setIsConnected(true);
    setBalance(0.01); // Mock balance
  };

  const handleStake = async () => {
    setIsStaking(true);
    // Simulate staking transaction
    setTimeout(() => {
      setIsStaking(false);
      window.location.href = '/dashboard';
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-yield-dark text-yield-light">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20"></div>
          
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <svg viewBox="0 0 200 200" className="w-32 h-32">
                  {/* Bitcoin with growing leaves */}
                  <circle cx="100" cy="100" r="60" fill="url(#stakingGradient)" />
                  <path d="M80 80 L80 120 M80 80 L95 80 Q105 80 105 90 Q105 100 95 100 L80 100 M80 100 L100 100 Q110 100 110 110 Q110 120 100 120 L80 120" stroke="#121212" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Growing leaves */}
                  <g className="animate-float">
                    <ellipse cx="140" cy="60" rx="8" ry="15" fill="url(#leafGradient)" transform="rotate(30 140 60)" />
                    <ellipse cx="60" cy="140" rx="8" ry="15" fill="url(#leafGradient)" transform="rotate(-30 60 140)" />
                    <ellipse cx="150" cy="150" rx="6" ry="12" fill="url(#leafGradient)" transform="rotate(60 150 150)" />
                  </g>
                  
                  <defs>
                    <linearGradient id="stakingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34C759" />
                      <stop offset="100%" stopColor="#22A447" />
                    </linearGradient>
                    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34C759" />
                      <stop offset="100%" stopColor="#22A447" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-tech font-bold mb-6">
                Stake Your <span className="text-gradient">ckBTC</span> to Earn Yields
              </h1>
              <p className="text-xl text-yield-gray-400 max-w-3xl mx-auto">
                Choose your risk profile and start earning up to 15% APY with our AI-optimized yield farming strategies.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {!isConnected ? (
                /* Not Connected State */
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                  <div className="mb-6">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-4">
                      <rect x="25" y="35" width="50" height="30" rx="6" fill="none" stroke="url(#walletStroke)" strokeWidth="2" />
                      <circle cx="35" cy="50" r="2" fill="url(#walletStroke)" />
                      <path d="M45 45 L65 45 M45 55 L60 55" stroke="url(#walletStroke)" strokeWidth="1.5" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="walletStroke">
                          <stop offset="0%" stopColor="#34C759" />
                          <stop offset="100%" stopColor="#22A447" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-tech font-bold mb-4 text-yield-green-400">
                    Please Connect Your Wallet to Stake
                  </h3>
                  <p className="text-yield-gray-400 mb-6">
                    Connect your Internet Identity wallet to access staking features and start earning yields on your Bitcoin.
                  </p>
                  <button
                    onClick={handleConnect}
                    className="btn-primary text-lg"
                  >
                    Connect with Internet Identity
                  </button>
                </div>
              ) : balance === 0 ? (
                /* Connected, Zero Balance State */
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                  <div className="mb-6">
                    <div className="relative">
                      <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-4">
                        <circle cx="50" cy="50" r="25" fill="none" stroke="url(#btcStroke)" strokeWidth="2" />
                        <path d="M42 40 L42 60 M42 40 L50 40 Q53 40 53 43 Q53 46 50 46 L42 46 M42 46 L51 46 Q54 46 54 51 Q54 56 51 56 L42 56" stroke="url(#btcStroke)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    </div>
                    <defs>
                      <linearGradient id="btcStroke">
                        <stop offset="0%" stopColor="#34C759" />
                        <stop offset="100%" stopColor="#22A447" />
                      </linearGradient>
                    </defs>
                  </div>
                  <h3 className="text-2xl font-tech font-bold mb-4 text-yield-green-400">
                    Your ckBTC Balance: 0
                  </h3>
                  <p className="text-yield-gray-400 mb-6">
                    You need ckBTC to stake. Purchase ckBTC or deposit from your existing wallet to get started.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="btn-primary">
                      Buy ckBTC
                    </button>
                    <button className="px-6 py-3 border-2 border-yield-green-400 text-yield-green-400 rounded-lg font-semibold hover:bg-yield-green-400 hover:text-yield-dark transition-all duration-300">
                      Deposit ckBTC
                    </button>
                  </div>
                </div>
              ) : (
                /* Connected, Positive Balance State */
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-tech font-bold mb-2 text-yield-green-400">
                      Your ckBTC Balance: {balance} ckBTC
                    </h3>
                    <p className="text-yield-gray-400">
                      ≈ ${(balance * 60000).toLocaleString()} USD
                    </p>
                  </div>

                  {/* Risk Profile Selection */}
                  <div className="mb-8">
                    <label className="block text-lg font-semibold mb-4 text-yield-light">
                      Choose Risk Profile
                    </label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {riskProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            riskProfile === profile.id
                              ? 'border-yield-green-400 bg-yield-green-400/10'
                              : 'border-yield-gray-600 hover:border-yield-green-400/50'
                          }`}
                          onClick={() => setRiskProfile(profile.id)}
                        >
                          <div className="text-center">
                            <h4 className="font-tech font-bold text-lg mb-1">{profile.name}</h4>
                            <div className="text-2xl font-bold text-yield-green-400 mb-2">
                              {profile.apy} APY
                            </div>
                            <p className="text-sm text-yield-gray-400">{profile.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staking Amount Input */}
                  <div className="mb-8">
                    <label className="block text-lg font-semibold mb-4 text-yield-light">
                      Staking Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="0.001"
                        min="0.001"
                        max={balance}
                        step="0.001"
                        className="w-full px-4 py-3 bg-gray-700 border border-yield-gray-600 rounded-lg text-yield-light focus:border-yield-green-400 focus:outline-none"
                      />
                      <div className="absolute right-3 top-3 text-yield-gray-400">
                        ckBTC
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-yield-gray-400">Min: 0.001 ckBTC</span>
                      <button
                        onClick={() => setStakeAmount(balance.toString())}
                        className="text-yield-green-400 hover:underline"
                      >
                        Max: {balance} ckBTC
                      </button>
                    </div>
                  </div>

                  {/* Stake Button */}
                  <button
                    onClick={handleStake}
                    disabled={!stakeAmount || parseFloat(stakeAmount) < 0.001 || parseFloat(stakeAmount) > balance || isStaking}
                    className="w-full btn-primary text-lg relative overflow-hidden"
                  >
                    {isStaking ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Staking...
                      </div>
                    ) : (
                      'Stake ckBTC'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Staking;
