// Test script for anomaly detection
const fetch = require('node-fetch');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API URL
const API_URL = 'http://localhost:5001/api';

// Get all sensors for a specific type
async function getSensors(type) {
  try {
    const response = await fetch(`${API_URL}/sensors?type=${type}`);
    return await response.json();
  } catch (err) {
    console.error('Error fetching sensors:', err);
    return null;
  }
}

// Send a reading to a sensor
async function sendReading(sensorId, value, unit) {
  try {
    const response = await fetch(`${API_URL}/sensors/${sensorId}/readings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value,
        unit
      })
    });
    
    return await response.json();
  } catch (err) {
    console.error(`Error sending reading to sensor ${sensorId}:`, err);
    return null;
  }
}

// Test normal and anomalous readings
async function testReadings() {
  // Get water sensors
  console.log('Fetching water sensors...');
  const waterSensorsGeoJson = await getSensors('water');
  
  if (!waterSensorsGeoJson || !waterSensorsGeoJson.features || waterSensorsGeoJson.features.length === 0) {
    console.error('No water sensors found');
    process.exit(1);
  }
  
  // Get first water sensor
  const waterSensor = waterSensorsGeoJson.features[0].properties;
  console.log(`Using water sensor: ${waterSensor.name} (${waterSensor.id})`);
  
  // Send normal readings
  console.log('\nSending normal water pressure readings...');
  for (let i = 0; i < 5; i++) {
    // Normal pressure between 45-55 PSI
    const normalValue = 50 + (Math.random() * 10 - 5);
    const result = await sendReading(waterSensor.id, normalValue, 'psi');
    console.log(`Reading ${i+1}: ${normalValue.toFixed(2)} psi - Anomaly: ${result.anomaly.anomaly}`);
    
    // Wait a bit between readings
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Send anomalous reading (low pressure)
  console.log('\nSending anomalous water pressure reading (low)...');
  const lowPressure = 25 + (Math.random() * 5);
  const lowResult = await sendReading(waterSensor.id, lowPressure, 'psi');
  console.log(`Low pressure reading: ${lowPressure.toFixed(2)} psi`);
  console.log('Detection result:', JSON.stringify(lowResult.anomaly, null, 2));
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Send anomalous reading (high pressure)
  console.log('\nSending anomalous water pressure reading (high)...');
  const highPressure = 70 + (Math.random() * 10);
  const highResult = await sendReading(waterSensor.id, highPressure, 'psi');
  console.log(`High pressure reading: ${highPressure.toFixed(2)} psi`);
  console.log('Detection result:', JSON.stringify(highResult.anomaly, null, 2));
  
  console.log('\nTest completed!');
  process.exit(0);
}

// Run the test
testReadings();