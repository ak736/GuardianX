'use client'

import React, { useState, useEffect } from 'react'
import L from 'leaflet'
import { useWallet } from '@solana/wallet-adapter-react'

interface SensorPlacementProps {
  map: L.Map | null
}

// Sample sensors data
const sensorsData = {
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
        rewards: 35,
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.505, 40.105],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'sensor2',
        owner: 'user2',
        status: 'active',
        infrastructure: 'water1',
        range: 500, // meters
        rewards: 42,
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.455, 40.055],
      },
    },
  ],
}

const SensorPlacement: React.FC<SensorPlacementProps> = ({ map }) => {
  const { connected, publicKey } = useWallet()
  const [placementMode, setPlacementMode] = useState(false)
  const [markers, setMarkers] = useState<L.Marker[]>([])

  useEffect(() => {
    if (!map) return

    // Create a group to hold all sensor layers
    const sensorsGroup = L.layerGroup().addTo(map)
    const sensorsRangeGroup = L.layerGroup().addTo(map)

    // Add each sensor point and range circle
    sensorsData.features.forEach((feature) => {
      const properties = feature.properties
      const geometry = feature.geometry
      if (!properties || !geometry) return

      const { id, range } = properties
      const coordinates = geometry.coordinates
      const [lng, lat] = coordinates

      // Add range circle
      L.circle([lat, lng], {
        radius: range,
        color: 'rgba(59, 130, 246, 0.5)',
        fillColor: 'rgba(59, 130, 246, 0.1)',
        fillOpacity: 0.5,
        weight: 1,
      }).addTo(sensorsRangeGroup)

      // Add sensor point
      const marker = L.circleMarker([lat, lng], {
        radius: 6,
        color: '#FFF',
        weight: 2,
        fillColor: '#3B82F6', // blue
        fillOpacity: 1,
      }).addTo(sensorsGroup)

      // Add popup
      marker.bindPopup(`
        <div>
          <h3 class="font-bold">Sensor ${id}</h3>
          <p class="text-sm">Range: ${range}m</p>
        </div>
      `)
    })

    // Handle map click events for sensor placement
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!placementMode || !connected || !publicKey) return

      const { lat, lng } = e.latlng

      // Create a marker for the new sensor
      const marker = L.marker([lat, lng], {
        draggable: true,
      }).addTo(map)

      // Add to marker list
      setMarkers((prev) => [...prev, marker])

      // Create popup for confirmation
      const popupContent = document.createElement('div')
      popupContent.innerHTML = `
        <div>
          <h3 class="font-bold">New Virtual Sensor</h3>
          <p class="text-sm">Place sensor at this location?</p>
          <div class="flex justify-between mt-2">
            <button id="confirm-sensor" class="px-3 py-1 bg-green-600 text-white text-xs rounded">Confirm</button>
            <button id="cancel-sensor" class="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded">Cancel</button>
          </div>
        </div>
      `

      marker.bindPopup(popupContent).openPopup()

      // Handle button clicks
      setTimeout(() => {
        const confirmButton = document.getElementById('confirm-sensor')
        const cancelButton = document.getElementById('cancel-sensor')

        if (confirmButton) {
          confirmButton.addEventListener('click', () => {
            // Here you would call an API to store the sensor in the database/blockchain
            alert(
              'Sensor placement confirmed! This would be stored on the blockchain in a real implementation.'
            )
            marker.closePopup()
            setPlacementMode(false)
          })
        }

        if (cancelButton) {
          cancelButton.addEventListener('click', () => {
            map.removeLayer(marker)
            setMarkers((prev) => prev.filter((m) => m !== marker))
          })
        }
      }, 0)
    }

    if (placementMode) {
      map.getContainer().style.cursor = 'crosshair'
      map.on('click', handleMapClick)
    } else {
      map.getContainer().style.cursor = ''
      map.off('click', handleMapClick)
    }

    return () => {
      map.removeLayer(sensorsGroup)
      map.removeLayer(sensorsRangeGroup)
      map.off('click', handleMapClick)
      map.getContainer().style.cursor = ''
    }
  }, [map, placementMode, connected, publicKey])

  // Clear all temporary markers when exiting placement mode
  useEffect(() => {
    if (!placementMode && map) {
      markers.forEach((marker) => map.removeLayer(marker))
      setMarkers([])
    }
  }, [placementMode, markers, map])

  return (
    <div className='absolute bottom-4 right-4 z-10'>
      <button
        onClick={() => {
          if (!connected) {
            // Don't automatically try to connect - just alert the user
            alert('Please connect your wallet to place sensors.')
            return
          }
          setPlacementMode(!placementMode)
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
        <div className='mt-2 p-2 bg-white rounded shadow text-xs'>
          Click on the map to place a virtual sensor
        </div>
      )}
    </div>
  )
}

export default SensorPlacement
