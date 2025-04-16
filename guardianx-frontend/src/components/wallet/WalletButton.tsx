"use client";

import React, { useEffect, useState } from 'react';

const WalletButton = () => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
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

  // Check if wallet is connected on load
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if Phantom exists
        if (window.phantom?.solana) {
          try {
            // Try to connect to an already trusted connection
            const resp = await window.phantom.solana.connect({ onlyIfTrusted: true });
            setWalletAddress(resp.publicKey.toString());
            setConnected(true);
          } catch (_) {
            // Not already connected, that's ok
            console.log("Not auto-connected");
          }
        }
      } catch (err) {
        console.error("Wallet check error:", err);
      }
    };

    checkWalletConnection();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.phantom?.solana) {
        alert("Please install Phantom wallet");
        return;
      }
      
      const resp = await window.phantom.solana.connect();
      setWalletAddress(resp.publicKey.toString());
      setConnected(true);
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = async () => {
    try {
      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect();
        setWalletAddress("");
        setConnected(false);
        setShowDropdown(false);
      }
    } catch (err) {
      console.error("Disconnection error:", err);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the document click from immediately closing it
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
      className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;