import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type APY = number;
export type Amount = bigint;
export interface Pool {
  'id' : PoolId,
  'apy' : APY,
  'maxCapacity' : Amount,
  'name' : string,
  'isActive' : boolean,
  'totalStaked' : Amount,
}
export type PoolId = string;
export interface Portfolio {
  'userId' : UserId,
  'totalEarned' : Amount,
  'activeStakes' : Array<StakeId>,
  'totalStaked' : Amount,
}
export type Result = { 'ok' : Amount } |
  { 'err' : string };
export type Result_1 = { 'ok' : StakeId } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Result_3 = { 'ok' : Stake } |
  { 'err' : string };
export type Result_4 = { 'ok' : Portfolio } |
  { 'err' : string };
export type Result_5 = { 'ok' : Pool } |
  { 'err' : string };
export interface Stake {
  'id' : StakeId,
  'startTime' : Timestamp,
  'userId' : UserId,
  'lastClaimTime' : Timestamp,
  'isActive' : boolean,
  'amount' : Amount,
  'poolId' : PoolId,
}
export type StakeId = bigint;
export type Timestamp = bigint;
export type UserId = Principal;
export interface Xonora {
  'getPool' : ActorMethod<[PoolId], Result_5>,
  'getPools' : ActorMethod<[], Array<Pool>>,
  'getPortfolio' : ActorMethod<[UserId], Result_4>,
  'getStake' : ActorMethod<[StakeId], Result_3>,
  'getSystemInfo' : ActorMethod<
    [],
    { 'owner' : Principal, 'isInitialized' : boolean, 'totalStakes' : bigint }
  >,
  'getUserStakes' : ActorMethod<[UserId], Array<Stake>>,
  'initialize' : ActorMethod<[], Result_2>,
  'stake' : ActorMethod<[Amount, PoolId], Result_1>,
  'unstake' : ActorMethod<[StakeId], Result>,
  'whoami' : ActorMethod<[], Principal>,
}
export interface _SERVICE extends Xonora {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
