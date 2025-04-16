"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import InfrastructureLayer from './InfrastructureLayer';
import SensorPlacement from './SensorPlacement';

// This would normally come from environment variables
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN_HERE'; 
mapboxgl.accessToken = MAPBOX_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-74.5);
  const [lat, setLat] = useState(40);
  const [zoom, setZoom] = useState(12);
  
  // Use refs to store the initial values
  const initialLng = useRef(-74.5);
  const initialLat = useRef(40);
  const initialZoom = useRef(12);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [initialLng.current, initialLat.current],
        zoom: initialZoom.current
      });

      // Add navigation control (zoom buttons)
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      
      map.current.on('move', () => {
        if (map.current) {
          setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
          setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
          setZoom(parseFloat(map.current.getZoom().toFixed(2)));
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Empty dependency array

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 m-2 bg-white p-2 z-10 rounded shadow text-xs">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="h-[70vh] w-full rounded-lg" />
      <InfrastructureLayer map={map.current} />
      <SensorPlacement map={map.current} />
    </div>
  );
};

export default MapComponent;