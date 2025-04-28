// packages/snap/src/utils/lxlyHelper.ts
import { LxLyClient } from "@maticnetwork/lxlyjs";
import { JsonRpcProvider } from "@ethersproject/providers";

export async function getLxLyClient() {
  const client = new LxLyClient();
  return client.init({
    log: true,
    network: "testnet",
    providers: {
      // Sepolia (network ID 0)
      0: {
        provider: new JsonRpcProvider("https://rpc2.sepolia.org"),
      },
      // zkEVM testnet (network ID 1)
      1: {
        provider: new JsonRpcProvider("https://rpc.public.zkevm-test.net"),
      },
      // Silicon Sepolia (network ID 2)
      2: {
        provider: new JsonRpcProvider("https://silicon-sepolia.g.alchemy.com/v2/demo"),
      },
    },
  });
}