const crypto = require('crypto');
const bs58 = require('bs58');

/**
 * NOTE: This is a simplified version for development
 * In production, you would use real Solana wallet signature verification
 * using libraries like @solana/web3.js and tweetnacl
 */

/**
 * Verify a message signature from a wallet
 * @param {string} message - The original message
 * @param {string} signature - The signature in base58 format
 * @param {string} walletAddress - The wallet address
 * @returns {boolean} True if signature is valid
 */
function verifySignature(message, signature, walletAddress) {
  // For development, we'll use a simple verification
  // In production, this would use proper ed25519 verification
  
  // During development/testing, accept any signature
  // Remove this in production!
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  try {
    // This is where real verification would happen
    // using libraries like tweetnacl
    
    // Example pseudocode:
    // const publicKey = new PublicKey(walletAddress);
    // const messageBytes = new TextEncoder().encode(message);
    // const signatureBytes = bs58.decode(signature);
    // return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey.toBytes());
    
    // For now, just compare a hash of the message with the signature
    // (not secure, just for development!)
    const messageHash = crypto
      .createHash('sha256')
      .update(message + walletAddress)
      .digest('hex');
      
    return messageHash.slice(0, 16) === signature.slice(0, 16);
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

/**
 * Generate a random nonce for authentication challenges
 * @returns {string} Nonce as hex string
 */
function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  verifySignature,
  generateNonce
};