import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { InternetIdentity } from '@dfinity/auth-client/lib/cjs/providers/internet-identity';
import { idlFactory } from '../declarations/xonora_backend/xonora_backend.did.js';
import type { _SERVICE as Xonora } from '../declarations/xonora_backend/xonora_backend.did.d.ts';
import { getCanisterId, getICHost, getIdentityProvider } from '../config/canister';

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
  private actor: Actor<Xonora> | null = null;
  private authClient: AuthClient | null = null;
  private canisterId: string | null = null;

  async initialize() {
    try {
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

      console.log('Canister service initialized', { isAuthenticated });
      return true;
    } catch (error) {
      console.error('Failed to initialize canister service:', error);
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
      
      // Create agent with completely disabled verification for local development
      this.agent = new HttpAgent({
        identity,
        host,
        // Disable ALL signature verification for local development
        verifyQuerySignatures: false,
        // Disable update call verification
        disableNonce: true,
      });

      // Always fetch root key for local development to avoid certificate issues
      if (import.meta.env.DEV === true) {
        console.log('Fetching root key for local development...');
        try {
          await this.agent.fetchRootKey();
          console.log('Root key fetched successfully');
          
          // Additional step: Disable certificate verification at the agent level
          (this.agent as any).rootKey = await this.agent.rootKey;
          console.log('Agent configured for local development');
        } catch (err) {
          console.error('Root key fetch failed:', {
            error: err,
            message: err?.message,
            name: err?.name,
            host: getICHost()
          });
          // For local development, we need the root key - throw error if it fails
          throw new Error(`Failed to fetch root key for local development: ${err?.message || err}`);
        }
      }

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

  isAuthenticated(): boolean {
    return this.authClient?.isAuthenticated() || false;
  }

  getConnectionStatus(): 'disconnected' | 'connecting' | 'connected' | 'error' {
    if (!this.authClient) {
      console.log('Connection status: no auth client');
      return 'disconnected';
    }
    
    const isAuth = this.isAuthenticated();
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
      
      console.log('Retrying actor setup...');
      await this.setupActorWithIdentity();
      return true;
    } catch (error) {
      console.error('Retry connection failed:', error);
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
}

// Create singleton instance
export const canisterService = new CanisterService(); 