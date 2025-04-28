import { getProvider } from "../utils/providers";
import { getBridge } from "../utils/bridgeContracts";
import { Contract, JsonRpcSigner } from "ethers";

const eth = (globalThis as any).ethereum as {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

async function getAccount(): Promise<string> {
  const accounts = (await eth.request({
    method: "eth_requestAccounts",
    params: [],
  })) as string[];
  const [addr] = accounts;
  if (!addr) {
    throw new Error("No account available");
  }
  return addr;
}

export async function doBridge(
  amountWei: string,
  dstChain: number,
): Promise<string> {
  const from = await getAccount();

  const provider = getProvider(0);
  const signer = await provider.getSigner(from) as JsonRpcSigner; // Type assertion to fix Promise<JsonRpcSigner> error

  const bridge = getBridge(0, signer) as Contract & {
    bridgeAsset: (amount: string, dstChain: number, options: any) => Promise<any>;
  };

  if (!bridge.bridgeAsset) {
    throw new Error("Bridge contract is missing bridgeAsset method");
  }

  const tx = await bridge.bridgeAsset(amountWei, dstChain, {
    value: amountWei,
  });
  const receipt = await tx.wait();

  const parsedLog = receipt.logs
    .map((l: any) => bridge.interface.parseLog(l))
    .find((evt: any) => evt.name === "AssetBridged");

  const depositHash = parsedLog?.args.depositHash as string | undefined;
  if (!depositHash) {
    throw new Error("AssetBridged event missing depositHash");
  }

  return depositHash;
}

export async function doClaim(
  depositHash: string,
  srcChain: number,
  dstChain: number,
): Promise<string> {
  const from = await getAccount();

  const providerDst = getProvider(dstChain);
  const signerDst = await providerDst.getSigner(from) as JsonRpcSigner; // Type assertion

  const bridgeDst = getBridge(dstChain, signerDst) as Contract & {
    claimAsset: (depositHash: string, srcChain: number) => Promise<any>;
  };

  if (!bridgeDst.claimAsset) {
    throw new Error("Bridge contract is missing claimAsset method");
  }

  const tx = await bridgeDst.claimAsset(depositHash, srcChain);
  await tx.wait();

  return tx.hash;
}
