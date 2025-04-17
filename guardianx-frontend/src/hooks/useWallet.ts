// src/hooks/useWallet.ts
import { useState } from 'react';

export function useWallet() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.phantom?.solana) {
        alert("Please install Phantom wallet");
        return;
      }
      
      setConnecting(true);
      // Always show the popup
      const resp = await window.phantom.solana.connect();
      setWalletAddress(resp.publicKey.toString());
      setConnected(true);
      
      // After connection, call backend API (uncomment when backend is ready)
      // await fetch('/api/users/connect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ walletAddress: resp.publicKey.toString() })
      // });

      return resp.publicKey.toString();
    } catch (err) {
      console.error("Connection error:", err);
      return null;
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect();
        setWalletAddress("");
        setConnected(false);
      }
    } catch (err) {
      console.error("Disconnection error:", err);
    }
  };

  return {
    connected,
    connecting,
    walletAddress,
    connectWallet,
    disconnectWallet
  };
}