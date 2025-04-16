"use client";

import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import '../../styles/wallet-adapter.css';

// Dynamic imports for wallet and navbar
const WalletProvider = dynamic(() => import('@/components/wallet/WalletProvider'), {
  ssr: false
});

const Navbar = dynamic(() => import('@/components/ui/Navbar'), {
  ssr: false
});

export function ClientComponentWrapper({ children }: { children: React.ReactNode }) {
  // Force load styles on client-side
  useEffect(() => {
    // This ensures any styles are properly applied
    document.body.className += ' wallet-adapter-loaded';
  }, []);

  return (
    <WalletProvider>
      <Navbar />
      <main>{children}</main>
      <footer className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; 2025 GuardianX. All rights reserved.
          </p>
        </div>
      </footer>
    </WalletProvider>
  );
}