"use client";

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import PageLayout from '@/components/ui/PageLayout';
import AlertDetail from '@/components/alerts/AlertDetail';
import { Alert } from '@/components/alerts/AlertList';
import Link from 'next/link';

// Sample data - in a real app, this would come from an API
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

export default function AlertDetailPage() {
  const params = useParams();
  const [alert, setAlert] = useState<Alert | null>(null);
  
  useEffect(() => {
    const alertId = params.id as string;
    const foundAlert = sampleAlerts.find(a => a.id === alertId);
    
    if (foundAlert) {
      setAlert(foundAlert);
    }
  }, [params.id]);
  
  if (!alert) {
    return notFound();
  }

  return (
    <PageLayout>
      <div className="mb-5">
        <Link href="/alerts" className="text-blue-600 hover:text-blue-800">
          ← Back to Alerts
        </Link>
      </div>
      
      <AlertDetail alert={alert} />
    </PageLayout>
  );
}