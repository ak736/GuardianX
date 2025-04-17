const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  nonce: {
    type: String,
    required: true
  },
  activeSensors: {
    type: Number,
    default: 0
  },
  totalRewards: {
    type: Number,
    default: 0
  },
  contributionRank: {
    type: Number
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});


// Create index for contribution rank (for leaderboards)
userSchema.index({ contributionRank: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;