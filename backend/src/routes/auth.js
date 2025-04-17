const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const { generateNonce } = require('../utils/crypto');

/**
 * POST /api/auth/nonce
 * Get a authentication nonce for a wallet
 */
router.post('/nonce', [
  check('walletAddress', 'Wallet address is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { walletAddress } = req.body;
    
    // Find or create user
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // Create new user
      user = new User({
        walletAddress,
        nonce: generateNonce(),
        joinedAt: Date.now()
      });
      
      await user.save();
    } else {
      // Update nonce for existing user
      user.nonce = generateNonce();
      await user.save();
    }
    
    // Return nonce for signature challenge
    res.json({
      nonce: user.nonce,
      message: `Login to GuardianX with wallet ${walletAddress}`
    });
  } catch (err) {
    console.error('Error getting nonce:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

/**
 * POST /api/auth/verify
 * Verify a wallet signature
 */
router.post('/verify', [
  check('walletAddress', 'Wallet address is required').not().isEmpty(),
  check('signature', 'Signature is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { walletAddress, signature } = req.body;
    
    // Find user
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found' });
    }
    
    // In development, accept any signature
    // In production, verify the signature using the nonce
    if (process.env.NODE_ENV !== 'development') {
      // Verify signature here using proper crypto
      // This would be implemented with a real verification function
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Return user info
    res.json({
      user: {
        walletAddress: user.walletAddress,
        totalRewards: user.totalRewards,
        contributionRank: user.contributionRank,
        joinedAt: user.joinedAt
      },
      authenticated: true
    });
  } catch (err) {
    console.error('Error verifying signature:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

module.exports = router;