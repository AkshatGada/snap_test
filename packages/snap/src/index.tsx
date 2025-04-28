// packages/snap/src/index.tsx
import type {
  OnHomePageHandler,
  OnUserInputHandler,
} from "@metamask/snaps-sdk";
import {
  DialogType,
  UserInputEventType,
} from "@metamask/snaps-sdk";
import { Box, Heading, Text } from "@metamask/snaps-sdk/jsx";
import { Home } from "./ui/Home";
import { doBridge, doClaim } from "./handlers/Bridge";
import { onTransaction } from "./handlers/insights";

export const onHomePage: OnHomePageHandler = async () => ({
  content: <Home />,
});

export const onUserInput: OnUserInputHandler = async ({ event }) => {
  if (event.type !== UserInputEventType.ButtonClickEvent) {
    return;
  }

  if (event.name === "bridgeBtn") {
    const toZkEvm = (await snap.request({
      method: "snap_dialog",
      params: {
        type: "confirmation",
        content: (
          <Box>
            <Heading>Select destination</Heading>
            <Text>
              Click "Yes" for Polygon zkEVM Testnet, or "No" for Silicon Sepolia.
            </Text>
          </Box>
        ),
      },
    })) as boolean;

    const destChain = toZkEvm ? 1 : 2;

    const ok = (await snap.request({
      method: "snap_dialog",
  params: {
    type: "confirmation",
    content: (
      <Box>
        <Text>Bridge 0.01 ETH to {toZkEvm ? "zkEVM" : "Silicon"}?</Text>
      </Box>
    ),
  },
})) as boolean;
    if (!ok) {
      await snap.request({
        method: "snap_notify",
        params: { type: "inApp", message: "Bridge cancelled." },
      });
      return;
    }

    const depositHash = await doBridge("10000000000000000", destChain);
    await snap.request({
      method: "snap_manageState",
      params: {
        operation: "update",
        newState: { lastBridge: depositHash, destChain },
      },
    });
    await snap.request({
      method: "snap_notify",
      params: {
        type: "inApp",
        message: `Bridged! Hash:\n${depositHash}`,
      },
    });
    return;
  }

  if (event.name === "claimBtn") {
    const state: any = await snap.request({
      method: "snap_manageState",
      params: { operation: "get" },
    });
    const { lastBridge: depositHash, destChain } = state || {};

    if (!depositHash || !destChain) {
      await snap.request({
        method: "snap_notify",
        params: { type: "inApp", message: "Nothing to claim yet." },
      });
      return;
    }

    const confirmClaim = (await snap.request({
      method: "snap_dialog",
      params: {
        type: "confirmation",
        content: (
          <Box>
            <Text>Claim your bridged funds on chain {destChain}?</Text>
          </Box>
        ),
      },
    })) as boolean;

    if (!confirmClaim) {
      await snap.request({
        method: "snap_notify",
        params: { type: "inApp", message: "Claim cancelled." },
      });
      return;
    }

    const txHash = await doClaim(depositHash, 0, destChain);
    await snap.request({
      method: "snap_notify",
      params: {
        type: "inApp",
        message: ` Claimed! Tx Hash:\n${txHash}`,
      },
    });
    return;
  }
};

export { onTransaction };