import {
    Box,
    Form,
    Row,
    Selector,
    SelectorOption,
    Card,
    Button,
    Heading,
  } from "@metamask/snaps-sdk/jsx";
  
  export const BridgeScreen = () => (
    <Box>
      <Heading>Bridge settings</Heading>
  
      <Form name="bridgeForm">
        <Row label="Source chain">
          <Selector name="sourceChain" title="Choose source network">
            <SelectorOption value="1">
              <Card title="Ethereum Mainnet" value="1" />
            </SelectorOption>
            <SelectorOption value="2">
              <Card title="Sepolia Testnet" value="2" />
            </SelectorOption>
          </Selector>
        </Row>
  
        <Row label="Destination chain">
          <Selector name="destChain" title="Choose destination network">
            <SelectorOption value="1">
              <Card title="Polygon zkEVM Testnet" value="1" />
            </SelectorOption>
            <SelectorOption value="2">
              <Card title="Silicon Sepolia" value="2" />
            </SelectorOption>
          </Selector>
        </Row>
  
        <Row label="Bridge">
          <Button type="submit" name="bridgeToken">
            Bridge token
          </Button>
        </Row>
      </Form>
  
      <Form name="claimForm">
        <Row label="Claim">
          <Button type="submit" name="claimBtn">
            Claim asset
          </Button>
        </Row>
      </Form>
    </Box>
  );
  