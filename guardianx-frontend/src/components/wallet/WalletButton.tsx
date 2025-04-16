"use client";

import React, { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const WalletButton = () => {
  const { connected, connecting, disconnect, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = useCallback(() => {
    if (!connected) {
      // Instead of directly calling connect(), we'll show the wallet modal
      setVisible(true);
    }
  }, [connected, setVisible]);

  const handleDisconnect = useCallback(() => {
    if (connected) {
      disconnect().catch((error) => {
        console.error('Disconnect error:', error);
      });
    }
  }, [disconnect, connected]);

  const copyAddress = useCallback(() => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      alert('Address copied to clipboard');
    }
  }, [publicKey]);

  if (connected && publicKey) {
    return (
      <div className="relative group">
        <button 
          className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors flex items-center"
        >
          <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
          <div className="py-1">
            <button 
              onClick={copyAddress}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              Copy address
            </button>
            <button 
              onClick={handleDisconnect}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletButton;