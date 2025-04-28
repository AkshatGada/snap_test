import { useState } from "react";

export default function App() {
  const [connected, setConnected] = useState(false);

  const connect = async () => {
    // MetaMask Stable & Flask both inject window.ethereum; 
    // Flask also injects into window.ethereum.providers
    const anyEth = (window as any).ethereum;
    const provider = Array.isArray(anyEth.providers)
      ? anyEth.providers.find((p: any) => p.isFlask) || anyEth
      : anyEth;
  
    await provider.request({
      method: "wallet_requestSnaps",
      params: {
        "local:http://localhost:8080": {},
      },
    });
    setConnected(true);
  };

  return (
    <>
      <h1>Bridge Snap demo</h1>
      {!connected && <button onClick={connect}>Connect Snap</button>}
      {connected && <p>Open MetaMask → Snaps →  Bridge Helper.</p>}
    </>
  );
}