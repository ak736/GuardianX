// Entry point for GuardianX backend
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join rooms for real-time updates
  socket.on('join-dashboard', () => {
    console.log(`Socket ${socket.id} joined dashboard updates`);
    socket.join('dashboard-updates');
  });
  
  socket.on('join-alerts', () => {
    console.log(`Socket ${socket.id} joined alerts updates`);
    socket.join('alerts-updates');
  });
  
  socket.on('join-infrastructure', (infrastructureId) => {
    console.log(`Socket ${socket.id} joined infrastructure-${infrastructureId}`);
    socket.join(`infrastructure-${infrastructureId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to our routes
app.set('io', io);

// Start the server
server.listen(PORT, () => {
  console.log(`GuardianX server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});