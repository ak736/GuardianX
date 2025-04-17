const mongoose = require('mongoose');
const Infrastructure = require('../models/Infrastructure');
const Sensor = require('../models/Sensor');
const Alert = require('../models/Alert');
const User = require('../models/User');
require('dotenv').config();

// Sample infrastructure data based on the frontend images
const infrastructureData = [
  {
    name: 'Power Substation Alpha',
    type: 'power',
    location: {
      type: 'Point',
      coordinates: [-74.45, 40.05] // Example coordinates, adjust as needed
    },
    status: 'normal',
    description: 'Main power distribution substation for eastern grid sector'
  },
  {
    name: 'Water Treatment Facility',
    type: 'water',
    location: {
      type: 'Point',
      coordinates: [-74.43, 40.03]
    },
    status: 'warning',
    description: 'Municipal water treatment and distribution center'
  },
  {
    name: 'Telecommunications Point Alpha',
    type: 'telecom',
    location: {
      type: 'Point',
      coordinates: [-74.44, 40.07]
    },
    status: 'normal',
    description: 'Fiber optic backbone connection hub'
  },
  {
    name: 'Hill Reservoir',
    type: 'water',
    location: {
      type: 'Point',
      coordinates: [-74.48, 40.04]
    },
    status: 'normal',
    description: 'Primary water storage reservoir for western district'
  },
  {
    name: 'Substation Bravo',
    type: 'power',
    location: {
      type: 'Point',
      coordinates: [-74.46, 40.06]
    },
    status: 'normal',
    description: 'Secondary power distribution for residential areas'
  }
];

// Sample wallet address
const testWalletAddress = 'FznwnHqGtEH2Eru8vMHpqr8eUhU9Mits4X2ReP59An4';

