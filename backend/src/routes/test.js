const express = require('express');
const router = express.Router();

// POST /api/test/socket
// Test WebSocket functionality
router.post('/socket', (req, res) => {
  try {
    const { event, data, room } = req.body;
    
    if (!event) {
      return res.status(400).json({ error: true, message: 'Event name is required' });
    }
    
    const io = req.app.get('io');
    
    if (!io) {
      return res.status(500).json({ error: true, message: 'Socket.io not initialized' });
    }
    
    if (room) {
      // Emit to specific room
      io.to(room).emit(event, data || { message: 'Test event' });
    } else {
      // Broadcast to all clients
      io.emit(event, data || { message: 'Test event' });
    }
    
    res.json({ success: true, message: `Event "${event}" emitted`, room });
  } catch (err) {
    console.error('Error in socket test:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

module.exports = router;