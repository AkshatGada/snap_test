
import { JsonRpcProvider } from "ethers";

export const RPC = {
  sepolia: "https://rpc2.sepolia.org",
  zkevm:   "https://rpc.public.zkevm-test.net",
  silicon: "https://silicon-sepolia.g.alchemy.com/v2/demo",
};

export function getProvider(chainId: number): JsonRpcProvider {
  switch (chainId) {
    case 0: return new JsonRpcProvider(RPC.sepolia);
    case 1: return new JsonRpcProvider(RPC.zkevm);
    case 2: return new JsonRpcProvider(RPC.silicon);
    default: throw new Error("Unknown chainId");
  }
}