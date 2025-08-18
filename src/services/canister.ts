import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { InternetIdentity } from '@dfinity/auth-client/lib/cjs/providers/internet-identity';
import { idlFactory } from '../declarations/xonora_backend/xonora_backend.did.js';
import type { _SERVICE as Xonora } from '../declarations/xonora_backend/xonora_backend.did.d.ts';

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
        },
      });

      // Check if user is authenticated
      const isAuthenticated = await this.authClient.isAuthenticated();
      
      if (!isAuthenticated) {
        await this.login();
      }

      // Create agent
      this.agent = new HttpAgent({
        identity: this.authClient.getIdentity(),
        host: process.env.NODE_ENV === 'production' 
          ? 'https://ic0.app' 
          : 'http://127.0.0.1:8000',
      });

      // Set canister ID for local development
      const LOCAL_CANISTER_ID = "uxrrr-q7777-77774-qaaaq-cai";
      this.canisterId = process.env.NODE_ENV === 'production' 
        ? (process.env.VITE_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai')
        : LOCAL_CANISTER_ID;

      // Create actor
      this.actor = Actor.createActor<Xonora>(idlFactory, {
        agent: this.agent,
        canisterId: this.canisterId,
      });

      console.log('Canister service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize canister service:', error);
      return false;
    }
  }

  async login(): Promise<void> {
    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: process.env.NODE_ENV === 'production'
          ? 'https://identity.ic0.app'
          : 'http://127.0.0.1:8000?canisterId=ulvla-h7777-77774-qaacq-cai',
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
    }
  }

  getPrincipal(): string | null {
    if (this.authClient) {
      return this.authClient.getIdentity().getPrincipal().toText();
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.authClient?.isAuthenticated() || false;
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