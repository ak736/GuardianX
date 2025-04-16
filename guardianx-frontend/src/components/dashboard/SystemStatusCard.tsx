"use client";

import React from 'react';

type StatusType = 'normal' | 'warning' | 'danger';

interface SystemStatusProps {
  systems: {
    name: string;
    status: StatusType;
    description: string;
    abbr: string;
  }[];
}

const getStatusColor = (status: StatusType) => {
  switch (status) {
    case 'normal':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'danger':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const SystemStatusCard: React.FC<SystemStatusProps> = ({ systems }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">System Status</h3>
        <div className="mt-5 space-y-4">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getStatusColor(system.status)} flex items-center justify-center`}>
                <span className="text-white font-bold">{system.abbr}</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{system.name}</div>
                <div className="text-sm text-gray-500">{system.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatusCard;