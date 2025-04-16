"use client";

import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection, Point, Feature, GeoJsonProperties } from 'geojson';

interface InfrastructureLayerProps {
  map: mapboxgl.Map | null;
}

interface InfrastructureProperties {
  id: string;
  name: string;
  type: 'power' | 'water' | 'telecom';
  status: 'normal' | 'warning' | 'danger';
  description: string;
}

// Sample infrastructure data - In a real app, this would come from an API
const infrastructureData: FeatureCollection<Point, InfrastructureProperties> = {
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

const InfrastructureLayer: React.FC<InfrastructureLayerProps> = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    // Add the infrastructure data as a source
    if (!map.getSource('infrastructure')) {
      map.addSource('infrastructure', {
        type: 'geojson',
        data: infrastructureData as any
      });
    }

    // Rest of the code remains the same...
    // ...

    return () => {
      if (map.getLayer('infrastructure-power')) map.removeLayer('infrastructure-power');
      if (map.getLayer('infrastructure-water')) map.removeLayer('infrastructure-water');
      if (map.getLayer('infrastructure-telecom')) map.removeLayer('infrastructure-telecom');
      if (map.getLayer('infrastructure-labels')) map.removeLayer('infrastructure-labels');
      if (map.getSource('infrastructure')) map.removeSource('infrastructure');
    };
  }, [map]);

  return null;
};

export default InfrastructureLayer;