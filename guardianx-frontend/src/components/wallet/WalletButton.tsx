"use client";

import React, { useState } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';

const WalletButton = () => {
  const { connected, connecting, walletAddress, connectWallet, disconnectWallet } = useWalletContext();
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      alert('Address copied to clipboard');
    }
    setShowDropdown(false);
  };

  if (connected && walletAddress) {
    return (
      <div className="relative">
        <div 
          className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center"
          onClick={toggleDropdown}
        >
          <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </div>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
            <div 
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              onClick={disconnectWallet}
            >
              Disconnect
            </div>
            <div 
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={copyAddress}
            >
              Copy address
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={connecting}
      className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default WalletButton;