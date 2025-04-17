"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { WalletContextProvider } from '@/contexts/WalletContext';

// Dynamic imports for navbar only
const Navbar = dynamic(() => import('@/components/ui/Navbar'), {
  ssr: false
});

export function ClientComponentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WalletContextProvider>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16 pb-16">
        {children}
      </main>
      <footer className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; 2025 GuardianX. All rights reserved.
          </p>
        </div>
      </footer>
    </WalletContextProvider>
  );
}