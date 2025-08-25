import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../declarations/xonora_backend/xonora_backend.did.js';
import type { _SERVICE as Xonora } from '../declarations/xonora_backend/xonora_backend.did.d.ts';
import { getCanisterId, getICHost, getIdentityProvider, getNetwork, isProduction, validateEnvironment } from '../config/canister';
import { 
  poolsCache, 
  portfolioCache, 
  stakesCache, 
  systemInfoCache, 
  cacheKeys, 
  cachePatterns 
} from '../utils/cache';
import { 
  validateStakingInputs, 
  validateStakeAmount, 
  validatePoolId, 
  validateUserId,
  validateStakeId,
  validateStakingRules,
  getErrorMessage 
} from '../utils/validation';
import { 
  monitoring, 
  monitorPerformance, 
  monitorErrors,
  SystemHealth
} from '../utils/monitoring';
import { 
  rateLimiters, 
  rateLimit 
} from '../utils/rateLimiter';

// Types
export interface Pool {
  id: string;
  name: string;
  apy: number;
  totalStaked: bigint;
  maxCapacity: bigint;
  isActive: boolean;
}

export interface Stake {
  id: number;
  userId: string;
  amount: bigint;
  poolId: string;
  startTime: bigint;
  lastClaimTime: bigint;
  isActive: boolean;
}

export interface Portfolio {
  userId: string;
  totalStaked: bigint;
  totalEarned: bigint;
  activeStakes: number[];
}

export interface SystemInfo {
  owner: string;
  isInitialized: boolean;
  totalStakes: number;
}

export interface CkBTCBalance {
  balance: bigint;
  balanceInBTC: number;
  availableForStaking: bigint;
  availableForStakingInBTC: number;
}

class CanisterService {
  private agent: HttpAgent | null = null;
  private actor: any = null; // Using any for now to avoid type issues
  private authClient: AuthClient | null = null;
  private canisterId: string | null = null;
  private ckBTCLedgerActor: any = null;