// Sample alerts matching the frontend
const alertData = [
  {
    title: 'Water Pressure Anomaly',
    description: 'Unusual pressure fluctuations detected in the main water supply line.',
    infrastructureType: 'water',
    severity: 'medium',
    status: 'new',
    area: 'Downtown Area',
    confidence: 0.82
  },
  {
    title: 'Power Fluctuations',
    description: 'Voltage irregularities detected in the eastern district grid.',
    infrastructureType: 'power',
    severity: 'high',
    status: 'acknowledged',
    area: 'Eastern District',
    confidence: 0.91
  },
  {
    title: 'Network Latency Issues',
    description: 'Increased latency detected in the fiber optic backbone.',
    infrastructureType: 'telecom',
    severity: 'low',
    status: 'acknowledged',
    area: 'North Sector',
    confidence: 0.75
  },
  {
    title: 'Critical Water Main Leak Prediction',
    description: 'AI model predicts imminent failure in water main based on pressure patterns.',
    infrastructureType: 'water',
    severity: 'critical',
    status: 'resolved',
    area: 'Western Suburb',
    confidence: 0.95
  },
  {
    title: 'Substation Thermal Anomaly',
    description: 'Thermal sensors indicate abnormal heating patterns in substation equipment.',
    infrastructureType: 'power',
    severity: 'high',
    status: 'resolved',
    area: 'Industrial Park',
    confidence: 0.88
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Clear existing data
async function clearData() {
  try {
    await Infrastructure.deleteMany({});
    await Sensor.deleteMany({});
    await Alert.deleteMany({});
    await User.deleteMany({});
    console.log('All existing data cleared');
  } catch (err) {
    console.error('Error clearing data:', err);
    process.exit(1);
  }
}

// Seed infrastructure data
async function seedInfrastructure() {
  try {
    const result = await Infrastructure.insertMany(infrastructureData);
    console.log(`${result.length} infrastructure items inserted`);
    return result;
  } catch (err) {
    console.error('Error seeding infrastructure:', err);
    process.exit(1);
  }
}

// Seed user data
async function seedUser() {
  try {
    const user = new User({
      walletAddress: testWalletAddress,
      nonce: '1234567890abcdef',
      totalRewards: 305,
      contributionRank: 42,
      joinedAt: new Date('2025-03-15T00:00:00.000Z')
    });
    
    await user.save();
    console.log('Test user inserted');
    return user;
  } catch (err) {
    console.error('Error seeding user:', err);
    process.exit(1);
  }
}

// Seed sensor data
async function seedSensors(infrastructure, user) {
  try {
    const sensors = [];
    
    // Create 12 sensors (4 for each infrastructure type)
    for (let i = 0; i < 12; i++) {
      const infrastructureItem = infrastructure[i % infrastructure.length];
      
      // Create sensor near infrastructure location
      const sensorLocation = {
        type: 'Point',
        coordinates: [
          infrastructureItem.location.coordinates[0] + (Math.random() * 0.01 - 0.005),
          infrastructureItem.location.coordinates[1] + (Math.random() * 0.01 - 0.005)
        ]
      };
      
      const sensor = new Sensor({
        name: `Sensor #${i + 1}`,
        type: infrastructureItem.type,
        location: sensorLocation,
        status: 'active',
        owner: user.walletAddress,
        infrastructureId: infrastructureItem._id,
        readings: [
          {
            timestamp: Date.now() - 3600000,
            value: Math.random() * 100,
            unit: infrastructureItem.type === 'power' ? 'kW' : 
                  infrastructureItem.type === 'water' ? 'psi' : 'ms'
          },
          {
            timestamp: Date.now(),
            value: Math.random() * 100,
            unit: infrastructureItem.type === 'power' ? 'kW' : 
                  infrastructureItem.type === 'water' ? 'psi' : 'ms'
          }
        ],
        tokensEarned: Math.floor(Math.random() * 30) + 10
      });
      
      await sensor.save();
      sensors.push(sensor);
    }
    
    console.log(`${sensors.length} sensors inserted`);
    return sensors;
  } catch (err) {
    console.error('Error seeding sensors:', err);
    process.exit(1);
  }
}

// Seed alert data
async function seedAlerts(infrastructure) {
  try {
    const alerts = [];
    
    for (let i = 0; i < alertData.length; i++) {
      // Find matching infrastructure
      const matchingInfrastructure = infrastructure.find(
        item => item.type === alertData[i].infrastructureType
      );
      
      if (!matchingInfrastructure) continue;
      
      // Calculate timestamps
      const now = new Date();
      
      let createdAt;
      if (i === 0) createdAt = new Date(now.getTime() - (15 * 60 * 1000)); // 15 mins ago
      else if (i === 1) createdAt = new Date(now.getTime() - (2 * 60 * 60 * 1000)); // 2 hours ago
      else if (i === 2) createdAt = new Date(now.getTime() - (4 * 60 * 60 * 1000)); // 4 hours ago
      else if (i === 3) createdAt = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 1 day ago
      else createdAt = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)); // 2 days ago
      
      // Create alert
      const alert = new Alert({
        ...alertData[i],
        infrastructureId: matchingInfrastructure._id,
        location: matchingInfrastructure.location,
        createdAt,
        acknowledgedAt: alertData[i].status === 'acknowledged' || alertData[i].status === 'resolved' 
          ? new Date(createdAt.getTime() + (30 * 60 * 1000)) // 30 mins after creation
          : undefined,
        resolvedAt: alertData[i].status === 'resolved'
          ? new Date(createdAt.getTime() + (2 * 60 * 60 * 1000)) // 2 hours after creation
          : undefined,
        acknowledgedBy: alertData[i].status === 'acknowledged' || alertData[i].status === 'resolved'
          ? testWalletAddress
          : undefined
      });
      
      await alert.save();
      alerts.push(alert);
    }
    
    console.log(`${alerts.length} alerts inserted`);
    return alerts;
  } catch (err) {
    console.error('Error seeding alerts:', err);
    process.exit(1);
  }
}

// Run the seed process
async function seedDatabase() {
  try {
    await connectDB();
    await clearData();
    
    const infrastructure = await seedInfrastructure();
    const user = await seedUser();
    await seedSensors(infrastructure, user);
    await seedAlerts(infrastructure);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();