// src/services/simulation.js
const Infrastructure = require('../models/Infrastructure');
const Sensor = require('../models/Sensor');
const Alert = require('../models/Alert');
const EventEmitter = require('events');

class SimulationService extends EventEmitter {
  constructor() {
    super();
    this.simulations = new Map();
    this.nextSimulationId = 1;
  }

  // Start a new simulation
  async startSimulation(config) {
    const { scenario, duration, speed } = config;
    
    // Create a new simulation instance
    const simulationId = `sim_${this.nextSimulationId++}`;
    
    // Get all infrastructure and sensors
    const infrastructure = await Infrastructure.find();
    const sensors = await Sensor.find({ status: 'active' });
    
    if (infrastructure.length === 0 || sensors.length === 0) {
      throw new Error('No infrastructure or active sensors found');
    }
    
    // Set up simulation state
    const simulation = {
      id: simulationId,
      config,
      infrastructure,
      sensors,
      running: true,
      startTime: Date.now(),
      endTime: Date.now() + (duration * 1000),
      intervalIds: [],
      anomalies: []
    };
    
    // Generate regular readings
    const readingInterval = setInterval(() => {
      if (!simulation.running) return;
      
      // Generate readings for each sensor
      sensors.forEach(async (sensor) => {
        try {
          const reading = this.generateReading(sensor, simulation);
          
          // Save reading to database (limited to last 100)
          await Sensor.findByIdAndUpdate(sensor._id, {
            $push: { 
              readings: { 
                $each: [reading],
                $position: 0,
                $slice: 100 
              } 
            },
            lastActive: new Date()
          });
          
          // Emit reading event
          this.emit('reading', { sensorId: sensor._id, reading });
        } catch (err) {
          console.error(`Error generating reading for sensor ${sensor._id}:`, err);
        }
      });
    }, 5000 / speed); // Generate readings at accelerated rate
    
    simulation.intervalIds.push(readingInterval);
    
    // Based on scenario, schedule anomalies
    if (scenario === 'water-leak') {
      // Schedule a water leak anomaly after 30 seconds
      setTimeout(() => {
        this.injectAnomaly(simulationId, {
          infrastructureType: 'water',
          severity: 'high',
          anomalyType: 'pressure-drop'
        });
      }, 30000 / speed);
    } else if (scenario === 'power-surge') {
      // Schedule a power surge anomaly after 45 seconds
      setTimeout(() => {
        this.injectAnomaly(simulationId, {
          infrastructureType: 'power',
          severity: 'critical',
          anomalyType: 'voltage-spike'
        });
      }, 45000 / speed);
    } else if (scenario === 'cascading-failure') {
      // Schedule multiple cascading failures
      setTimeout(() => {
        this.injectAnomaly(simulationId, {
          infrastructureType: 'power',
          severity: 'medium',
          anomalyType: 'frequency-drift'
        });
      }, 20000 / speed);
      
      setTimeout(() => {
        this.injectAnomaly(simulationId, {
          infrastructureType: 'telecom',
          severity: 'high',
          anomalyType: 'connectivity-loss'
        });
      }, 50000 / speed);
      
      setTimeout(() => {
        this.injectAnomaly(simulationId, {
          infrastructureType: 'water',
          severity: 'critical',
          anomalyType: 'control-system-failure'
        });
      }, 80000 / speed);
    }
    
    // Auto-stop simulation after duration
    const stopTimeout = setTimeout(() => {
      this.stopSimulation(simulationId);
    }, duration * 1000 / speed);
    
    simulation.intervalIds.push(stopTimeout);
    
    // Store simulation
    this.simulations.set(simulationId, simulation);
    
    return {
      id: simulationId,
      ...config
    };
  }
  
  // Stop a running simulation
  async stopSimulation(simulationId) {
    const simulation = this.simulations.get(simulationId);
    
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }
    
    // Clean up intervals
    simulation.intervalIds.forEach(id => clearTimeout(id));
    
    // Mark as not running
    simulation.running = false;
    simulation.endTime = Date.now();
    
    // Reset infrastructure status
    await Infrastructure.updateMany({}, { status: 'normal' });
    
    // Emit simulation stopped event
    this.emit('simulation-stopped', { simulationId });
    
