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

class CanisterService {
  private agent: HttpAgent | null = null;
  private actor: any = null; // Using any for now to avoid type issues
  private authClient: AuthClient | null = null;
  private canisterId: string | null = null;

  async initialize() {
    try {
      // Validate environment variables first
      validateEnvironment();
      
      const network = getNetwork();
      console.log(`Initializing canister service for mainnet deployment`);
      
      // Initialize auth client
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableDefaultIdleCallback: true,
          idleTimeout: 1000 * 60 * 30, // 30 minutes
        },
      });

      // Check if user is already authenticated
      const isAuthenticated = await this.authClient.isAuthenticated();
      
      if (isAuthenticated) {
        await this.setupActorWithIdentity();
      }

      console.log(`Canister service initialized for mainnet deployment`, { isAuthenticated });
      return true;
    } catch (error) {
      console.error('Failed to initialize canister service:', error);
      if (error instanceof Error && error.message.includes('VITE_CANISTER_ID_XONORA_BACKEND')) {
        console.error('Environment variable error. Please check your deployment configuration.');
      }
      return false;
    }
  }

  private async setupActorWithIdentity() {
    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    try {
      const identity = this.authClient.getIdentity();
      const principal = identity.getPrincipal();
      console.log('Setting up actor with identity:', principal.toText());

      // Create agent with authenticated identity
      const host = getICHost();
      console.log('Creating agent with host:', host);
      
      // Create agent for mainnet deployment
      this.agent = new HttpAgent({
        identity,
        host,
        verifyQuerySignatures: true, // Always verify signatures for mainnet
      });

      console.log('Agent configured for mainnet deployment');

      // Set canister ID
      this.canisterId = getCanisterId('xonora_backend');
      console.log('Using backend canister ID:', this.canisterId);

      // Create actor
      console.log('Creating actor...');
      this.actor = Actor.createActor<Xonora>(idlFactory, {
        agent: this.agent,
        canisterId: this.canisterId,
      });

      console.log('Actor setup complete successfully', { 
        canisterId: this.canisterId,
        principal: principal.toText(),
        host 
      });
    } catch (error) {
      console.error('Error in setupActorWithIdentity:', error);
      throw error;
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