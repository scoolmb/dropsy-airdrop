import {
  Address,
  address,
  createNoopSigner,
  ReadonlyUint8Array,
  TransactionSigner,
} from "@solana/kit";

import {
  CreateAirdropAsyncInput,
  CreateBitmapAsyncInput,
  DepositTokensAsyncInput,
  getCreateAirdropInstructionAsync,
  getCreateBitmapInstructionAsync,
  getDepositTokensInstructionAsync,
} from "..";

import { CreateAirdropContext } from "../context";
import { fromUiAmount, toMerkleRootBytes } from "./common";
import { DROPSY_PROTOCOL_TREASURY, MAX_BITMAP_CLAIM } from ".";

interface BuildCreateAirdropInstructionsParams {
  authority: TransactionSigner<string>;
  mint: Address;
  context: CreateAirdropContext;
  supply: string;
  total: number;
  merkleRootHex?: string;
  startTime?: string;
  endTime?: string;
  delegate?: string;
  version?: number;
}

export async function buildCreateAirdropInstructions({
  authority,
  mint,
  context,
  supply,
  merkleRootHex,
  startTime,
  endTime,
  delegate,
  total,
  version = 0,
}: BuildCreateAirdropInstructionsParams) {
  const { mintAccount, airdrop, airdropMaster, sourceTokenAccount, id } =
    context;
  const airdropId = BigInt(id);
  const amount = BigInt(fromUiAmount(supply, mintAccount.data.decimals));
  const merkleRoot = merkleRootHex ? toMerkleRootBytes(merkleRootHex) : null;
  const protocolTreasury = DROPSY_PROTOCOL_TREASURY;
  const masterCreator = airdropMaster.data.creator;
  const treasury = airdropMaster.data.treasury;
  const delegateAuthority = delegate ? address(delegate) : null;
  const startsAt = startTime
    ? BigInt(new Date(startTime).getTime() / 1000)
    : null;
  const endsAt = endTime ? BigInt(new Date(endTime).getTime() / 1000) : null;

  const createAirdropInput: CreateAirdropAsyncInput = {
    masterCreator,
    treasury,
    protocolTreasury,
    mint,
    merkleRoot,
    airdrop,
    startsAt,
    endsAt,
    version,
    id: airdropId,
    delegateAuthority,
    authority,
  };
  const createClaimMapInput: CreateBitmapAsyncInput = {
    masterCreator,
    treasury,
    airdropId,
    mint,
    protocolTreasury,
    id: 0,
    total,
    authority,
  };
  const depositTokensInput: DepositTokensAsyncInput = {
    airdropId,
    mint,
    sourceTokenAccount,
    amount,
    authority,
  };

  const createAirdropIx =
    await getCreateAirdropInstructionAsync(createAirdropInput);

  const createBitmapIx =
    await getCreateBitmapInstructionAsync(createClaimMapInput);

  const createDepositIx =
    await getDepositTokensInstructionAsync(depositTokensInput);

  const instructions = [createAirdropIx, createBitmapIx, createDepositIx];
  return {
    instructions,
    signer: authority,
  };
}

export async function buildUpdateAirdropInstruction({
  authority,
  mint,
  context,
  supply,
  merkleRootHex,
  startTime,
  endTime,
  delegate,
  total,
  version = 0,
}: BuildCreateAirdropInstructionsParams) {
  const { mintAccount, airdrop, airdropMaster, sourceTokenAccount, id } =
    context;
  const airdropId = BigInt(id);
  const amount = BigInt(fromUiAmount(supply, mintAccount.data.decimals));
  const merkleRoot = merkleRootHex ? toMerkleRootBytes(merkleRootHex) : null;
  const protocolTreasury = DROPSY_PROTOCOL_TREASURY;
  const masterCreator = airdropMaster.data.creator;
  const treasury = airdropMaster.data.treasury;
  const delegateAuthority = delegate ? address(delegate) : null;
  const startsAt = startTime
    ? BigInt(new Date(startTime).getTime() / 1000)
    : null;
  const endsAt = endTime ? BigInt(new Date(endTime).getTime() / 1000) : null;

  const updateAirdropInput: CreateAirdropAsyncInput = {
    masterCreator,
    treasury,
    protocolTreasury,
    mint,
    merkleRoot,
    airdrop,
    startsAt,
    endsAt,
    version,
    id: airdropId,
    delegateAuthority,
    authority,
  };

  const depositTokensInput: DepositTokensAsyncInput = {
    airdropId,
    mint,
    sourceTokenAccount,
    amount,
    authority,
  };

  const updateAirdropIx =
    await getCreateAirdropInstructionAsync(updateAirdropInput);

  const createDepositIx =
    await getDepositTokensInstructionAsync(depositTokensInput);

  const instructions = [updateAirdropIx, createDepositIx];
  return {
    instructions,
    signer: authority,
  };
}
