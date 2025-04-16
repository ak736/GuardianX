"use client";

import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useWallet } from '@solana/wallet-adapter-react';

interface SensorPlacementProps {
  map: mapboxgl.Map | null;
}

// Sample sensors data - In a real app, this would come from an API/blockchain
const sensorsData: any = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'sensor1',
        owner: 'user1',
        status: 'active',
        infrastructure: 'power1',
        range: 500, // meters
        rewards: 35
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.505, 40.105]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'sensor2',
        owner: 'user2',
        status: 'active',
        infrastructure: 'water1',
        range: 500, // meters
        rewards: 42
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.455, 40.055]
      }
    }
  ]
};

const SensorPlacement = ({ map }: SensorPlacementProps) => {
  const { connected, publicKey } = useWallet();
  const [placementMode, setPlacementMode] = useState(false);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  // Add existing sensors to the map
  useEffect(() => {
    if (!map) return;

    // Add sensors data
    if (!map.getSource('sensors')) {
      map.addSource('sensors', {
        type: 'geojson',
        data: sensorsData
      });
    }

    // Add sensor points
    if (!map.getLayer('sensors-points')) {
      map.addLayer({
        id: 'sensors-points',
        type: 'circle',
        source: 'sensors',
        paint: {
          'circle-radius': 6,
          'circle-color': '#3B82F6', // blue
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFF'
        }
      });
    }

    // Add sensor range circles
    if (!map.getLayer('sensors-range')) {
      map.addLayer({
        id: 'sensors-range',
        type: 'circle',
        source: 'sensors',
        paint: {
          'circle-radius': ['/', ['get', 'range'], 5], // scale down for display
          'circle-color': 'rgba(59, 130, 246, 0.1)', // faint blue
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(59, 130, 246, 0.5)'
        }
      });
    }

    return () => {
      // Clean up on unmount
      if (map.getLayer('sensors-points')) map.removeLayer('sensors-points');
      if (map.getLayer('sensors-range')) map.removeLayer('sensors-range');
      if (map.getSource('sensors')) map.removeSource('sensors');
    };
  }, [map]);

  // Handle placement mode
  useEffect(() => {
    if (!map) return;

    const onMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (!placementMode || !connected || !publicKey) return;

      // Create a new marker
      const marker = new mapboxgl.Marker({ color: '#3B82F6' })
        .setLngLat(e.lngLat)
        .addTo(map);
      
      // Add to marker list
      setMarkers(prev => [...prev, marker]);

      // Create a popup for confirmation
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div>
            <h3 class="font-bold">New Virtual Sensor</h3>
            <p class="text-sm">Place sensor at this location?</p>
            <div class="flex justify-between mt-2">
              <button id="confirm-sensor" class="px-3 py-1 bg-green-600 text-white text-xs rounded">Confirm</button>
              <button id="cancel-sensor" class="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded">Cancel</button>
            </div>
          </div>
        `)
        .addTo(map);

      // Handle popup button clicks
      const confirmButton = document.getElementById('confirm-sensor');
      const cancelButton = document.getElementById('cancel-sensor');

      if (confirmButton) {
        confirmButton.addEventListener('click', () => {
          // Here you would call an API to store the sensor in the database/blockchain
          alert('Sensor placement confirmed! This would be stored on the blockchain in a real implementation.');
          popup.remove();
          setPlacementMode(false);
        });
      }

      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          marker.remove();
          popup.remove();
          setMarkers(prev => prev.filter(m => m !== marker));
        });
      }
    };

    if (placementMode) {
      map.getCanvas().style.cursor = 'crosshair';
      map.on('click', onMapClick);
    } else {
      map.getCanvas().style.cursor = '';
      map.off('click', onMapClick);
    }

    return () => {
      map.getCanvas().style.cursor = '';
      map.off('click', onMapClick);
    };
  }, [map, placementMode, connected, publicKey]);

  // Clear all temporary markers when exiting placement mode
  useEffect(() => {
    if (!placementMode) {
      markers.forEach(marker => marker.remove());
      setMarkers([]);
    }
  }, [placementMode, markers]);

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <button
        onClick={() => {
          if (!connected) {
            alert('Please connect your wallet to place sensors.');
            return;
          }
          setPlacementMode(!placementMode);
        }}
        className={`px-4 py-2 rounded-md shadow font-medium text-sm ${
          placementMode
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {placementMode ? 'Cancel Placement' : 'Place Sensor'}
      </button>
      {placementMode && (
        <div className="mt-2 p-2 bg-white rounded shadow text-xs">
          Click on the map to place a virtual sensor
        </div>
      )}
    </div>
  );
};

export default SensorPlacement;