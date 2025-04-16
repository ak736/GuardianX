"use client";

import React from 'react';
import Link from 'next/link';

export interface Alert {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved';
  type: 'power' | 'water' | 'telecom';
}

interface AlertListProps {
  alerts: Alert[];
}

const getSeverityColor = (severity: Alert['severity']) => {
  switch (severity) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: Alert['status']) => {
  switch (status) {
    case 'new':
      return 'bg-red-100 text-red-800';
    case 'acknowledged':
      return 'bg-yellow-100 text-yellow-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: Alert['type']) => {
  switch (type) {
    case 'power':
      return '⚡';
    case 'water':
      return '💧';
    case 'telecom':
      return '📡';
    default:
      return '❓';
  }
};

const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <li key={alert.id}>
            <Link 
              href={`/alerts/${alert.id}`}
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-2xl mr-3">
                      {getTypeIcon(alert.type)}
                    </div>
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {alert.title}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </p>
                    <p className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {alert.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {alert.location} - {alert.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertList;