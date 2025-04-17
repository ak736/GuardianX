"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define types for infrastructure and sensor data
interface InfrastructureItem {
  id: string;
  name: string;
  type: 'power' | 'water' | 'telecom';
  status: 'normal' | 'warning' | 'danger';
  description: string;
  lat: number;
  lng: number;
}

interface SensorItem {
  id: string;
  owner: string;
  status: 'active' | 'inactive';
  infrastructure: string;
  range: number;
  rewards: number;
  lat: number;
  lng: number;
}

// Sample data for infrastructure and sensors
const infrastructureData: InfrastructureItem[] = [
  {
    id: 'power1',
    name: 'Main Power Station',
    type: 'power',
    status: 'normal',
    description: 'Primary power distribution station for the downtown area',
    lat: 40.1,
    lng: -74.5
  },
  {
    id: 'water1',
    name: 'Water Treatment Facility',
    type: 'water',
    status: 'warning',
    description: 'Main water processing and treatment plant',
    lat: 40.05,
    lng: -74.45
  },
  {
    id: 'telecom1',
    name: 'Telecommunications Hub',
    type: 'telecom',
    status: 'normal',
    description: 'Central communications relay station',
    lat: 40.07,
    lng: -74.52
  },
  {
    id: 'power2',
    name: 'Substation Alpha',
    type: 'power',
    status: 'normal',
    description: 'Electrical substation serving the eastern district',
    lat: 40.12,
    lng: -74.48
  },
  {
    id: 'water2',
    name: 'Main Reservoir',
    type: 'water',
    status: 'normal',
    description: 'Primary water storage facility',
    lat: 40.03,
    lng: -74.55
  }
];

const sensorData: SensorItem[] = [
  {
    id: 'sensor1',
    owner: 'user1',
    status: 'active',
    infrastructure: 'power1',
    range: 500, // meters
    rewards: 35,
    lat: 40.105,
    lng: -74.505
  },
  {
    id: 'sensor2',
    owner: 'user2',
    status: 'active',
    infrastructure: 'water1',
    range: 500, // meters
    rewards: 42,
    lat: 40.055,
    lng: -74.455
  }
];

// Functions to determine colors
const getStatusColor = (status: 'normal' | 'warning' | 'danger'): string => {
  switch (status) {
    case 'normal': return '#10B981'; // green
    case 'warning': return '#F59E0B'; // yellow 
    case 'danger': return '#EF4444';  // red
    default: return '#CBD5E1'; // gray
  }
};

const MapComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Initialize map only once
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    // Fix icon issues
    const DefaultIcon = L.icon({
      iconUrl: typeof icon === 'string' ? icon : (icon.src || '/marker-icon.png'),
      shadowUrl: typeof iconShadow === 'string' ? iconShadow : (iconShadow.src || '/marker-shadow.png'),
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    
    //Force the icon prototype to use our default icon
    L.Marker.prototype.options.icon = DefaultIcon;

    // Create map
    const map = L.map(mapContainerRef.current).setView([40.08, -74.5], 12);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Update info panel on map move
    const updateInfo = () => {
      const center = map.getCenter();
      if (infoRef.current) {
        infoRef.current.innerHTML = `Longitude: ${center.lng.toFixed(4)} | Latitude: ${center.lat.toFixed(4)} | Zoom: ${map.getZoom().toFixed(2)}`;
      }
    };
    map.on('move', updateInfo);
    updateInfo();

    // Add infrastructure points
    const infrastructureGroup = L.layerGroup().addTo(map);
    infrastructureData.forEach(item => {
      // Create circle marker
      const marker = L.circleMarker([item.lat, item.lng], {
        radius: 10,
        color: '#FFF',
        weight: 2,
        fillColor: getStatusColor(item.status),
        fillOpacity: 1
      }).addTo(infrastructureGroup);
      
      // Add popup
      marker.bindPopup(`
        <div>
          <h3 style="font-weight: bold;">${item.name}</h3>
          <p style="font-size: 0.875rem;">${item.description}</p>
          <p style="font-size: 0.75rem; margin-top: 0.25rem;">Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
          <p style="font-size: 0.75rem;">Status: ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
        </div>
      `);
      
      // Add label
      L.marker([item.lat, item.lng], {
        icon: L.divIcon({
          html: `<div style="background-color: white; padding: 2px 5px; border-radius: 3px; font-size: 12px; white-space: nowrap;">${item.name}</div>`,
          className: '',
          iconAnchor: [15, -15]
        })
      }).addTo(infrastructureGroup);
    });

    // Add sensor points and ranges
    const sensorsGroup = L.layerGroup().addTo(map);
    sensorData.forEach(sensor => {
      // Add range circle
      L.circle([sensor.lat, sensor.lng], {
        radius: sensor.range,
        color: 'rgba(59, 130, 246, 0.5)',
        fillColor: 'rgba(59, 130, 246, 0.1)',
        fillOpacity: 0.5,
        weight: 1
      }).addTo(sensorsGroup);
      
      // Add sensor point
      const marker = L.circleMarker([sensor.lat, sensor.lng], {
        radius: 6,
        color: '#FFF',
        weight: 2,
        fillColor: '#3B82F6', // blue
        fillOpacity: 1
      }).addTo(sensorsGroup);
      
      // Add popup
      marker.bindPopup(`
        <div>
          <h3 style="font-weight: bold;">Sensor ${sensor.id}</h3>
          <p style="font-size: 0.875rem;">Range: ${sensor.range}m</p>
          <p style="font-size: 0.75rem;">Rewards: ${sensor.rewards} tokens</p>
        </div>
      `);
    });

    // Add sensor placement button
    // @ts-expect-error - Leaflet typing issue
    const placementControl = L.control({ position: 'bottomright' });
    placementControl.onAdd = function() {
      const div = L.DomUtil.create('div', 'leaflet-control-layers');
      div.innerHTML = `
        <button class="px-4 py-2 rounded-md shadow text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Place Sensor
        </button>
      `;
      div.style.backgroundColor = 'transparent';
      div.style.border = 'none';
      
      div.onclick = function(e) {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        }
        alert('Please connect your wallet to place sensors.');
      };
      
      return div;
    };
    placementControl.addTo(map);

    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={infoRef}
        className="absolute top-0 left-0 m-2 bg-white p-2 z-10 rounded shadow text-xs"
      >
        Longitude: -74.5000 | Latitude: 40.0800 | Zoom: 12.00
      </div>
      <div 
        ref={mapContainerRef} 
        className="h-[70vh] w-full rounded-lg"
      ></div>
    </div>
  );
};

export default MapComponent;