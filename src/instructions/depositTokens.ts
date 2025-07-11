/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  combineCodec,
  fixDecoderSize,
  fixEncoderSize,
  getBytesDecoder,
  getBytesEncoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  transformEncoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type IAccountMeta,
  type IAccountSignerMeta,
  type IInstruction,
  type IInstructionWithAccounts,
  type IInstructionWithData,
  type ReadonlyAccount,
  type ReadonlySignerAccount,
  type ReadonlyUint8Array,
  type TransactionSigner,
  type WritableAccount,
} from '@solana/kit';
import { DROPSY_PROGRAM_ADDRESS } from '../programs';
import { getAccountMetaFactory, type ResolvedAccount } from '../shared';

export const DEPOSIT_TOKENS_DISCRIMINATOR = new Uint8Array([
  176, 83, 229, 18, 191, 143, 176, 150,
]);

export function getDepositTokensDiscriminatorBytes() {
  return fixEncoderSize(getBytesEncoder(), 8).encode(
    DEPOSIT_TOKENS_DISCRIMINATOR
  );
}

export type DepositTokensInstruction<
  TProgram extends string = typeof DROPSY_PROGRAM_ADDRESS,
  TAccountSourceTokenAccount extends string | IAccountMeta<string> = string,
  TAccountVault extends string | IAccountMeta<string> = string,
  TAccountAirdrop extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountSourceTokenAccount extends string
        ? WritableAccount<TAccountSourceTokenAccount>
        : TAccountSourceTokenAccount,
      TAccountVault extends string
        ? WritableAccount<TAccountVault>
        : TAccountVault,
      TAccountAirdrop extends string
        ? WritableAccount<TAccountAirdrop>
        : TAccountAirdrop,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountAuthority extends string
        ? ReadonlySignerAccount<TAccountAuthority> &
            IAccountSignerMeta<TAccountAuthority>
        : TAccountAuthority,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      ...TRemainingAccounts,
    ]
  >;

export type DepositTokensInstructionData = {
  discriminator: ReadonlyUint8Array;
  amount: bigint;
};

export type DepositTokensInstructionDataArgs = { amount: number | bigint };

export function getDepositTokensInstructionDataEncoder(): Encoder<DepositTokensInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', fixEncoderSize(getBytesEncoder(), 8)],
      ['amount', getU64Encoder()],
    ]),
    (value) => ({ ...value, discriminator: DEPOSIT_TOKENS_DISCRIMINATOR })
  );
}

export function getDepositTokensInstructionDataDecoder(): Decoder<DepositTokensInstructionData> {
  return getStructDecoder([
    ['discriminator', fixDecoderSize(getBytesDecoder(), 8)],
    ['amount', getU64Decoder()],
  ]);
}

export function getDepositTokensInstructionDataCodec(): Codec<
  DepositTokensInstructionDataArgs,
  DepositTokensInstructionData
> {
  return combineCodec(
    getDepositTokensInstructionDataEncoder(),
    getDepositTokensInstructionDataDecoder()
  );
}

export type DepositTokensInput<
  TAccountSourceTokenAccount extends string = string,
  TAccountVault extends string = string,
  TAccountAirdrop extends string = string,
  TAccountMint extends string = string,
  TAccountAuthority extends string = string,
  TAccountTokenProgram extends string = string,
> = {
  sourceTokenAccount: Address<TAccountSourceTokenAccount>;
  vault: Address<TAccountVault>;
  airdrop: Address<TAccountAirdrop>;
  mint: Address<TAccountMint>;
  authority: TransactionSigner<TAccountAuthority>;
  tokenProgram?: Address<TAccountTokenProgram>;
  amount: DepositTokensInstructionDataArgs['amount'];
};

export function getDepositTokensInstruction<
  TAccountSourceTokenAccount extends string,
  TAccountVault extends string,
  TAccountAirdrop extends string,
  TAccountMint extends string,
  TAccountAuthority extends string,
  TAccountTokenProgram extends string,
  TProgramAddress extends Address = typeof DROPSY_PROGRAM_ADDRESS,
>(
  input: DepositTokensInput<
    TAccountSourceTokenAccount,
    TAccountVault,
    TAccountAirdrop,
    TAccountMint,
    TAccountAuthority,
    TAccountTokenProgram
  >,
  config?: { programAddress?: TProgramAddress }
): DepositTokensInstruction<
  TProgramAddress,
  TAccountSourceTokenAccount,
  TAccountVault,
  TAccountAirdrop,
  TAccountMint,
  TAccountAuthority,
  TAccountTokenProgram
> {
  // Program address.
  const programAddress = config?.programAddress ?? DROPSY_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    sourceTokenAccount: {
      value: input.sourceTokenAccount ?? null,
      isWritable: true,
    },
    vault: { value: input.vault ?? null, isWritable: true },
    airdrop: { value: input.airdrop ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: false },
    authority: { value: input.authority ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value =
      'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' as Address<'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'>;
  }

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.sourceTokenAccount),
      getAccountMeta(accounts.vault),
      getAccountMeta(accounts.airdrop),
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.authority),
      getAccountMeta(accounts.tokenProgram),
    ],
    programAddress,
    data: getDepositTokensInstructionDataEncoder().encode(
      args as DepositTokensInstructionDataArgs
    ),
  } as DepositTokensInstruction<
    TProgramAddress,
    TAccountSourceTokenAccount,
    TAccountVault,
    TAccountAirdrop,
    TAccountMint,
    TAccountAuthority,
    TAccountTokenProgram
  >;

  return instruction;
}

export type ParsedDepositTokensInstruction<
  TProgram extends string = typeof DROPSY_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    sourceTokenAccount: TAccountMetas[0];
    vault: TAccountMetas[1];
    airdrop: TAccountMetas[2];
    mint: TAccountMetas[3];
    authority: TAccountMetas[4];
    tokenProgram: TAccountMetas[5];
  };
  data: DepositTokensInstructionData;
};

export function parseDepositTokensInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedDepositTokensInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 6) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      sourceTokenAccount: getNextAccount(),
      vault: getNextAccount(),
      airdrop: getNextAccount(),
      mint: getNextAccount(),
      authority: getNextAccount(),
      tokenProgram: getNextAccount(),
    },
    data: getDepositTokensInstructionDataDecoder().decode(instruction.data),
  };
}
