import {
  Address,
  getAddressEncoder,
  getProgramDerivedAddress,
  getU64Encoder,
  ProgramDerivedAddressBump,
  ReadonlyUint8Array,
} from "@solana/kit";
import { DROPSY_AIRDROP_PROGRAM_ADDRESS } from "../../src";
import {
  AFFILIATE_SEED,
  AIRDROP_CONFIG_SEED,
  AIRDROP_MASTER_SEED,
  AIRDROP_SEED,
  BITMAP_SEED,
  DROPSY_MASTER_SEED,
} from "../helpers/constants";

export type DropsyPda = readonly [Address<string>, ProgramDerivedAddressBump];
type Seed = ReadonlyUint8Array | string;

export async function getDropsyDerivedAddress(
  seeds: Seed[],
): Promise<DropsyPda> {
  return await getProgramDerivedAddress({
    seeds,
    programAddress: DROPSY_AIRDROP_PROGRAM_ADDRESS,
  });
}

export async function getMasterDerivedAddress(): Promise<DropsyPda> {
  return await getDropsyDerivedAddress([DROPSY_MASTER_SEED]);
}
export async function getAirdropConfigDerivedAddress(): Promise<DropsyPda> {
  return await getDropsyDerivedAddress([AIRDROP_CONFIG_SEED]);
}
export async function getAirdropMasterDerivedAddress(
  authority: Address,
): Promise<DropsyPda> {
  const seeds = [AIRDROP_MASTER_SEED, getAddressEncoder().encode(authority)];
  return await getDropsyDerivedAddress(seeds);
}
export async function getAffiliateDerivedAddress(
  authority: Address,
): Promise<DropsyPda> {
  const seeds = [AFFILIATE_SEED, getAddressEncoder().encode(authority)];
  return await getDropsyDerivedAddress(seeds);
}

export async function getAirdropDerivedAddress(
  authority: Address,
  mint: Address,
  id: number,
): Promise<DropsyPda> {
  const seeds = [
    AIRDROP_SEED,
    getAddressEncoder().encode(authority),
    getAddressEncoder().encode(mint),
    getU64Encoder().encode(id ?? 0),
  ];
  return await getDropsyDerivedAddress(seeds);
}

export async function getClaimMapDerivedAddress(
  airdrop: Address,
  id: number,
): Promise<DropsyPda> {
  const idBuffer = Buffer.alloc(2);
  idBuffer.writeUInt16LE(id);
  const seeds = [BITMAP_SEED, getAddressEncoder().encode(airdrop), idBuffer];
  return await getDropsyDerivedAddress(seeds);
}
