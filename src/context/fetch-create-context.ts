import { address, Rpc, SolanaRpcApi } from "@solana/kit";
import { getAirdropDerivedAddress } from "../helpers/derive";

import { fetchMaybeMint, findAssociatedTokenPda } from "@solana-program/token";
import { fetchMaybeAirdrop, fetchMaybeAirdropMaster } from "../accounts";

export type CreateAirdropContext = Awaited<
  ReturnType<typeof fetchCreateAirdropContext>
>;

export async function fetchCreateAirdropContext(
  rpc: Rpc<SolanaRpcApi>,
  airdropMasterAddress: string,
  owner: string,
  mint: string,
  id?: number,
) {
  const airdropId = id ?? 0;
  const airdropMaster = await fetchMaybeAirdropMaster(
    rpc,
    address(airdropMasterAddress),
  );
  if (!airdropMaster.exists) throw new Error("invalid airdrop Master address");
  const mintAccount = await fetchMaybeMint(rpc, address(mint));
  if (!mintAccount.exists) throw new Error("invalid mint address");
  const [airdrop] = await getAirdropDerivedAddress(
    address(owner),
    address(mint),
    airdropId,
  );
  const [sourceTokenAccount] = await findAssociatedTokenPda({
    owner: address(owner),
    mint: address(mint),
    tokenProgram: mintAccount.programAddress,
  });

  return {
    airdrop,
    mintAccount,
    sourceTokenAccount,
    airdropMaster,
    id: airdropId,
  };
}

export async function fetchUpdateAirdropContext(
  rpc: Rpc<SolanaRpcApi>,
  airdropAddress: string,
) {
  const airdrop = await fetchMaybeAirdrop(rpc, address(airdropAddress));
  if (!airdrop.exists) throw new Error("invalid airdrop address");
  const mintAccount = await fetchMaybeMint(rpc, address(airdrop.data.mint));
  if (!mintAccount.exists) throw new Error("invalid mint address");

  return {
    airdrop,
    mintAccount,
  };
}
