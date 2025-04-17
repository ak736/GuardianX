const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { check, validationResult } = require('express-validator');

// GET /api/alerts
// Get all alerts with optional filtering
router.get('/', async (req, res) => {
  try {
    const { status, severity, infrastructureType, timeRange } = req.query;
    const filter = {};
    const sort = { createdAt: -1 }; // Default sort by newest
    
    // Add filters if provided
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (infrastructureType) filter.infrastructureType = infrastructureType;
    
    // Time range filter (in hours)
    if (timeRange) {
      const hoursAgo = parseInt(timeRange);
      if (!isNaN(hoursAgo)) {
        const timeThreshold = new Date();
        timeThreshold.setHours(timeThreshold.getHours() - hoursAgo);
        filter.createdAt = { $gte: timeThreshold };
      }
    }
    
    const alerts = await Alert.find(filter).sort(sort);
    
    res.json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// GET /api/alerts/:id
// Get alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ error: true, message: 'Alert not found' });
    }
    
    res.json(alert);
  } catch (err) {
    console.error('Error fetching alert by ID:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// POST /api/alerts
// Create new alert
router.post('/', [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('infrastructureType', 'Infrastructure type must be power, water, or telecom').isIn(['power', 'water', 'telecom']),
  check('infrastructureId', 'Infrastructure ID is required').not().isEmpty(),
  check('location.coordinates', 'Valid coordinates are required').isArray({ min: 2, max: 2 }),
  check('severity', 'Severity must be low, medium, high, or critical').isIn(['low', 'medium', 'high', 'critical']),
  check('area', 'Area is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { 
      title, 
      description, 
      infrastructureType, 
      infrastructureId, 
      sensorId, 
      location, 
      severity, 
      confidence,
      area 
    } = req.body;
    
    // Create new alert
    const newAlert = new Alert({
      title,
      description,
      infrastructureType,
      infrastructureId,
      sensorId,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      severity,
      confidence: confidence || 0.8,
      area
    });
    
    await newAlert.save();
    
    res.status(201).json(newAlert);
  } catch (err) {
    console.error('Error creating alert:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// PATCH /api/alerts/:id/status
// Update alert status (acknowledge or resolve)
router.patch('/:id/status', [
  check('status', 'Status must be acknowledged or resolved').isIn(['acknowledged', 'resolved']),
  check('acknowledgedBy', 'Acknowledging user wallet address is required').optional()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { status, acknowledgedBy } = req.body;
    
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: true, message: 'Alert not found' });
    }
    
    // Update status and related fields
    alert.status = status;
    
    if (status === 'acknowledged' && !alert.acknowledgedAt) {
      alert.acknowledgedAt = Date.now();
      if (acknowledgedBy) {
        alert.acknowledgedBy = acknowledgedBy;
      }
    }
    
    if (status === 'resolved' && !alert.resolvedAt) {
      alert.resolvedAt = Date.now();
    }
    
    await alert.save();
    
    res.json(alert);
  } catch (err) {
    console.error('Error updating alert status:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// For development/testing: DELETE /api/alerts/:id
// Delete an alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: true, message: 'Alert not found' });
    }
    
    await Alert.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Alert removed' });
  } catch (err) {
    console.error('Error deleting alert:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

module.exports = router;