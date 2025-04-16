"use client";

import React from 'react';
import PageLayout from '@/components/ui/PageLayout';
import SystemStatusCard from '@/components/dashboard/SystemStatusCard';
import SensorStatsCard from '@/components/dashboard/SensorStatsCard';
import InfrastructureChart from '@/components/dashboard/InfrastructureChart';

// Sample data
const systemsData = [
  {
    name: 'Power Grid',
    status: 'normal' as const,
    description: 'Normal operation',
    abbr: 'P',
  },
  {
    name: 'Water Infrastructure',
    status: 'warning' as const,
    description: 'Minor anomalies detected',
    abbr: 'W',
  },
  {
    name: 'Telecommunications',
    status: 'normal' as const,
    description: 'Normal operation',
    abbr: 'T',
  },
];

const chartData = [
  { name: 'Jan', power: 4000, water: 2400, telecom: 2400 },
  { name: 'Feb', power: 3000, water: 1398, telecom: 2210 },
  { name: 'Mar', power: 2000, water: 9800, telecom: 2290 },
  { name: 'Apr', power: 2780, water: 3908, telecom: 2000 },
  { name: 'May', power: 1890, water: 4800, telecom: 2181 },
  { name: 'Jun', power: 2390, water: 3800, telecom: 2500 },
  { name: 'Jul', power: 3490, water: 4300, telecom: 2100 },
];

export default function DashboardPage() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SystemStatusCard systems={systemsData} />
          <SensorStatsCard activeSensors={32} alerts={12} rewards={305} />
        </div>
        
        <InfrastructureChart data={chartData} />
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Alerts</h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <span className="text-yellow-800">!</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Water Pressure Anomaly
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Downtown Area - 15 minutes ago
                        </p>
                      </div>
                      <div>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          View
                        </button>
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-800">!</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Power Fluctuations
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Eastern District - 2 hours ago
                        </p>
                      </div>
                      <div>
                        <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          View
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <a href="/alerts" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  View all alerts
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}