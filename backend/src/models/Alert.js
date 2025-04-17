const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  infrastructureType: {
    type: String,
    required: true,
    enum: ['power', 'water', 'telecom'],
    index: true
  },
  infrastructureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Infrastructure',
    required: true,
    index: true
  },
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor',
    index: true
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['new', 'acknowledged', 'resolved'],
    default: 'new',
    index: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  resolvedAt: {
    type: Date
  },
  acknowledgedAt: {
    type: Date
  },
  acknowledgedBy: {
    type: String // Wallet address of user who acknowledged
  },
  area: {
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location based queries
alertSchema.index({ location: '2dsphere' });

// Create compound indexes for common query patterns
alertSchema.index({ status: 1, severity: 1 });
alertSchema.index({ infrastructureType: 1, status: 1 });
alertSchema.index({ createdAt: -1 }); // For time-based queries

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;