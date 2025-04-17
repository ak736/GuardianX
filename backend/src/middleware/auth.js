const User = require('../models/User')
const { verifySignature } = require('../utils/crypto')

/**
 * Middleware to verify wallet authentication
 * Requires 'x-wallet-address' and 'x-wallet-signature' headers
 */
const auth = async (req, res, next) => {
  try {
    // Check for required headers
    const walletAddress = req.header('x-wallet-address')
    const signature = req.header('x-wallet-signature')

    if (!walletAddress || !signature) {
      return res.status(401).json({
        error: true,
        message: 'Authentication required',
      })
    }

    // Find user by wallet address
    const user = await User.findOne({ walletAddress })

    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'User not found',
      })
    }

    // Verify signature (will use the nonce later)
    const message = `Login to GuardianX with wallet ${walletAddress}`
    const isValid = verifySignature(message, signature, walletAddress)

    if (!isValid) {
      return res.status(401).json({
        error: true,
        message: 'Invalid signature',
      })
    }

    // Attach user to request
    req.user = user

    // Update last login time
    user.lastLogin = Date.now()
    await user.save()

    next()
  } catch (err) {
    console.error('Authentication error:', err)
    res.status(500).json({ error: true, message: 'Server error' })
  }
}

module.exports = auth
