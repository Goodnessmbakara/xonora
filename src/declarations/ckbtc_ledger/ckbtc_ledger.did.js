export const idlFactory = ({ IDL }) => {
  const Account = IDL.Record({
    'owner': IDL.Principal,
    'subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const AccountBalance = IDL.Record({
    'account': Account,
    'balance': IDL.Nat,
  });
  const Duration = IDL.Nat64;
  const Tokens = IDL.Nat;
  const Timestamp = IDL.Nat64;
  const TransferArg = IDL.Record({
    'to': Account,
    'fee': IDL.Opt(Tokens),
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount': IDL.Opt(Subaccount),
    'created_at_time': IDL.Opt(Timestamp),
    'amount': Tokens,
  });
  const TransferError = IDL.Variant({
    'GenericError': IDL.Record({ 'message': IDL.Text }),
    'TemporarilyUnavailable': IDL.Null,
    'BadBurn': IDL.Record({ 'min_burn_amount': Tokens }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': Tokens }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': Timestamp }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': Tokens }),
    'InsufficientAllowance': IDL.Record({ 'allowance': Tokens }),
  });
  const TransferResult = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': TransferError,
  });
  const ApproveArgs = IDL.Record({
    'fee': IDL.Opt(Tokens),
    'from_subaccount': IDL.Opt(Subaccount),
    'created_at_time': IDL.Opt(Timestamp),
    'amount': Tokens,
    'expires_at': IDL.Opt(Timestamp),
    'spender': Account,
  });
  const ApproveError = IDL.Variant({
    'GenericError': IDL.Record({ 'message': IDL.Text }),
    'TemporarilyUnavailable': IDL.Null,
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': Tokens }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': Timestamp }),
    'TooOld': IDL.Null,
    'Expired': IDL.Record({ 'ledger_time': Timestamp }),
    'InsufficientFunds': IDL.Record({ 'balance': Tokens }),
    'AllowanceChanged': IDL.Record({ 'current_allowance': Tokens }),
  });
  const ApproveResult = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': ApproveError,
  });
  const TransferFromArgs = IDL.Record({
    'to': Account,
    'fee': IDL.Opt(Tokens),
    'spender_subaccount': IDL.Opt(Subaccount),
    'from': Account,
    'memo': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time': IDL.Opt(Timestamp),
    'amount': Tokens,
  });
  const TransferFromResult = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': TransferError,
  });
  const AllowanceArgs = IDL.Record({
    'account': Account,
    'spender': Account,
  });
  const Allowance = IDL.Record({
    'allowance': Tokens,
    'expires_at': IDL.Opt(Timestamp),
  });
  const MetadataValue = IDL.Variant({
    'Int': IDL.Int,
    'Nat': IDL.Nat,
    'Blob': IDL.Vec(IDL.Nat8),
    'Text': IDL.Text,
  });
  const StandardRecord = IDL.Record({
    'url': IDL.Text,
    'name': IDL.Text,
  });
  const MetadataRecord = IDL.Record({
    'value': IDL.Text,
    'name': IDL.Text,
  });
  const TokenMetadata = IDL.Record({
    'fee': Tokens,
    'decimals': IDL.Nat8,
    'name': IDL.Text,
    'symbol': IDL.Text,
    'metadata': IDL.Opt(IDL.Vec(MetadataRecord)),
    'standard': IDL.Opt(StandardRecord),
  });
  const GetBlocksArgs = IDL.Record({
    'start': IDL.Nat,
    'length': IDL.Nat,
  });
  const Block = IDL.Vec(IDL.Nat8);
  const CandidBlock = IDL.Record({
    'parent_hash': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'transaction': IDL.Record({
      'memo': IDL.Nat64,
      'operation': IDL.Opt(IDL.Variant({
        'Approve': IDL.Record({
          'fee': Tokens,
          'from': Account,
          'expires_at': IDL.Opt(Timestamp),
          'spender': Account,
          'amount': Tokens,
        }),
        'Burn': IDL.Record({
          'from': Account,
          'amount': Tokens,
        }),
        'Mint': IDL.Record({
          'to': Account,
          'amount': Tokens,
        }),
        'Transfer': IDL.Record({
          'to': Account,
          'fee': Tokens,
          'from': Account,
          'amount': Tokens,
        }),
        'TransferFrom': IDL.Record({
          'to': Account,
          'fee': Tokens,
          'from': Account,
          'amount': Tokens,
          'spender': Account,
        }),
      })),
      'created_at_time': Timestamp,
      'amount': Tokens,
    }),
    'timestamp': Timestamp,
  });
  const BlockRange = IDL.Record({
    'blocks': IDL.Vec(CandidBlock),
  });
  const GetBlocksResult = IDL.Variant({
    'Ok': BlockRange,
    'Err': IDL.Text,
  });
  const QueryBlockArchiveFn = IDL.Func([GetBlocksArgs], [GetBlocksResult], ['query']);
  const QueryEncodedBlocksArgs = IDL.Record({
    'start': IDL.Nat,
    'length': IDL.Nat,
  });
  const QueryEncodedBlocksResult = IDL.Variant({
    'Ok': IDL.Record({
      'certificate': IDL.Opt(IDL.Vec(IDL.Nat8)),
      'blocks': IDL.Vec(Block),
      'first_index': IDL.Nat,
      'chain_length': IDL.Nat,
      'archived_blocks': IDL.Vec(IDL.Record({
        'callback': QueryBlockArchiveFn,
        'start': IDL.Nat,
        'length': IDL.Nat,
      })),
    }),
    'Err': IDL.Text,
  });
  const QueryBlocksArgs = IDL.Record({
    'start': IDL.Nat,
    'length': IDL.Nat,
  });
  const ArchivedBlocks = IDL.Record({
    'callback': QueryBlockArchiveFn,
    'start': IDL.Nat,
    'length': IDL.Nat,
  });
  const QueryBlocksResult = IDL.Record({
    'certificate': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'blocks': IDL.Vec(CandidBlock),
    'first_index': IDL.Nat,
    'chain_length': IDL.Nat,
    'archived_blocks': IDL.Vec(ArchivedBlocks),
  });
  const NotifyCanisterArgs = IDL.Record({
    'to_subaccount': IDL.Opt(Subaccount),
    'from_subaccount': IDL.Opt(Subaccount),
    'to_canister': IDL.Principal,
    'max_fee': Tokens,
    'block_height': IDL.Nat,
  });
  const NotifyError = IDL.Variant({
    'GenericError': IDL.Record({ 'message': IDL.Text }),
    'TemporarilyUnavailable': IDL.Null,
    'BadFee': IDL.Record({ 'expected_fee': Tokens }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': Timestamp }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': Tokens }),
  });
  const NotifyResult = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': NotifyError,
  });
  const NotifyTopUpArgs = IDL.Record({
    'block_index': IDL.Nat,
    'canister_id': IDL.Principal,
  });
  const NotifyTopUpResult = IDL.Variant({
    'Ok': IDL.Nat,
    'Err': NotifyError,
  });
  const ValidateBlockArgs = IDL.Record({
    'block': CandidBlock,
    'parent_hash': IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const ValidationResult = IDL.Variant({
    'Ok': IDL.Null,
    'Err': IDL.Text,
  });
  const RetrieveBtcArgs = IDL.Record({
    'address': IDL.Text,
    'amount': IDL.Nat64,
    'subaccount': IDL.Opt(Subaccount),
  });
  const RetrieveBtcError = IDL.Variant({
    'GenericError': IDL.Record({ 'message': IDL.Text }),
    'TemporarilyUnavailable': IDL.Null,
    'AlreadyProcessing': IDL.Null,
    'AmountTooLow': IDL.Record({ 'min_amount': IDL.Nat64 }),
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat64 }),
    'InvalidAddress': IDL.Record({ 'address': IDL.Text }),
    'MalformedAddress': IDL.Record({ 'address': IDL.Text }),
  });
  const RetrieveBtcOk = IDL.Record({
    'block_index': IDL.Nat,
  });
  const RetrieveBtcResult = IDL.Variant({
    'Ok': RetrieveBtcOk,
    'Err': RetrieveBtcError,
  });
  const RetrieveBtcStatusArgs = IDL.Record({
    'block_index': IDL.Nat,
  });
  const RetrieveBtcStatus = IDL.Variant({
    'Signing': IDL.Null,
    'AmountTooLow': IDL.Record({ 'min_amount': IDL.Nat64 }),
    'Confirmed': IDL.Record({
      'txid': IDL.Vec(IDL.Nat8),
      'utxos': IDL.Vec(IDL.Record({
        'height': IDL.Nat32,
        'value': IDL.Nat64,
        'outpoint': IDL.Record({
          'txid': IDL.Vec(IDL.Nat8),
          'vout': IDL.Nat32,
        }),
      })),
    }),
    'Sending': IDL.Record({
      'utxos': IDL.Vec(IDL.Record({
        'height': IDL.Nat32,
        'value': IDL.Nat64,
        'outpoint': IDL.Record({
          'txid': IDL.Vec(IDL.Nat8),
          'vout': IDL.Nat32,
        }),
      })),
    }),
    'Submitted': IDL.Record({
      'utxos': IDL.Vec(IDL.Record({
        'height': IDL.Nat32,
        'value': IDL.Nat64,
        'outpoint': IDL.Record({
          'txid': IDL.Vec(IDL.Nat8),
          'vout': IDL.Nat32,
        }),
      })),
    }),
    'Pending': IDL.Record({
      'utxos': IDL.Vec(IDL.Record({
        'height': IDL.Nat32,
        'value': IDL.Nat64,
        'outpoint': IDL.Record({
          'txid': IDL.Vec(IDL.Nat8),
          'vout': IDL.Nat32,
        }),
      })),
    }),
    'Reimbursed': IDL.Record({
      'reimbursed_in_block': IDL.Nat,
      'burn_block_index': IDL.Nat,
      'utxos': IDL.Vec(IDL.Record({
        'height': IDL.Nat32,
        'value': IDL.Nat64,
        'outpoint': IDL.Record({
          'txid': IDL.Vec(IDL.Nat8),
          'vout': IDL.Nat32,
        }),
      })),
    }),
    'AmountTooLow': IDL.Record({ 'min_amount': IDL.Nat64 }),
    'Unknown': IDL.Null,
  });
  const RetrieveBtcStatusResult = IDL.Variant({
    'Ok': RetrieveBtcStatus,
    'Err': IDL.Text,
  });
  const UpdateBalanceArgs = IDL.Record({
    'subaccount': IDL.Opt(Subaccount),
    'address': IDL.Text,
  });
  const UpdateBalanceError = IDL.Variant({
    'GenericError': IDL.Record({ 'message': IDL.Text }),
    'TemporarilyUnavailable': IDL.Null,
    'AlreadyProcessing': IDL.Null,
    'NoNewUtxos': IDL.Record({
      'required_confirmations': IDL.Nat32,
      'current_confirmations': IDL.Opt(IDL.Nat32),
      'txid': IDL.Opt(IDL.Vec(IDL.Nat8)),
    }),
  });
  const UpdateBalanceOk = IDL.Record({
    'block_index': IDL.Nat,
    'balance': IDL.Nat64,
  });
  const UpdateBalanceResult = IDL.Variant({
    'Ok': UpdateBalanceOk,
    'Err': UpdateBalanceError,
  });
  const GetUtxosArgs = IDL.Record({
    'address': IDL.Text,
    'min_confirmations': IDL.Opt(IDL.Nat32),
  });
  const GetUtxosResult = IDL.Record({
    'utxos': IDL.Vec(IDL.Record({
      'height': IDL.Nat32,
      'value': IDL.Nat64,
      'outpoint': IDL.Record({
        'txid': IDL.Vec(IDL.Nat8),
        'vout': IDL.Nat32,
      }),
    })),
    'tip_block_hash': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'tip_height': IDL.Nat32,
  });
  const GetCurrentFeePercentilesArgs = IDL.Record({});
  const GetCurrentFeePercentilesResult = IDL.Vec(IDL.Nat64);
  const SendBtcArgs = IDL.Record({
    'destination_address': IDL.Text,
    'amount_in_satoshis': IDL.Nat64,
    'subaccount': IDL.Opt(Subaccount),
  });
  const SendBtcError = IDL.Variant({
    'GenericError': IDL.Record({ 'message': IDL.Text }),
    'TemporarilyUnavailable': IDL.Null,
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat64 }),
    'BadBurn': IDL.Record({ 'min_burn_amount': IDL.Nat64 }),
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat64 }),
    'InsufficientAllowance': IDL.Record({ 'allowance': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'CreatedInFuture': IDL.Record({ 'ledger_time': Timestamp }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'TemporarilyUnavailable': IDL.Null,
    'CallerRejected': IDL.Null,
  });
  const SendBtcOk = IDL.Record({
    'block_index': IDL.Nat,
  });
  const SendBtcResult = IDL.Variant({
    'Ok': SendBtcOk,
    'Err': SendBtcError,
  });
  const GetBtcAddressArgs = IDL.Record({
    'subaccount': IDL.Opt(Subaccount),
  });
  const GetBtcAddressResult = IDL.Record({
    'address': IDL.Text,
  });
  const GetP2pkhAddressArgs = IDL.Record({
    'subaccount': IDL.Opt(Subaccount),
  });
  const GetP2pkhAddressResult = IDL.Record({
    'address': IDL.Text,
  });
  const GetP2shAddressArgs = IDL.Record({
    'subaccount': IDL.Opt(Subaccount),
  });
  const GetP2shAddressResult = IDL.Record({
    'address': IDL.Text,
  });
  return IDL.Service({
    'icrc1_balance_of': IDL.Func([Account], [Tokens], ['query']),
    'icrc1_decimals': IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee': IDL.Func([], [Tokens], ['query']),
    'icrc1_metadata': IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))], ['query']),
    'icrc1_mint': IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8)), IDL.Nat64, IDL.Principal, IDL.Opt(Subaccount), IDL.Opt(Timestamp)], [IDL.Variant({ 'Ok': IDL.Nat, 'Err': IDL.Text })], []),
    'icrc1_name': IDL.Func([], [IDL.Text], ['query']),
    'icrc1_supported_standards': IDL.Func([], [IDL.Vec(StandardRecord)], ['query']),
    'icrc1_symbol': IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply': IDL.Func([], [Tokens], ['query']),
    'icrc1_transfer': IDL.Func([TransferArg], [TransferResult], []),
    'icrc2_approve': IDL.Func([ApproveArgs], [ApproveResult], []),
    'icrc2_allowance': IDL.Func([AllowanceArgs], [Allowance], ['query']),
    'icrc2_transfer_from': IDL.Func([TransferFromArgs], [TransferFromResult], []),
    'get_blocks': IDL.Func([GetBlocksArgs], [GetBlocksResult], ['query']),
    'get_encoded_blocks': IDL.Func([QueryEncodedBlocksArgs], [QueryEncodedBlocksResult], ['query']),
    'get_blocks': IDL.Func([QueryBlocksArgs], [QueryBlocksResult], ['query']),
    'notify_dfx': IDL.Func([NotifyCanisterArgs], [NotifyResult], []),
    'notify_top_up': IDL.Func([NotifyTopUpArgs], [NotifyTopUpResult], []),
    'validate_block': IDL.Func([ValidateBlockArgs], [ValidationResult], []),
    'retrieve_btc': IDL.Func([RetrieveBtcArgs], [RetrieveBtcResult], []),
    'retrieve_btc_status': IDL.Func([RetrieveBtcStatusArgs], [RetrieveBtcStatusResult], ['query']),
    'update_balance': IDL.Func([UpdateBalanceArgs], [UpdateBalanceResult], []),
    'get_utxos': IDL.Func([GetUtxosArgs], [GetUtxosResult], ['query']),
    'get_current_fee_percentiles': IDL.Func([GetCurrentFeePercentilesArgs], [GetCurrentFeePercentilesResult], ['query']),
    'send_btc': IDL.Func([SendBtcArgs], [SendBtcResult], []),
    'get_btc_address': IDL.Func([GetBtcAddressArgs], [GetBtcAddressResult], ['query']),
    'get_p2pkh_address': IDL.Func([GetP2pkhAddressArgs], [GetP2pkhAddressResult], ['query']),
    'get_p2sh_address': IDL.Func([GetP2shAddressArgs], [GetP2shAddressResult], ['query']),
  });
};
