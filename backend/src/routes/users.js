const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Sensor = require('../models/Sensor');
const crypto = require('crypto');
const { check, validationResult } = require('express-validator');

// GET /api/users/:walletAddress
// Get user by wallet address
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    // Get user's active sensors count
    const activeSensors = await Sensor.countDocuments({
      owner: req.params.walletAddress,
      status: 'active'
    });
    
    // Return user with additional metrics
    const userData = {
      ...user.toObject(),
      activeSensors
    };
    
    res.json(userData);
  } catch (err) {
    console.error('Error fetching user by wallet address:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// POST /api/users/connect
// Connect/register a new wallet
router.post('/connect', [
  check('walletAddress', 'Valid wallet address is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { walletAddress } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ walletAddress });
    
    if (user) {
      // Update login time for existing user
      user.lastLogin = Date.now();
      await user.save();
      
      return res.json(user);
    }
    
    // Create new user with wallet address
    const nonce = crypto.randomBytes(16).toString('hex');
    
    user = new User({
      walletAddress,
      nonce,
      joinedAt: Date.now()
    });
    
    await user.save();
    
    res.status(201).json(user);
  } catch (err) {
    console.error('Error connecting wallet:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// GET /api/users/:walletAddress/nonce
// Get authentication nonce for a wallet
router.get('/:walletAddress/nonce', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    
    if (!user) {
      // Create new user with wallet address if not found
      const nonce = crypto.randomBytes(16).toString('hex');
      
      const newUser = new User({
        walletAddress: req.params.walletAddress,
        nonce
      });
      
      await newUser.save();
      
      return res.json({ nonce });
    }
    
    // Generate new nonce for existing user
    user.nonce = crypto.randomBytes(16).toString('hex');
    await user.save();
    
    res.json({ nonce: user.nonce });
  } catch (err) {
    console.error('Error getting wallet nonce:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// GET /api/users/:walletAddress/sensors
// Get all sensors for a user
router.get('/:walletAddress/sensors', async (req, res) => {
  try {
    const sensors = await Sensor.find({ owner: req.params.walletAddress });
    
    res.json(sensors);
  } catch (err) {
    console.error('Error fetching user sensors:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// GET /api/users/leaderboard
// Get user leaderboard based on contribution
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const topUsers = await User.find()
      .sort({ totalRewards: -1 })
      .limit(limit)
      .select('walletAddress totalRewards contributionRank');
    
    res.json(topUsers);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// PATCH /api/users/:walletAddress/tokens
// Update user token balance
router.patch('/:walletAddress/tokens', [
  check('amount', 'Amount must be a positive number').isNumeric()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { amount } = req.body;
    
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    
    // Update token balance
    user.totalRewards += parseFloat(amount);
    await user.save();
    
    // Update contribution ranks for all users (in production this would be a scheduled job)
    await updateContributionRanks();
    
    res.json(user);
  } catch (err) {
    console.error('Error updating user tokens:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

// Helper function to update contribution ranks
async function updateContributionRanks() {
  try {
    // Get all users sorted by total rewards
    const users = await User.find()
      .sort({ totalRewards: -1 });
    
    // Update rank for each user
    for (let i = 0; i < users.length; i++) {
      users[i].contributionRank = i + 1;
      await users[i].save();
    }
  } catch (err) {
    console.error('Error updating contribution ranks:', err);
  }
}

module.exports = router;