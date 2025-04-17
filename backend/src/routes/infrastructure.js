const express = require('express');
const router = express.Router();
const Infrastructure = require('../models/Infrastructure');
const { check, validationResult } = require('express-validator');

// GET /api/infrastructure
// Get all infrastructure or filter by type
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    
    // Add filters if provided
    if (type) filter.type = type;
    if (status) filter.status = status;
    
    const infrastructure = await Infrastructure.find(filter);
    
    // Format as GeoJSON for map rendering on frontend
    const geoJson = {
      type: 'FeatureCollection',
      features: infrastructure.map(item => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: item.location.coordinates
        },
        properties: {
          id: item._id,
          name: item.name,
          type: item.type,
          status: item.status,
          description: item.description
        }
      }))
    };
    
    res.json(geoJson);
  } catch (err) {
    console.error('Error fetching infrastructure:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// GET /api/infrastructure/:id
// Get infrastructure by ID
router.get('/:id', async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findById(req.params.id);
    
    if (!infrastructure) {
      return res.status(404).json({ error: true, message: 'Infrastructure not found' });
    }
    
    res.json(infrastructure);
  } catch (err) {
    console.error('Error fetching infrastructure by ID:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// POST /api/infrastructure
// Create new infrastructure item
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('type', 'Type must be power, water, or telecom').isIn(['power', 'water', 'telecom']),
  check('location.coordinates', 'Valid coordinates are required').isArray({ min: 2, max: 2 }),
  check('description', 'Description is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { name, type, location, description, status, metadata } = req.body;
    
    // Create new infrastructure
    const newInfrastructure = new Infrastructure({
      name,
      type,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      status: status || 'normal',
      description,
      metadata: metadata || {}
    });
    
    await newInfrastructure.save();
    
    res.status(201).json(newInfrastructure);
  } catch (err) {
    console.error('Error creating infrastructure:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// PATCH /api/infrastructure/:id/status
// Update infrastructure status
router.patch('/:id/status', [
  check('status', 'Status must be normal, warning, or danger').isIn(['normal', 'warning', 'danger'])
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { status } = req.body;
    
    const infrastructure = await Infrastructure.findById(req.params.id);
    if (!infrastructure) {
      return res.status(404).json({ error: true, message: 'Infrastructure not found' });
    }
    
    infrastructure.status = status;
    infrastructure.updatedAt = Date.now();
    await infrastructure.save();
    
    res.json(infrastructure);
  } catch (err) {
    console.error('Error updating infrastructure status:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// For development/testing: DELETE /api/infrastructure/:id
// Delete infrastructure item
router.delete('/:id', async (req, res) => {
  try {
    const infrastructure = await Infrastructure.findById(req.params.id);
    if (!infrastructure) {
      return res.status(404).json({ error: true, message: 'Infrastructure not found' });
    }
    
    await Infrastructure.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Infrastructure removed' });
  } catch (err) {
    console.error('Error deleting infrastructure:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

module.exports = router;