// packages/snap/src/utils/bridgeContracts.ts

import { Contract, JsonRpcProvider, type Provider, type JsonRpcSigner } from "ethers";

/**
 * The on‐chain addresses of PolygonZKEVMBridgeV2 (or equivalent)
 * on each supported testnet.
 */
export const BRIDGE_ADDR: Record<number, string> = {
  0: "0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582", // Sepolia (source)
  1: "0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582", // zkEVM testnet (dest)
  2: "0x528e26b25a34a4A5d0dbDa1d57D318153d2ED582", // Silicon Sepolia (dest)
};

/**
 * Minimal ABI for the two methods and the bridging event.
 */
export const BRIDGE_ABI = [
  "event AssetBridged(bytes32 indexed depositHash,uint32 dstChain)",
  "function bridgeAsset(uint256 amount,uint32 dstChain) payable",
  "function claimAsset(bytes32 depositHash,uint32 srcChain)",
];

/**
 * Returns an ethers Contract instance for the bridge on `chainId`
 * using the provided signer or provider.
 *
 * @param chainId          – numeric chain ID (0, 1, 2)
 * @param signerOrProvider – either a Provider (for read-only) or a Signer (for txs)
 */
export function getBridge(
  chainId: number,
  signerOrProvider: Provider | JsonRpcSigner,
): Contract {
  const address = BRIDGE_ADDR[chainId];
  if (!address) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }
  return new Contract(address, BRIDGE_ABI, signerOrProvider);
}