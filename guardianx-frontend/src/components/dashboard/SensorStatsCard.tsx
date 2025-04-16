"use client";

import React from 'react';

interface SensorStatsCardProps {
  activeSensors: number;
  alerts: number;
  rewards: number;
}

const SensorStatsCard: React.FC<SensorStatsCardProps> = ({ 
  activeSensors, 
  alerts, 
  rewards 
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Virtual Sensors</h3>
        <div className="mt-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-gray-900">{activeSensors}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">{alerts}</div>
              <div className="text-sm text-gray-500">Alerts</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">{rewards}</div>
              <div className="text-sm text-gray-500">GUARD Tokens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorStatsCard;