"use client";

import React from 'react';
import { useWalletContext } from '@/contexts/WalletContext';

const UserProfile = () => {
  const { connected, connecting, walletAddress, connectWallet } = useWalletContext();

  // Sample data
  const userData = {
    activeSensors: 12,
    totalRewards: 305,
    contributionRank: 42,
    joinedDate: 'March 15, 2025',
  };

  if (!connected) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <p className="text-gray-500 mb-4">Please connect your wallet to view your profile.</p>
        <button
          onClick={connectWallet}
          disabled={connecting}
          className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Wallet and account information.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Wallet Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {walletAddress}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Active Sensors</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData.activeSensors}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Rewards</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData.totalRewards} GUARD tokens
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Contribution Rank</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                #{userData.contributionRank} in the community
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Joined</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData.joinedDate}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Virtual Sensors</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Sensors you&apos;ve deployed to protect infrastructure.</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Sensor cards here */}
              {[1, 2, 3, 4].map((sensorId) => (
                <div key={sensorId} className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium">Sensor #{sensorId}</div>
                  <div className="text-sm text-gray-500">Downtown Area</div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                    <span className="text-xs">25 tokens earned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;