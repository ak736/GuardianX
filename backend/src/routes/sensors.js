const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');
const Infrastructure = require('../models/Infrastructure');
const { check, validationResult } = require('express-validator');
const anomalyDetectionService = require('../services/anomalyDetection');

// GET /api/sensors
// Get all sensors with optional filtering
router.get('/', async (req, res) => {
  try {
    const { type, status, owner, infrastructureId } = req.query;
    const filter = {};
    
    // Add filters if provided
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (owner) filter.owner = owner;
    if (infrastructureId) filter.infrastructureId = infrastructureId;
    
    const sensors = await Sensor.find(filter);
    
    // Format as GeoJSON for map rendering
    const geoJson = {
      type: 'FeatureCollection',
      features: sensors.map(sensor => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: sensor.location.coordinates
        },
        properties: {
          id: sensor._id,
          name: sensor.name,
          type: sensor.type,
          status: sensor.status,
          owner: sensor.owner,
          infrastructureId: sensor.infrastructureId,
          tokensEarned: sensor.tokensEarned,
          lastActive: sensor.lastActive
        }
      }))
    };
    
    res.json(geoJson);
  } catch (err) {
    console.error('Error fetching sensors:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// GET /api/sensors/:id
// Get sensor by ID
router.get('/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id);
    
    if (!sensor) {
      return res.status(404).json({ error: true, message: 'Sensor not found' });
    }
    
    res.json(sensor);
  } catch (err) {
    console.error('Error fetching sensor by ID:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// GET /api/sensors/owner/:address
// Get sensors by owner wallet address
router.get('/owner/:address', async (req, res) => {
  try {
    const sensors = await Sensor.find({ owner: req.params.address });
    res.json(sensors);
  } catch (err) {
    console.error('Error fetching sensors by owner:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// POST /api/sensors
// Create new virtual sensor
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('type', 'Type must be water, power, or telecom').isIn(['water', 'power', 'telecom']),
  check('location.coordinates', 'Valid coordinates are required').isArray({ min: 2, max: 2 }),
  check('owner', 'Owner wallet address is required').not().isEmpty(),
  check('infrastructureId', 'Infrastructure ID is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { name, type, location, owner, infrastructureId } = req.body;
    
    // Verify infrastructure exists
    const infrastructure = await Infrastructure.findById(infrastructureId);
    if (!infrastructure) {
      return res.status(404).json({ error: true, message: 'Infrastructure not found' });
    }
    
    // Create new sensor
    const newSensor = new Sensor({
      name,
      type,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      owner,
      infrastructureId,
      readings: [] // Start with empty readings
    });
    
    await newSensor.save();
    
    res.status(201).json(newSensor);
  } catch (err) {
    console.error('Error creating sensor:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// PATCH /api/sensors/:id/status
// Update sensor status
router.patch('/:id/status', [
  check('status', 'Status must be active, inactive, or maintenance').isIn(['active', 'inactive', 'maintenance'])
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { status } = req.body;
    
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: true, message: 'Sensor not found' });
    }
    
    sensor.status = status;
    sensor.lastActive = Date.now();
    await sensor.save();
    
    res.json(sensor);
  } catch (err) {
    console.error('Error updating sensor status:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// POST /api/sensors/:id/readings
// Add a new reading to a sensor
router.post('/:id/readings', [
  check('value', 'Reading value is required').isNumeric(),
  check('unit', 'Unit is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { value, unit } = req.body;
    
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: true, message: 'Sensor not found' });
    }
    
    // Add new reading
    const newReading = {
      timestamp: Date.now(),
      value,
      unit
    };
    
    // Add reading to beginning of array and limit to 100 readings
    sensor.readings.unshift(newReading);
    if (sensor.readings.length > 100) {
      sensor.readings = sensor.readings.slice(0, 100);
    }
    
    sensor.lastActive = Date.now();
    await sensor.save();
    
    // Check for anomalies
    console.log(`Checking for anomalies: ${value} ${unit}`);
    const anomalyResult = await anomalyDetectionService.detectAnomaly(sensor, newReading);
    console.log('Anomaly detection result:', anomalyResult);
    
    // If this is a real anomaly, emit via Socket.io
    if (anomalyResult.anomaly && anomalyResult.alert) {
      const io = req.app.get('io');
      if (io) {
        io.to('alerts-updates').emit('new-alert', anomalyResult);
        
        // If severe enough, also update dashboard
        if (anomalyResult.severity === 'high' || anomalyResult.severity === 'critical') {
          const status = anomalyResult.severity === 'critical' ? 'danger' : 'warning';
          io.to('dashboard-updates').emit('status-update', {
            infrastructureId: sensor.infrastructureId,
            status
          });
        }
      }
    }
    
    // Return combined result
    res.status(201).json({
      reading: newReading,
      anomaly: anomalyResult
    });
  } catch (err) {
    console.error('Error adding sensor reading:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});
// For development/testing: DELETE /api/sensors/:id
// Delete a sensor
router.delete('/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: true, message: 'Sensor not found' });
    }
    
    await Sensor.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Sensor removed' });
  } catch (err) {
    console.error('Error deleting sensor:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

module.exports = router;