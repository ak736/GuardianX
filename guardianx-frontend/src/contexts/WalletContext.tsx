"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  connected: boolean;
  connecting: boolean; 
  walletAddress: string;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  walletAddress: '',
  connectWallet: async () => null,
  disconnectWallet: async () => {},
});

export const useWalletContext = () => useContext(WalletContext);

export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Force disconnect on page load
  useEffect(() => {
    const forceDisconnect = async () => {
      if (window.phantom?.solana) {
        try {
          await window.phantom.solana.disconnect();
          console.log("Forced disconnect on page load");
          setConnected(false);
          setWalletAddress('');
        } catch (err) {
          console.error("Error during forced disconnect:", err);
        }
      }
    };

    forceDisconnect();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.phantom?.solana) {
        alert("Please install Phantom wallet");
        return null;
      }
      
      setConnecting(true);
      const resp = await window.phantom.solana.connect();
      const address = resp.publicKey.toString();
      
      setWalletAddress(address);
      setConnected(true);
      
      // For future backend integration
      // await fetch('/api/users/connect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ walletAddress: address })
      // });
      
      return address;
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
        setWalletAddress('');
        setConnected(false);
      }
    } catch (err) {
      console.error("Disconnection error:", err);
    }
  };

  return (
    <WalletContext.Provider value={{
      connected,
      connecting,
      walletAddress,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};