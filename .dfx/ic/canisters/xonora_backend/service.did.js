export const idlFactory = ({ IDL }) => {
  const PoolId = IDL.Text;
  const APY = IDL.Float64;
  const Amount = IDL.Nat64;
  const Pool = IDL.Record({
    'id' : PoolId,
    'apy' : APY,
    'maxCapacity' : Amount,
    'name' : IDL.Text,
    'isActive' : IDL.Bool,
    'totalStaked' : Amount,
  });
  const Result_5 = IDL.Variant({ 'ok' : Pool, 'err' : IDL.Text });
  const UserId = IDL.Principal;
  const StakeId = IDL.Nat;
  const Portfolio = IDL.Record({
    'userId' : UserId,
    'totalEarned' : Amount,
    'activeStakes' : IDL.Vec(StakeId),
    'totalStaked' : Amount,
  });
  const Result_4 = IDL.Variant({ 'ok' : Portfolio, 'err' : IDL.Text });
  const Timestamp = IDL.Int;
  const Stake = IDL.Record({
    'id' : StakeId,
    'startTime' : Timestamp,
    'userId' : UserId,
    'lastClaimTime' : Timestamp,
    'isActive' : IDL.Bool,
    'amount' : Amount,
    'poolId' : PoolId,
  });
  const Result_3 = IDL.Variant({ 'ok' : Stake, 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : StakeId, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : Amount, 'err' : IDL.Text });
  const Xonora = IDL.Service({
    'getPool' : IDL.Func([PoolId], [Result_5], ['query']),
    'getPools' : IDL.Func([], [IDL.Vec(Pool)], ['query']),
    'getPortfolio' : IDL.Func([UserId], [Result_4], ['query']),
    'getStake' : IDL.Func([StakeId], [Result_3], ['query']),
    'getSystemInfo' : IDL.Func(
        [],
        [
          IDL.Record({
            'owner' : IDL.Principal,
            'isInitialized' : IDL.Bool,
            'totalStakes' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserStakes' : IDL.Func([UserId], [IDL.Vec(Stake)], ['query']),
    'initialize' : IDL.Func([], [Result_2], []),
    'stake' : IDL.Func([Amount, PoolId], [Result_1], []),
    'unstake' : IDL.Func([StakeId], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
  return Xonora;
};
export const init = ({ IDL }) => { return []; };
