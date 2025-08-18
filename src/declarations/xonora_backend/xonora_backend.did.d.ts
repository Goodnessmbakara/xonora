import type { Principal } from '@dfinity/principal';
import type { ActorMethod, ActorSubclass } from '@dfinity/agent';

export interface Pool {
  'id': string;
  'apy': number;
  'maxCapacity': bigint;
  'name': string;
  'isActive': boolean;
  'totalStaked': bigint;
}

export interface Portfolio {
  'userId': Principal;
  'totalEarned': bigint;
  'activeStakes': bigint[];
  'totalStaked': bigint;
}

export interface Stake {
  'id': bigint;
  'startTime': bigint;
  'userId': Principal;
  'lastClaimTime': bigint;
  'isActive': boolean;
  'amount': bigint;
  'poolId': string;
}

export interface SystemInfo {
  'owner': Principal;
  'isInitialized': boolean;
  'totalStakes': bigint;
}

export type Result_5 = { 'ok': Pool } | { 'err': string };
export type Result_4 = { 'ok': Portfolio } | { 'err': string };
export type Result_3 = { 'ok': Stake } | { 'err': string };
export type Result_2 = { 'ok': string } | { 'err': string };
export type Result_1 = { 'ok': bigint } | { 'err': string };
export type Result = { 'ok': bigint } | { 'err': string };

export interface Xonora {
  'getPool': ActorMethod<[string], Result_5>;
  'getPools': ActorMethod<[], Pool[]>;
  'getPortfolio': ActorMethod<[Principal], Result_4>;
  'getStake': ActorMethod<[bigint], Result_3>;
  'getSystemInfo': ActorMethod<[], SystemInfo>;
  'getUserStakes': ActorMethod<[Principal], Stake[]>;
  'initialize': ActorMethod<[], Result_2>;
  'stake': ActorMethod<[bigint, string], Result_1>;
  'unstake': ActorMethod<[bigint], Result>;
  'whoami': ActorMethod<[], Principal>;
}

export interface _SERVICE extends Xonora {}
