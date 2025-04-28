import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { Box, Heading, Text } from "@metamask/snaps-sdk/jsx";

export const onTransaction: OnTransactionHandler = async () => {
  const state: any = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });
  const hash: string | undefined = state?.lastBridge;

  if (!hash) {
    return {
      content: (
        <Box>
          <Heading>No cross-chain transfer</Heading>
          <Text>Hit “Bridge assets” to start one.</Text>
        </Box>
      ),
    };
  }

  const res = await fetch(
    `https://bridge-api.agglayer.dev/v1/status/${hash}`,
  ).then((r) => r.json() as { state?: string });

  const status = (res.state ?? "UNKNOWN").toLowerCase();

  return {
    content: (
      <Box>
        <Heading>Cross-chain status</Heading>
        <Text>{status}</Text>
      </Box>
    ),
  };
};