  async initialize() {
    try {
      console.log('🚀 Starting canister service initialization...');
      
      // Validate environment variables first
      validateEnvironment();
      
      const network = getNetwork();
      console.log(`🌐 Network: ${network}`);
      
      // Initialize auth client with better error handling
      console.log('🔐 Creating AuthClient...');
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableDefaultIdleCallback: true,
          idleTimeout: 1000 * 60 * 30, // 30 minutes
        },
      });
      console.log('✅ AuthClient created successfully');

      // Check if user is already authenticated
      console.log('🔍 Checking authentication status...');
      const isAuthenticated = await this.authClient.isAuthenticated();
      console.log(`🔐 Authentication status: ${isAuthenticated}`);
      
      if (isAuthenticated) {
        console.log('👤 User is authenticated, setting up actor...');
        try {
          await this.setupActorWithIdentity();
          console.log('✅ Actor setup complete for authenticated user');
        } catch (actorError) {
          console.warn('⚠️ Authenticated actor setup failed, trying fallback...');
          await this.setupFallbackActor();
        }
      } else {
        console.log('👤 User is not authenticated, setting up fallback actor...');
        await this.setupFallbackActor();
      }

      console.log(`✅ Canister service initialized for mainnet deployment`, { 
        isAuthenticated,
        hasAuthClient: !!this.authClient,
        hasActor: !!this.actor,
        canisterId: this.canisterId
      });
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize canister service:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.message.includes('VITE_CANISTER_ID_XONORA_BACKEND')) {
          console.error('🔧 Environment variable error. Please check your deployment configuration.');
        } else if (error.message.includes('AuthClient')) {
          console.error('🔐 AuthClient creation failed. This might be a browser compatibility issue.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          console.error('🌐 Network error during initialization. Please check your internet connection.');
        } else if (error.message.includes('canister') || error.message.includes('backend')) {
          console.error('🔗 Backend canister error. Please verify the canister is running.');
        }
      }
      
      return false;
    }
  }

  private async setupActorWithIdentity() {
    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    try {
      console.log('🔧 Setting up actor with identity...');
      
      const identity = this.authClient.getIdentity();
      const principal = identity.getPrincipal();
      console.log('👤 Identity principal:', principal.toText());

      // Create agent with authenticated identity
      const host = getICHost();
      console.log('🏠 Creating agent with host:', host);
      
      // Create agent for mainnet deployment with relaxed signature verification
      this.agent = new HttpAgent({
        identity,
        host,
        verifyQuerySignatures: false, // Disable query signature verification to avoid subnet key issues
      });
      
      console.log('✅ Agent created successfully');

      // Set canister ID
      this.canisterId = getCanisterId('xonora_backend');
      console.log('🔗 Using backend canister ID:', this.canisterId);

      // Create actor
      console.log('🎭 Creating actor...');
      this.actor = Actor.createActor<Xonora>(idlFactory, {
        agent: this.agent,
        canisterId: this.canisterId,
      });
      console.log('✅ Actor created successfully');

      // Test actor connection with error handling
      console.log('🧪 Testing actor connection...');
      try {
        const systemInfo = await this.actor.getSystemInfo();
        console.log('✅ Actor connection test successful:', systemInfo);
      } catch (testError) {
        console.warn('⚠️ Actor connection test failed:', testError);
        
        // If the test fails due to signature issues, try a different approach
        if (testError instanceof Error && testError.message.includes('signature')) {
          console.log('🔄 Retrying with different agent configuration...');
          
          // Try with a simpler agent configuration
          this.agent = new HttpAgent({
            identity,
            host,
            verifyQuerySignatures: false,
          });
          
          // Recreate actor with new agent
          this.actor = Actor.createActor<Xonora>(idlFactory, {
            agent: this.agent,
            canisterId: this.canisterId,
          });
          
          console.log('✅ Actor recreated with simplified configuration');
        }
      }

      // Setup ckBTC ledger actor
      await this.setupCkBTCLedgerActor();

      console.log('🎉 Actor setup complete successfully', { 
        canisterId: this.canisterId,
        principal: principal.toText(),
        host,
        hasActor: !!this.actor,
        hasAgent: !!this.agent
      });
    } catch (error) {
      console.error('❌ Error in setupActorWithIdentity:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.message.includes('signature')) {
          console.error('🔐 Signature verification error. This is often due to subnet key issues.');
          console.error('💡 Try refreshing the page or clearing browser cache.');
        } else if (error.message.includes('identity')) {
          console.error('🔐 Identity error. Please ensure you are properly authenticated.');
        } else if (error.message.includes('agent')) {
          console.error('🌐 Agent creation error. Please check your network connection.');
        } else if (error.message.includes('actor')) {
          console.error('🎭 Actor creation error. Please verify the canister ID and network configuration.');
        } else if (error.message.includes('canister')) {
          console.error('🔗 Canister error. Please verify the backend canister is running.');
        }
      }
      
      throw error;
    }
  }

  private async setupFallbackActor() {
    try {
      console.log('🔄 Setting up fallback actor without authentication...');
      
      const host = getICHost();
      console.log('🏠 Creating fallback agent with host:', host);
      
      // Create a basic agent without authentication
      this.agent = new HttpAgent({
        host,
        verifyQuerySignatures: false,
      });
      
      console.log('✅ Fallback agent created successfully');

      // Set canister ID
      this.canisterId = getCanisterId('xonora_backend');
      console.log('🔗 Using backend canister ID:', this.canisterId);

      // Create actor
      console.log('🎭 Creating fallback actor...');
      this.actor = Actor.createActor<Xonora>(idlFactory, {
        agent: this.agent,
        canisterId: this.canisterId,
      });
      console.log('✅ Fallback actor created successfully');

      // Test actor connection
      console.log('🧪 Testing fallback actor connection...');
      try {
        const systemInfo = await this.actor.getSystemInfo();
        console.log('✅ Fallback actor connection test successful:', systemInfo);
      } catch (testError) {
        console.warn('⚠️ Fallback actor connection test failed:', testError);
      }

      console.log('🎉 Fallback actor setup complete successfully', { 
        canisterId: this.canisterId,
        host,
        hasActor: !!this.actor,
        hasAgent: !!this.agent
      });
    } catch (error) {
      console.error('❌ Error in setupFallbackActor:', error);
      throw error;
    }
  }

  private async setupCkBTCLedgerActor() {
    try {
      // ckBTC ledger canister ID on mainnet
      const ckBTCLedgerId = 'mxzaz-hqaaa-aaaar-qaada-cai';
      
      // Import ckBTC ledger interface
      const { idlFactory: ckBTCIdlFactory } = await import('../declarations/ckbtc_ledger/ckbtc_ledger.did.js');
      
      this.ckBTCLedgerActor = Actor.createActor(ckBTCIdlFactory, {
        agent: this.agent,
        canisterId: ckBTCLedgerId,
      });
      
      console.log('ckBTC ledger actor setup complete');
    } catch (error) {
      console.warn('Failed to setup ckBTC ledger actor:', error);
      // Don't fail the whole setup if ckBTC ledger is not available
    }
  }

  async login(): Promise<void> {
    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    const identityProvider = getIdentityProvider();
    console.log('Starting login with identity provider:', identityProvider);

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider,
        onSuccess: async () => {
          try {
            console.log('Login successful, setting up actor...');
            await this.setupActorWithIdentity();
            console.log('Actor setup complete');
            resolve();
          } catch (error) {
            console.error('Error setting up actor after login:', error);
            reject(error);
          }
        },
        onError: (error) => {
          console.error('Login failed:', error);
          reject(error);
        },
        windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
      });
    });
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      // Clear actor and agent after logout
      this.actor = null;
      this.agent = null;
      this.ckBTCLedgerActor = null;
    }
  }

  getPrincipal(): string | null {
    if (this.authClient && this.isAuthenticated()) {
      return this.authClient.getIdentity().getPrincipal().toText();
    }
    return null;
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.authClient?.isAuthenticated() || false;
  }

  async getConnectionStatus(): Promise<'disconnected' | 'connecting' | 'connected' | 'error'> {
    if (!this.authClient) {
      console.log('Connection status: no auth client');
      return 'disconnected';
    }
    
    const isAuth = await this.isAuthenticated();
    const hasActor = !!this.actor;
    
    console.log('Connection status check:', { isAuth, hasActor });
    
    if (isAuth && hasActor) return 'connected';
    if (isAuth && !hasActor) return 'error';
    return 'disconnected';
  }

  getCanisterId(): string | null {
    return this.canisterId;
  }

  async retryConnection(): Promise<boolean> {
    try {
      if (!this.authClient || !this.isAuthenticated()) {
        console.log('Cannot retry: not authenticated');
        return false;
      }
      
      const network = getNetwork();
      console.log(`Retrying actor setup for mainnet deployment...`);
      
      // Validate environment before retry
      validateEnvironment();
      
      await this.setupActorWithIdentity();
      console.log('Retry connection successful');
      return true;
    } catch (error) {
      console.error('Retry connection failed:', error);
      if (error instanceof Error && error.message.includes('VITE_CANISTER_ID_XONORA_BACKEND')) {
        console.error('Environment variable error during retry. Please check your deployment configuration.');
      }
      return false;
    }
  }

  // ckBTC Balance checking methods
  async getCkBTCBalance(userId: string): Promise<CkBTCBalance> {
    if (!this.ckBTCLedgerActor) {
      throw new Error('ckBTC ledger not available');
    }

    try {
      const balance = await this.ckBTCLedgerActor.icrc1_balance_of({
        owner: { principal: userId },
        subaccount: []
      });

      const balanceInBTC = Number(balance) / 100_000_000; // Convert from satoshis to BTC
      
      return {
        balance,
        balanceInBTC,
        availableForStaking: balance, // For now, assume all balance is available
        availableForStakingInBTC: balanceInBTC
      };
    } catch (error) {
      console.error('Failed to get ckBTC balance:', error);
      throw new Error('Failed to retrieve ckBTC balance');
    }
  }

  async checkBalanceForStaking(userId: string, stakeAmount: bigint): Promise<{ canStake: boolean; availableBalance: bigint; shortfall?: bigint }> {
    try {
      const balance = await this.getCkBTCBalance(userId);
      
      if (balance.balance >= stakeAmount) {
        return {
          canStake: true,
          availableBalance: balance.balance
        };
      } else {
        return {
          canStake: false,
          availableBalance: balance.balance,
          shortfall: stakeAmount - balance.balance
        };
      }
    } catch (error) {
      console.error('Failed to check balance for staking:', error);
      throw new Error('Failed to check balance for staking');
    }
  }

  // Backend API calls
  async initializeSystem(): Promise<{ ok?: string; err?: string }> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.initialize();
  }

  async stake(amount: bigint, poolId: string): Promise<{ ok?: number; err?: string }> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.stake(amount, poolId);
  }

  async unstake(stakeId: number): Promise<{ ok?: bigint; err?: string }> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.unstake(stakeId);
  }

  async getPools(): Promise<Pool[]> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getPools();
  }

  async getPool(poolId: string): Promise<{ ok?: Pool; err?: string }> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getPool(poolId);
  }

  async getUserStakes(userId: string): Promise<Stake[]> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getUserStakes(userId);
  }

  async getPortfolio(userId: string): Promise<{ ok?: Portfolio; err?: string }> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getPortfolio(userId);
  }

  async getStake(stakeId: number): Promise<{ ok?: Stake; err?: string }> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getStake(stakeId);
  }

  async getSystemInfo(): Promise<SystemInfo> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.getSystemInfo();
  }

  async whoami(): Promise<string> {
    if (!this.actor) throw new Error('Actor not initialized');
    return await this.actor.whoami();
  }

  // Enhanced methods with caching, validation, and monitoring

  /**
   * Get pools with caching
   */
  async getPoolsWithCache(): Promise<Pool[]> {
    const cacheKey = cacheKeys.pools();
    const cached = poolsCache.get(cacheKey);
    
    if (cached) {
      monitoring.logPerformance('getPoolsWithCache', 0, true);
      return cached;
    }

    const startTime = Date.now();
    try {
      const pools = await this.getPools();
      poolsCache.set(cacheKey, pools);
      
      const duration = Date.now() - startTime;
      monitoring.logPerformance('getPoolsWithCache', duration, true);
      
      return pools;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);
      monitoring.logPerformance('getPoolsWithCache', duration, false, errorMsg);
      monitoring.logError(errorMsg, 'getPoolsWithCache');
      throw error;
    }
  }

  /**
   * Get portfolio with caching
   */
  async getPortfolioWithCache(userId: string): Promise<{ ok?: Portfolio; err?: string }> {
    // Validate user ID
    const userValidation = validateUserId(userId);
    if (!userValidation.isValid) {
      const errorMsg = getErrorMessage(userValidation);
      monitoring.logError(errorMsg, 'getPortfolioWithCache', userId);
      throw new Error(errorMsg);
    }

    const cacheKey = cacheKeys.portfolio(userId);
    const cached = portfolioCache.get(cacheKey);
    
    if (cached) {
      monitoring.logPerformance('getPortfolioWithCache', 0, true);
      return cached;
    }

    const startTime = Date.now();
    try {
      const portfolio = await this.getPortfolio(userId);
      portfolioCache.set(cacheKey, portfolio);
      
      const duration = Date.now() - startTime;
      monitoring.logPerformance('getPortfolioWithCache', duration, true);
      
      return portfolio;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);
      monitoring.logPerformance('getPortfolioWithCache', duration, false, errorMsg);
      monitoring.logError(errorMsg, 'getPortfolioWithCache', userId);
      throw error;
    }
  }

  /**
   * Get user stakes with caching
   */
  async getUserStakesWithCache(userId: string): Promise<Stake[]> {
    // Validate user ID
    const userValidation = validateUserId(userId);
    if (!userValidation.isValid) {
      const errorMsg = getErrorMessage(userValidation);
      monitoring.logError(errorMsg, 'getUserStakesWithCache', userId);
      throw new Error(errorMsg);
    }

    const cacheKey = cacheKeys.userStakes(userId);
    const cached = stakesCache.get(cacheKey);
    
    if (cached) {
      monitoring.logPerformance('getUserStakesWithCache', 0, true);
      return cached;
    }

    const startTime = Date.now();
    try {
      const stakes = await this.getUserStakes(userId);
      stakesCache.set(cacheKey, stakes);
      
      const duration = Date.now() - startTime;
      monitoring.logPerformance('getUserStakesWithCache', duration, true);
      
      return stakes;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);
      monitoring.logPerformance('getUserStakesWithCache', duration, false, errorMsg);
      monitoring.logError(errorMsg, 'getUserStakesWithCache', userId);
      throw error;
    }
  }

  /**
   * Enhanced stake method with validation and rate limiting
   */
  async stakeWithValidation(amount: bigint, poolId: string, userId: string): Promise<{ ok?: number; err?: string }> {
    const startTime = Date.now();
    
    try {
      // Validate inputs
      const validation = validateStakingInputs(amount, poolId, userId);
      if (!validation.isValid) {
        const errorMsg = getErrorMessage(validation);
        monitoring.logError(errorMsg, 'stakeWithValidation', userId);
        throw new Error(errorMsg);
      }

      // Check rate limit
      const rateLimitResult = rateLimiters.stake.isAllowed(userId, 'stake');
      if (!rateLimitResult.allowed) {
        const errorMsg = `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`;
        monitoring.logError(errorMsg, 'stakeWithValidation', userId);
        throw new Error(errorMsg);
      }

      // Check balance before staking
      const balanceCheck = await this.checkBalanceForStaking(userId, amount);
      if (!balanceCheck.canStake) {
        const shortfallInBTC = Number(balanceCheck.shortfall) / 100_000_000;
        const errorMsg = `Insufficient balance. You have ${Number(balanceCheck.availableBalance) / 100_000_000} ckBTC, but need ${Number(amount) / 100_000_000} ckBTC. Shortfall: ${shortfallInBTC} ckBTC`;
        monitoring.logError(errorMsg, 'stakeWithValidation', userId);
        throw new Error(errorMsg);
      }

      // Get user stakes for business rule validation
      const userStakes = await this.getUserStakesWithCache(userId);
      const businessValidation = validateStakingRules(amount, poolId, userStakes);
      if (!businessValidation.isValid) {
        const errorMsg = getErrorMessage(businessValidation);
        monitoring.logError(errorMsg, 'stakeWithValidation', userId);
        throw new Error(errorMsg);
      }

      // Perform stake operation
      const result = await this.stake(amount, poolId);
      
      // Record successful request
      rateLimiters.stake.recordRequest(userId, 'stake', true);
      
      // Invalidate related caches
      this.invalidateUserCaches(userId);
      
      const duration = Date.now() - startTime;
      monitoring.logPerformance('stakeWithValidation', duration, true);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      // Record failed request
      rateLimiters.stake.recordRequest(userId, 'stake', false);
      
      monitoring.logPerformance('stakeWithValidation', duration, false, errorMsg);
      monitoring.logError(errorMsg, 'stakeWithValidation', userId);
      throw error;
    }
  }

  /**
   * Enhanced unstake method with validation and rate limiting
   */
  async unstakeWithValidation(stakeId: number, userId: string): Promise<{ ok?: bigint; err?: string }> {
    const startTime = Date.now();
    
    try {
      // Validate stake ID
      const stakeValidation = validateStakeId(stakeId);
      if (!stakeValidation.isValid) {
        const errorMsg = getErrorMessage(stakeValidation);
        monitoring.logError(errorMsg, 'unstakeWithValidation', userId);
        throw new Error(errorMsg);
      }

      // Validate user ID
      const userValidation = validateUserId(userId);
      if (!userValidation.isValid) {
        const errorMsg = getErrorMessage(userValidation);
        monitoring.logError(errorMsg, 'unstakeWithValidation', userId);
        throw new Error(errorMsg);
      }

      // Check rate limit
      const rateLimitResult = rateLimiters.unstake.isAllowed(userId, 'unstake');
      if (!rateLimitResult.allowed) {
        const errorMsg = `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`;
        monitoring.logError(errorMsg, 'unstakeWithValidation', userId);
        throw new Error(errorMsg);
      }

      // Perform unstake operation
      const result = await this.unstake(stakeId);
      
      // Record successful request
      rateLimiters.unstake.recordRequest(userId, 'unstake', true);
      
      // Invalidate related caches
      this.invalidateUserCaches(userId);
      
      const duration = Date.now() - startTime;
      monitoring.logPerformance('unstakeWithValidation', duration, true);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      // Record failed request
      rateLimiters.unstake.recordRequest(userId, 'unstake', false);
      
      monitoring.logPerformance('unstakeWithValidation', duration, false, errorMsg);
      monitoring.logError(errorMsg, 'unstakeWithValidation', userId);
      throw error;
    }
  }

  /**
   * Invalidate user-related caches
   */
  private invalidateUserCaches(userId: string): void {
    portfolioCache.delete(cacheKeys.portfolio(userId));
    stakesCache.delete(cacheKeys.userStakes(userId));
  }

  /**
   * Get system health information
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const startTime = Date.now();
    try {
      const health = await monitoring.checkSystemHealth();
      const duration = Date.now() - startTime;
      monitoring.logPerformance('getSystemHealth', duration, true);
      return health;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);
      monitoring.logPerformance('getSystemHealth', duration, false, errorMsg);
      monitoring.logError(errorMsg, 'getSystemHealth');
      throw error;
    }
  }

  /**
   * Get monitoring statistics
   */
  getMonitoringStats(): Record<string, any> {
    return {
      performance: monitoring.getPerformanceStats(),
      errors: monitoring.getErrorStats(),
      cache: {
        pools: poolsCache.getStats(),
        portfolio: portfolioCache.getStats(),
        stakes: stakesCache.getStats(),
        systemInfo: systemInfoCache.getStats()
      },
      rateLimits: {
        stake: rateLimiters.stake.getStats(),
        unstake: rateLimiters.unstake.getStats(),
        query: rateLimiters.query.getStats(),
        auth: rateLimiters.auth.getStats(),
        global: rateLimiters.global.getStats()
      }
    };
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    poolsCache.clear();
    portfolioCache.clear();
    stakesCache.clear();
    systemInfoCache.clear();
  }

  /**
   * Cleanup old data
   */
  cleanup(): void {
    // Clean up rate limiters
    rateLimiters.stake.cleanup();
    rateLimiters.unstake.cleanup();
    rateLimiters.query.cleanup();
    rateLimiters.auth.cleanup();
    rateLimiters.global.cleanup();
    
    // Clean up monitoring data
    monitoring.clearOldData();
  }
}

// Create singleton instance
export const canisterService = new CanisterService(); 