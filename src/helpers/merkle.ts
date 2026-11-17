import { MerkleTree } from "merkletreejs";
import { createHash } from "crypto";

function hashLeaf(index: number, address: string, amount: number): Buffer {
  const data = `${index}:${address}:${amount.toString()}`;
  return createHash("sha256").update(data).digest();
}
export const createMerkleTree = (
  claimList: { index: number; address: string; amount: number }[],
) => {
  const leaves = claimList.map(({ index, address, amount }) =>
    hashLeaf(index, address, amount),
  );

  const merkleTree = new MerkleTree(
    leaves,
    (data: any) => createHash("sha256").update(data).digest(),
    { sortPairs: true },
  );

  return merkleTree;
};
export const getMerkleRootArray = (merkleTree: MerkleTree): number[] => {
  const root = merkleTree.getRoot().toString("hex");
  const merkleRootBuffer = Buffer.from(root, "hex");
  if (merkleRootBuffer.length !== 32) {
    throw new Error("Merkle root must be 32 bytes");
  }
  const merkleRootArray = Array.from(merkleRootBuffer);
  return merkleRootArray;
};
