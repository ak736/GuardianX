const math = require('mathjs');
const Alert = require('../models/Alert');
const Infrastructure = require('../models/Infrastructure');

class AnomalyDetectionService {
  constructor() {
    // Detection thresholds for different infrastructure types
    this.thresholds = {
      water: {
        pressure: {
          low: 30,    // PSI below this is an anomaly
          high: 65,   // PSI above this is an anomaly
          stdDev: 5   // Standard deviation threshold
        }
      },
      power: {
        voltage: {
          low: 110,   // Volts below this is an anomaly
          high: 130,  // Volts above this is an anomaly
          stdDev: 4   // Standard deviation threshold
        }
      },
      telecom: {
        latency: {
          high: 100,  // ms above this is an anomaly
          stdDev: 20  // Standard deviation threshold
        }
      }
    };
  }
  
  /**
   * Detect anomalies in sensor readings
   * @param {Object} sensor - Sensor document
   * @param {Object} reading - New reading
   * @returns {Object} Detection result
   */
  async detectAnomaly(sensor, reading) {
    try {
      console.log('Starting anomaly detection for', sensor.type, 'sensor');
      const { type } = sensor;
      const { value, unit } = reading;
      
      console.log(`Analyzing reading: ${value} ${unit}`);
      
      // Determine if anomaly based on type-specific thresholds
      let isAnomaly = false;
      let confidence = 0;
      let severity = 'low';
      let anomalyType = null;
      let message = 'Normal operation';
      
      // For testing and development, directly check against thresholds
      // without requiring historical data
      if (type === 'water') {
        // Water pressure anomaly detection
        console.log('Checking water pressure thresholds:', this.thresholds.water.pressure);
        const { low, high } = this.thresholds.water.pressure;
        
        if (value < low) {
          console.log(`Water pressure (${value}) below threshold (${low})`);
          isAnomaly = true;
          anomalyType = 'pressure-drop';
          confidence = this.calculateConfidence(low - value, 20);
          message = 'Water pressure below normal operating range';
          severity = confidence > 0.85 ? 'high' : 'medium';
        } else if (value > high) {
          console.log(`Water pressure (${value}) above threshold (${high})`);
          isAnomaly = true;
          anomalyType = 'pressure-surge';
          confidence = this.calculateConfidence(value - high, 20);
          message = 'Water pressure above normal operating range';
          severity = confidence > 0.85 ? 'high' : 'medium';
        }
      } else if (type === 'power') {
        // Power voltage anomaly detection
        const { low, high } = this.thresholds.power.voltage;
        
        if (value < low) {
          isAnomaly = true;
          anomalyType = 'voltage-drop';
          confidence = this.calculateConfidence(low - value, 20);
          message = 'Power voltage below normal operating range';
          severity = confidence > 0.9 ? 'critical' : confidence > 0.75 ? 'high' : 'medium';
        } else if (value > high) {
          isAnomaly = true;
          anomalyType = 'voltage-surge';
          confidence = this.calculateConfidence(value - high, 20);
          message = 'Power voltage above normal operating range';
          severity = confidence > 0.9 ? 'critical' : confidence > 0.75 ? 'high' : 'medium';
        }
      } else if (type === 'telecom') {
        // Telecom latency anomaly detection
        const { high } = this.thresholds.telecom.latency;
        
        if (value > high) {
          isAnomaly = true;
          anomalyType = 'latency-surge';
          confidence = this.calculateConfidence(value - high, 100);
          message = 'Network latency above normal operating range';
          severity = confidence > 0.9 ? 'high' : confidence > 0.75 ? 'medium' : 'low';
        }
      }
      
      console.log('Anomaly detection result:', { isAnomaly, confidence, severity, anomalyType });
      
      // If anomaly detected, create alert
      if (isAnomaly && confidence > 0.5) {
        console.log('Creating alert for anomaly');
        const result = await this.createAlert(sensor, {
          anomalyType,
          severity,
          confidence,
          message,
          value,
          unit
        });
        
        return {
          anomaly: true,
          confidence,
          severity,
          message,
          anomalyType,
          alert: result.alertId
        };
      }
      
      return {
        anomaly: false,
        confidence: 0,
        message: 'Normal operation'
      };
    } catch (err) {
      console.error('Error in anomaly detection:', err);
      return {
        anomaly: false,
        error: err.message
      };
    }
  }
  
  /**
   * Calculate confidence score for anomaly
   * @param {Number} deviation - How far from threshold
   * @param {Number} maxDeviation - Max expected deviation
   * @returns {Number} Confidence between 0 and 1
   */
  calculateConfidence(deviation, maxDeviation) {
    // Limit confidence to 0.95 max
    return Math.min(0.5 + (deviation / maxDeviation) * 0.45, 0.95);
  }
  
  /**
   * Create alert for detected anomaly
   * @param {Object} sensor - Sensor document
   * @param {Object} anomaly - Anomaly details
   * @returns {Object} Result with alert ID
   */
  async createAlert(sensor, anomaly) {
    try {
      // Get infrastructure details
      const infrastructure = await Infrastructure.findById(sensor.infrastructureId);
      
      if (!infrastructure) {
        throw new Error('Associated infrastructure not found');
      }
      
      // Generate alert title
      const title = this.getAlertTitle(anomaly.anomalyType, sensor.type);
      
      // Create description with value information
      const description = `${anomaly.message}. Reading: ${anomaly.value} ${anomaly.unit}.`;
      
      // Create alert
      const alert = new Alert({
        title,
        description,
        infrastructureType: sensor.type,
        infrastructureId: sensor.infrastructureId,
        sensorId: sensor._id,
        location: sensor.location,
        severity: anomaly.severity,
        confidence: anomaly.confidence,
        status: 'new',
        area: infrastructure.name || 'Unknown Area'
      });
      
      await alert.save();
      console.log('Alert created:', alert._id);
      
      // Update infrastructure status if high severity
      if (anomaly.severity === 'high' || anomaly.severity === 'critical') {
        const status = anomaly.severity === 'critical' ? 'danger' : 'warning';
        await Infrastructure.findByIdAndUpdate(
          sensor.infrastructureId,
          { status },
          { new: true }
        );
      }
      
      return {
        success: true,
        alertId: alert._id
      };
    } catch (err) {
      console.error('Error creating alert:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }
  
  /**
   * Get alert title based on anomaly type
   * @param {String} anomalyType - Type of anomaly
   * @param {String} infrastructureType - Type of infrastructure
   * @returns {String} Alert title
   */
  getAlertTitle(anomalyType, infrastructureType) {
    const titles = {
      water: {
        'pressure-drop': 'Water Pressure Anomaly',
        'pressure-surge': 'Water Pressure Surge',
        'pressure-fluctuation': 'Water Pressure Fluctuations'
      },
      power: {
        'voltage-drop': 'Power Voltage Sag',
        'voltage-surge': 'Power Surge Detected',
        'voltage-fluctuation': 'Power Fluctuations'
      },
      telecom: {
        'latency-surge': 'Network Latency Issues',
        'latency-fluctuation': 'Network Performance Degradation'
      }
    };
    
    return titles[infrastructureType]?.[anomalyType] || 
           `${infrastructureType.charAt(0).toUpperCase() + infrastructureType.slice(1)} Anomaly`;
  }
}

// Create singleton instance
const anomalyDetectionService = new AnomalyDetectionService();

module.exports = anomalyDetectionService;