    return { message: 'Simulation stopped' };
  }
  
  // Generate a single sensor reading based on current state
  generateReading(sensor, simulation) {
    const { type } = sensor;
    let value, unit;
    
    // Check if there's an active anomaly affecting this sensor
    const relevantAnomaly = simulation.anomalies.find(a => 
      a.infrastructureType === type && 
      a.active
    );
    
    // Generate reading based on sensor type and anomaly state
    if (type === 'water') {
      // Water pressure (PSI)
      unit = 'psi';
      
      if (relevantAnomaly) {
        if (relevantAnomaly.anomalyType === 'pressure-drop') {
          // Decreasing pressure
          value = 30 - (Math.random() * 15);
        } else if (relevantAnomaly.anomalyType === 'pressure-spike') {
          // Increasing pressure
          value = 60 + (Math.random() * 20);
        } else {
          // Erratic pressure
          value = Math.random() * 80;
        }
      } else {
        // Normal pressure range (45-55 PSI)
        value = 50 + (Math.random() * 10 - 5);
      }
    } else if (type === 'power') {
      // Voltage (V)
      unit = 'V';
      
      if (relevantAnomaly) {
        if (relevantAnomaly.anomalyType === 'voltage-spike') {
          // Voltage spike
          value = 130 + (Math.random() * 15);
        } else if (relevantAnomaly.anomalyType === 'voltage-drop') {
          // Voltage drop
          value = 95 - (Math.random() * 10);
        } else {
          // Erratic voltage
          value = 100 + (Math.random() * 40 - 20);
        }
      } else {
        // Normal voltage range (118-122V)
        value = 120 + (Math.random() * 4 - 2);
      }
    } else if (type === 'telecom') {
      // Latency (ms)
      unit = 'ms';
      
      if (relevantAnomaly) {
        if (relevantAnomaly.anomalyType === 'connectivity-loss') {
          // High latency
          value = 200 + (Math.random() * 800);
        } else {
          // Erratic latency
          value = Math.random() * 500;
        }
      } else {
        // Normal latency range (15-30ms)
        value = 20 + (Math.random() * 15 - 5);
      }
    }
    
    return {
      timestamp: Date.now(),
      value,
      unit
    };
  }
  
  // Inject an anomaly into the simulation
  async injectAnomaly(simulationId, anomalyConfig) {
    const simulation = this.simulations.get(simulationId);
    
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }
    
    const { infrastructureType, severity, anomalyType } = anomalyConfig;
    
    // Find matching infrastructure
    const affectedInfrastructure = simulation.infrastructure.find(
      infra => infra.type === infrastructureType
    );
    
    if (!affectedInfrastructure) {
      throw new Error(`No ${infrastructureType} infrastructure found`);
    }
    
    // Create anomaly record
    const anomaly = {
      id: `anomaly_${Date.now()}`,
      infrastructureType,
      infrastructureId: affectedInfrastructure._id,
      severity,
      anomalyType,
      startTime: Date.now(),
      active: true
    };
    
    // Add to simulation anomalies
    simulation.anomalies.push(anomaly);
    
    // Update infrastructure status
    await Infrastructure.findByIdAndUpdate(affectedInfrastructure._id, {
      status: severity === 'critical' ? 'danger' : 'warning'
    });
    
    // Create alert in database
    const alertTitle = this.getAnomalyTitle(anomalyType, infrastructureType);
    const alertDescription = this.getAnomalyDescription(anomalyType, infrastructureType);
    
    const alert = new Alert({
      title: alertTitle,
      description: alertDescription,
      infrastructureType,
      infrastructureId: affectedInfrastructure._id,
      location: affectedInfrastructure.location,
      severity,
      status: 'new',
      confidence: 0.85 + (Math.random() * 0.15),
      area: this.getRandomArea()
    });
    
    await alert.save();
    
    // Emit anomaly event
    this.emit('anomaly', {
      ...anomaly,
      infrastructureId: affectedInfrastructure._id,
      alert: alert._id
    });
    
    return anomaly;
  }
  
  // Helper functions for generating alert content
  getAnomalyTitle(anomalyType, infrastructureType) {
    const titles = {
      'water': {
        'pressure-drop': 'Water Pressure Anomaly',
        'pressure-spike': 'Water Pressure Surge',
        'control-system-failure': 'Water Control System Failure'
      },
      'power': {
        'voltage-spike': 'Power Surge Detected',
        'voltage-drop': 'Voltage Sag Detected',
        'frequency-drift': 'Power Frequency Anomaly'
      },
      'telecom': {
        'connectivity-loss': 'Network Connectivity Issues',
        'latency-spike': 'Network Latency Anomaly'
      }
    };
    
    return titles[infrastructureType]?.[anomalyType] || 
           `${infrastructureType.charAt(0).toUpperCase() + infrastructureType.slice(1)} Anomaly`;
  }
  
  getAnomalyDescription(anomalyType, infrastructureType) {
    const descriptions = {
      'water': {
        'pressure-drop': 'Unusual pressure drop detected in water supply line.',
        'pressure-spike': 'Dangerous pressure surge detected in water system.',
        'control-system-failure': 'Control system unresponsive in water treatment facility.'
      },
      'power': {
        'voltage-spike': 'Voltage surge detected in power distribution grid.',
        'voltage-drop': 'Voltage sag detected in electrical supply.',
        'frequency-drift': 'Frequency instability detected in power grid.'
      },
      'telecom': {
        'connectivity-loss': 'Significant packet loss detected in network backbone.',
        'latency-spike': 'Unusual latency detected in data transmission.'
      }
    };
    
    return descriptions[infrastructureType]?.[anomalyType] || 
           `Anomaly detected in ${infrastructureType} infrastructure.`;
  }
  
  getRandomArea() {
    const areas = [
      'Downtown Area',
      'Eastern District',
      'Western Suburb',
      'North Sector',
      'Industrial Park',
      'Central Business District',
      'Residential Zone'
    ];
    
    return areas[Math.floor(Math.random() * areas.length)];
  }
  
  // Get simulation status
  getSimulationStatus(simulationId) {
    const simulation = this.simulations.get(simulationId);
    
    if (!simulation) {
      throw new Error(`Simulation ${simulationId} not found`);
    }
    
    return {
      id: simulation.id,
      config: simulation.config,
      running: simulation.running,
      startTime: simulation.startTime,
      endTime: simulation.endTime,
      anomalies: simulation.anomalies.length,
      elapsed: Date.now() - simulation.startTime
    };
  }
}

// Create singleton instance
const simulationService = new SimulationService();

module.exports = simulationService;