// Main Express app configuration
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
require('dotenv').config()

// Import routes (will add these later)
const infrastructureRoutes = require('./routes/infrastructure')
const sensorRoutes = require('./routes/sensors')
const alertRoutes = require('./routes/alerts')
const userRoutes = require('./routes/users')
const simulationRoutes = require('./routes/simulation');
const testRoutes = require('./routes/test');
const authRoutes = require('./routes/auth');




// Create Express app
const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
)
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))
app.use('/api/simulation', simulationRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  })

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'GuardianX API is running' })
})

// API routes (will implement these endpoints progressively)
app.use('/api/infrastructure', infrastructureRoutes)
app.use('/api/sensors', sensorRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/users', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: true,
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' })
})

module.exports = app
