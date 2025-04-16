"use client";

import React, { FC, ReactNode, useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';

// Add TypeScript declaration for Phantom
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect?: () => Promise<{ publicKey: any }>;
      };
    };
  }
}

interface WalletProviderProps {
  children: ReactNode;
}

const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

  // Initialize wallet adapters with options
  const wallets = useMemo(() => {
    if (typeof window !== 'undefined') {
      // Force refresh when wallets are detected
      return [new PhantomWalletAdapter()];
    }
    return [];
  }, []);

  // Log when component mounts
  useEffect(() => {
    console.log('WalletProvider mounted, wallets:', wallets.length);
    if (typeof window !== 'undefined') {
      const isPhantomInstalled = window.phantom?.solana?.isPhantom;
      console.log('Phantom installed:', isPhantomInstalled ? 'Yes' : 'No');
      
      // Try to manually test connecting to Phantom
      if (isPhantomInstalled) {
        console.log('Testing direct Phantom connection...');
        // This is just a test to see if we can interact with Phantom
        window.phantom?.solana?.connect?.().catch(e => {
          console.log('Direct connection test (expected to fail):', e);
        });
      }
    }
  }, [wallets]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;