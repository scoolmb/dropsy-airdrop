import { Address, address, TransactionSigner } from "@solana/kit";
import {
  CloseBitmapAsyncInput,
  CreateAirdropAsyncInput,
  CreateBitmapAsyncInput,
  DepositTokensAsyncInput,
  DROPSY_AIRDROP_PROGRAM_ADDRESS,
  RedeemAirdropTokensAsyncInput,
} from "../../src/";

import {
  getAirdropDerivedAddress,
  getClaimMapDerivedAddress,
} from "../helpers/derive";

import { createMerkleTree, getMerkleRootArray } from "../helpers/merkle";
import { findAssociatedTokenPda } from "@solana-program/token";
import { DROPSY_PROTOCOL_TREASURY } from "./constants";

export const getDefaultAirdropData = async (
  authority: TransactionSigner,
  mint: Address,
  id: number,
): Promise<CreateAirdropAsyncInput> => {
  const claimList = [
    {
      index: 0,
      address: "6TMmpVof9fGXak2VUgP4X9sXNfPHA7XWyi9ZMUCrHP6A",
      amount: 500,
    },
    {
      index: 1,
      address: "CeN4TqZaxMc9adCeCtE6VqfpwRbmt6DRYMnH41vv9V5F",
      amount: 500,
    },
  ];

  const merkleTree = createMerkleTree(claimList);
  const merkleRootArray = getMerkleRootArray(merkleTree);

  const [airdropPda, airdropBump] = await getAirdropDerivedAddress(
    authority.address,
    mint,
    id,
  );

  return {
    protocolTreasury: DROPSY_PROTOCOL_TREASURY,
    authority,
    delegateAuthority: authority.address,
    mint,
    airdrop: airdropPda,
    merkleRoot: null,
    startsAt: BigInt(10), // BigInt(.....)
    endsAt: null, // BigInt(.....)
    id,
    version: 0,
    masterCreator: address("5gB7WLoBWELAvRDYPUvGj7e7BHEv65j6YDhissdMTQ4F"),
    treasury: address("5gB7WLoBWELAvRDYPUvGj7e7BHEv65j6YDhissdMTQ4F"),
  };
};

export const getDefaultCreateClaimMapInput = async (
  authority: TransactionSigner,
  mint: Address,
  id: number,
): Promise<CreateBitmapAsyncInput> => {
  return {
    airdropId: BigInt(id),
    mint,
    protocolTreasury: DROPSY_PROTOCOL_TREASURY,
    masterCreator: address("5gB7WLoBWELAvRDYPUvGj7e7BHEv65j6YDhissdMTQ4F"),
    treasury: address("5gB7WLoBWELAvRDYPUvGj7e7BHEv65j6YDhissdMTQ4F"),
    id: 0,
    total: 5000,
    authority,
  };
};

export const getDefaultDepositTokensInput = async (
  authority: TransactionSigner,
  id: number,
  mint: Address,
  amount: bigint,
  tokenProgram: Address,
): Promise<DepositTokensAsyncInput> => {
  const [sourceTokenAccount] = await findAssociatedTokenPda({
    owner: authority.address,
    mint,
    tokenProgram,
  });
  const [airdropPda, airdropBump] = await getAirdropDerivedAddress(
    authority.address,
    mint,
    id,
  );

  return {
    airdropId: BigInt(id),
    mint,
    sourceTokenAccount,
    amount: BigInt(amount),
    authority,
  };
};

export const getDefaultRedeemTokensInput = async (
  authority: TransactionSigner,
  id: number,
  mint: Address,
  tokenProgram: Address,
): Promise<RedeemAirdropTokensAsyncInput> => {
  const [airdrop, airdropBump] = await getAirdropDerivedAddress(
    authority.address,
    mint,
    id,
  );

  const [sourceTokenAccount] = await findAssociatedTokenPda({
    owner: airdrop,
    mint,
    tokenProgram,
  });

  return {
    airdrop,
    airdropId: BigInt(id),
    mint,
    vault: sourceTokenAccount,
    authority,
    protocolTreasury: DROPSY_PROTOCOL_TREASURY,
  };
};

export const getDefaultCloseBitmapInput = async (
  authority: TransactionSigner,
  mint: Address,
  airdrop: Address,
  bitmapId: number = 0,
  airdropId: number = 0,
): Promise<CloseBitmapAsyncInput> => {
  console.log("getting default Bitmap Close from airdrop : ", airdrop);
  const [bitmap, _bump] = await getClaimMapDerivedAddress(airdrop, bitmapId);

  return {
    airdrop,
    bitmap,
    protocolTreasury: DROPSY_PROTOCOL_TREASURY,
    mint,
    authority,
    airdropId,
    id: bitmapId,
  };
};
