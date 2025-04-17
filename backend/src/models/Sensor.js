const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
}, { _id: false });

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['water', 'power', 'telecom'],
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
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
    index: true
  },
  owner: {
    type: String, // Wallet address
    required: true,
    index: true
  },
  infrastructureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Infrastructure',
    required: true,
    index: true
  },
  readings: {
    type: [readingSchema],
    default: [],
    // We'll limit this array to most recent readings
    // Older readings will be stored in a time-series database
    validate: [
      array => array.length <= 100, 
      'Readings array exceeds maximum length of 100'
    ]
  },
  tokensEarned: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create geospatial index for location based queries
sensorSchema.index({ location: '2dsphere' });

// Create compound indexes for common query patterns
sensorSchema.index({ owner: 1, status: 1 });
sensorSchema.index({ infrastructureId: 1, status: 1 });

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;