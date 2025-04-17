// src/routes/simulation.js
const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const { check, validationResult } = require('express-validator');

// POST /api/simulation/start
// Start a new simulation
router.post('/start', [
  check('scenario', 'Scenario is required').optional(),
  check('duration', 'Duration must be a number').optional().isNumeric(),
  check('speed', 'Speed must be a number between 1 and 100').optional().isNumeric().isInt({ min: 1, max: 100 })
], simulationController.startSimulation);

// POST /api/simulation/:simulationId/stop
// Stop a running simulation
router.post('/:simulationId/stop', simulationController.stopSimulation);

// GET /api/simulation/:simulationId
// Get simulation status
router.get('/:simulationId', simulationController.getSimulationStatus);

// POST /api/simulation/:simulationId/anomaly
// Inject an anomaly into the simulation
router.post('/:simulationId/anomaly', [
  check('infrastructureType', 'Infrastructure type must be power, water, or telecom').isIn(['power', 'water', 'telecom']),
  check('severity', 'Severity must be low, medium, high, or critical').isIn(['low', 'medium', 'high', 'critical']),
  check('anomalyType', 'Anomaly type is required').not().isEmpty()
], simulationController.injectAnomaly);

module.exports = router;