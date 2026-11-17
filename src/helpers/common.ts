import { ReadonlyUint8Array } from "@solana/kit";

export function fromUiAmount(uiAmount: string | number, decimals = 9): bigint {
  // Convert string to number
  const amountNum =
    typeof uiAmount === "string" ? parseFloat(uiAmount) : uiAmount;

  if (isNaN(amountNum) || amountNum < 0) {
    throw new Error("Invalid amount");
  }

  // Multiply by 10^decimals as string to avoid floating point precision issues
  const multiplier = 10 ** decimals;
  const lamportsStr = (amountNum * multiplier).toFixed(0); // round to nearest integer as string

  return BigInt(lamportsStr);
}

export const formatAddress = (address?: string) =>
  address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

export function formatNumber(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) return "0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue < 1_000) return `${sign}${absValue}`;
  if (absValue < 1_000_000)
    return `${sign}${(absValue / 1_000).toFixed(decimals)}K`;
  if (absValue < 1_000_000_000)
    return `${sign}${(absValue / 1_000_000).toFixed(decimals)}M`;
  if (absValue < 1_000_000_000_000)
    return `${sign}${(absValue / 1_000_000_000).toFixed(decimals)}B`;
  return `${sign}${(absValue / 1_000_000_000_000).toFixed(decimals)}T`;
}

export const formatDate = (timestamp: string | number) => {
  const date = new Date(Number(timestamp) * 1000);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleString();
};

export function toUiAmount(
  amount: bigint | string | number,
  decimals = 9,
): string {
  const rawAmount = BigInt(amount);

  if (rawAmount < 0n) {
    throw new Error("Invalid amount");
  }

  if (decimals < 0) {
    throw new Error("Invalid decimals");
  }

  if (decimals === 0) {
    return rawAmount.toString();
  }

  const divisor = 10n ** BigInt(decimals);
  const whole = rawAmount / divisor;
  const fraction = rawAmount % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionStr = fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");

  return `${whole}.${fractionStr}`;
}

export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");

  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);

  if (fraction.length > decimals) {
    throw new Error(`Amount ${amount} has more than ${decimals} decimals`);
  }

  return (
    BigInt(whole) * 10n ** BigInt(decimals) + BigInt(paddedFraction || "0")
  );
}

export const toMerkleRootBytes = (merkleRoot: string): ReadonlyUint8Array => {
  const hex = merkleRoot.replace(/^0x/i, "");

  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error("Invalid Merkle root: expected 32 bytes of hexadecimal");
  }

  return Uint8Array.from(
    hex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)),
  ) as ReadonlyUint8Array;
};
