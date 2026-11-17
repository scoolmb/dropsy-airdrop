import { address, TransactionSigner } from "@solana/kit";

import {
  CloseAirdropAsyncInput,
  CloseAirdropContext,
  CloseBitmapAsyncInput,
  DROPSY_PROTOCOL_TREASURY,
  getCloseAirdropInstructionAsync,
  getCloseBitmapInstructionAsync,
  getRedeemAirdropTokensInstructionAsync,
  RedeemAirdropTokensAsyncInput,
} from "..";

interface BuildCloseInstructionParams {
  authority: TransactionSigner<string>;
  context: CloseAirdropContext;
}

export async function buildCloseInstructions({
  authority,
  context,
}: BuildCloseInstructionParams) {
  const { mint, airdropAddress, sourceTokenAccount } = context;
  const protocolTreasury = DROPSY_PROTOCOL_TREASURY;
  const RedeemTokensInput: RedeemAirdropTokensAsyncInput = {
    airdrop: airdropAddress,
    airdropId: BigInt(context.airdropAccount.data.id),
    authority,
    protocolTreasury,
    mint,
    vault: sourceTokenAccount,
  };
  const RedeemTokensTx =
    await getRedeemAirdropTokensInstructionAsync(RedeemTokensInput);

  const closeClaimMapInput: CloseBitmapAsyncInput = {
    airdropId: BigInt(context.airdropAccount.data.id),
    id: 0,
    authority,
    protocolTreasury,
    mint,
  };

  const CloseBitmapTx =
    await getCloseBitmapInstructionAsync(closeClaimMapInput);

  const closeAirdropInput: CloseAirdropAsyncInput = {
    airdropId: BigInt(context.airdropAccount.data.id),
    authority,
    protocolTreasury,
    mint,
  };

  const closeAirdropTx =
    await getCloseAirdropInstructionAsync(closeAirdropInput);

  const instructions = [RedeemTokensTx, CloseBitmapTx, closeAirdropTx];

  return {
    instructions,
    signer: authority,
  };
}
