"use client";

import React, { useState, useEffect } from 'react';
import AlertFilters from '@/components/alerts/AlertFilters';
import AlertList, { Alert } from '@/components/alerts/AlertList';

// Sample data
const sampleAlerts: Alert[] = [
  {
    id: '1',
    title: 'Water Pressure Anomaly',
    description: 'Unusual pressure fluctuations detected in the main water supply line.',
    location: 'Downtown Area',
    timestamp: '15 minutes ago',
    severity: 'medium',
    status: 'new',
    type: 'water'
  },
  {
    id: '2',
    title: 'Power Fluctuations',
    description: 'Voltage irregularities detected in the eastern district grid.',
    location: 'Eastern District',
    timestamp: '2 hours ago',
    severity: 'high',
    status: 'acknowledged',
    type: 'power'
  },
  {
    id: '3',
    title: 'Network Latency Issues',
    description: 'Increased latency detected in the fiber optic backbone.',
    location: 'North Sector',
    timestamp: '4 hours ago',
    severity: 'low',
    status: 'acknowledged',
    type: 'telecom'
  },
  {
    id: '4',
    title: 'Critical Water Main Leak Prediction',
    description: 'AI model predicts imminent failure in water main based on pressure patterns.',
    location: 'Western Suburb',
    timestamp: '1 day ago',
    severity: 'critical',
    status: 'resolved',
    type: 'water'
  },
  {
    id: '5',
    title: 'Substation Thermal Anomaly',
    description: 'Thermal sensors indicate abnormal heating patterns in substation equipment.',
    location: 'Industrial Park',
    timestamp: '2 days ago',
    severity: 'high',
    status: 'resolved',
    type: 'power'
  }
];

export default function AlertsPage() {
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(sampleAlerts);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    timeRange: '24h'
  });

  useEffect(() => {
    // Apply filters
    let filtered = [...sampleAlerts];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }
    
    if (filters.type !== 'all') {
      filtered = filtered.filter(alert => alert.type === filters.type);
    }
    
    // For time range, in a real app we would filter based on actual timestamps
    // Here we're just simulating it for demo purposes
    
    setFilteredAlerts(filtered);
  }, [filters]);

  const handleFilterChange = (newFilters: { status: string; type: string; timeRange: string }) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Alerts & Notifications</h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Monitor and respond to detected anomalies and potential infrastructure issues.
        </p>
      </div>
      
      <div className="mt-6">
        <AlertFilters onFilterChange={handleFilterChange} />
        
        {filteredAlerts.length > 0 ? (
          <AlertList alerts={filteredAlerts} />
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
            <p className="text-gray-500">No alerts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}