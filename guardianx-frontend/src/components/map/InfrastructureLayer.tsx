"use client";

import React, { useEffect } from 'react';
import L from 'leaflet';

interface InfrastructureLayerProps {
  map: L.Map | null;
}

// Sample infrastructure data
const infrastructureData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'power1',
        name: 'Main Power Station',
        type: 'power',
        status: 'normal',
        description: 'Primary power distribution station for the downtown area',
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.5, 40.1]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'water1',
        name: 'Water Treatment Facility',
        type: 'water',
        status: 'warning',
        description: 'Main water processing and treatment plant',
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.45, 40.05]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'telecom1',
        name: 'Telecommunications Hub',
        type: 'telecom',
        status: 'normal',
        description: 'Central communications relay station',
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.52, 40.07]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'power2',
        name: 'Substation Alpha',
        type: 'power',
        status: 'normal',
        description: 'Electrical substation serving the eastern district',
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.48, 40.12]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'water2',
        name: 'Main Reservoir',
        type: 'water',
        status: 'normal',
        description: 'Primary water storage facility',
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.55, 40.03]
      }
    }
  ]
};

// Function to get color based on infrastructure status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return '#10B981'; // green
    case 'warning': return '#F59E0B'; // yellow 
    case 'danger': return '#EF4444';  // red
    default: return '#CBD5E1'; // gray
  }
};

const InfrastructureLayer: React.FC<InfrastructureLayerProps> = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    // Create a group to hold all infrastructure layers
    const infrastructureGroup = L.layerGroup().addTo(map);
    
    // Add each infrastructure point
    infrastructureData.features.forEach(feature => {
      const properties = feature.properties;
      const geometry = feature.geometry;
      if (!properties || !geometry) return;
      
      const { name, type, status, description } = properties;
      const coordinates = geometry.coordinates;
      const [lng, lat] = coordinates;
      
      // Create a circle marker with appropriate styling
      const marker = L.circleMarker([lat, lng], {
        radius: 10,
        color: '#FFF',
        weight: 2,
        fillColor: getStatusColor(status),
        fillOpacity: 1
      }).addTo(infrastructureGroup);
      
      // Add a popup
      marker.bindPopup(`
        <div>
          <h3 class="font-bold">${name}</h3>
          <p class="text-sm">${description}</p>
          <p class="text-xs mt-1">Type: ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
          <p class="text-xs">Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        </div>
      `);
      
      // Add interaction
      marker.on('mouseover', function() {
        marker.openPopup();
      });
      
      // Add a text label
      L.marker([lat, lng], {
        icon: L.divIcon({
          html: `<div style="background-color: white; padding: 2px 5px; border-radius: 3px; font-size: 12px; white-space: nowrap;">${name}</div>`,
          className: 'infrastructure-label',
          iconAnchor: [15, -15]
        })
      }).addTo(infrastructureGroup);
    });
    
    // Cleanup function
    return () => {
      map.removeLayer(infrastructureGroup);
    };
  }, [map]);

  return null;
};

export default InfrastructureLayer;