import { address, Rpc, SolanaRpcApi } from "@solana/kit";
import {
  fetchAirdrop,
  fetchAirdropMaster,
  fetchMaybeAirdrop,
  getClaimMapDerivedAddress,
} from "../";

import { fetchMint, findAssociatedTokenPda } from "@solana-program/token";

export type CloseAirdropContext = Awaited<
  ReturnType<typeof fetchCloseAirdropContext>
>;
export async function fetchCloseAirdropContext(
  rpc: Rpc<SolanaRpcApi>,
  airdrop: string,
) {
  const airdropAddress = address(airdrop);

  const airdropAccount = await fetchMaybeAirdrop(rpc, address(airdrop));
  if (!airdropAccount.exists) throw new Error("Airdrop Not Found");

  const [bitmapAccountAddress] = await getClaimMapDerivedAddress(
    address(airdrop),
    0,
  );

  const master = await fetchAirdropMaster(rpc, airdropAccount.data.master);

  const mint = address(airdropAccount.data.mint);

  const mintAccount = await fetchMint(rpc, mint);

  const [sourceTokenAccount] = await findAssociatedTokenPda({
    owner: address(airdrop),
    mint,
    tokenProgram: mintAccount.programAddress,
  });

  return {
    airdropAddress,
    airdropAccount,
    bitmapAccountAddress,
    master,
    mint,
    sourceTokenAccount,
  };
}
