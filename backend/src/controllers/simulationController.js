// src/controllers/simulationController.js
const simulationService = require('../services/simulation');

// Start a new simulation
exports.startSimulation = async (req, res) => {
  try {
    const { scenario = 'normal', duration = 3600, speed = 10 } = req.body;
    
    const simulation = await simulationService.startSimulation({
      scenario,
      duration,
      speed
    });
    
    // Set up event handlers to broadcast via Socket.io
    const io = req.app.get('io');
    
    simulationService.on('reading', (data) => {
      io.to(`sensor-${data.sensorId}`).emit('sensor-reading', data);
    });
    
    simulationService.on('anomaly', (data) => {
      io.to('dashboard-updates').emit('status-update', {
        infrastructureId: data.infrastructureId,
        status: data.severity === 'critical' ? 'danger' : 'warning'
      });
      
      io.to('alerts-updates').emit('new-alert', data);
    });
    
    res.json({
      message: 'Simulation started',
      simulation
    });
  } catch (err) {
    console.error('Error starting simulation:', err);
    res.status(500).json({ error: true, message: err.message });
  }
};

// Stop a running simulation
exports.stopSimulation = async (req, res) => {
  try {
    const { simulationId } = req.params;
    
    const result = await simulationService.stopSimulation(simulationId);
    
    // Notify clients via Socket.io
    const io = req.app.get('io');
    io.to('dashboard-updates').emit('simulation-stopped');
    
    res.json(result);
  } catch (err) {
    console.error('Error stopping simulation:', err);
    res.status(500).json({ error: true, message: err.message });
  }
};

// Get simulation status
exports.getSimulationStatus = async (req, res) => {
  try {
    const { simulationId } = req.params;
    
    const status = simulationService.getSimulationStatus(simulationId);
    
    res.json(status);
  } catch (err) {
    console.error('Error getting simulation status:', err);
    res.status(500).json({ error: true, message: err.message });
  }
};

// Inject anomaly into simulation
exports.injectAnomaly = async (req, res) => {
  try {
    const { simulationId } = req.params;
    const { infrastructureType, severity, anomalyType } = req.body;
    
    const anomaly = await simulationService.injectAnomaly(simulationId, {
      infrastructureType,
      severity,
      anomalyType
    });
    
    res.json(anomaly);
  } catch (err) {
    console.error('Error injecting anomaly:', err);
    res.status(500).json({ error: true, message: err.message });
  }
};