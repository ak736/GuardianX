import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return this.socket;
    
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    
    this.socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    this.socket.on('connect', () => {
      console.log('Connected to GuardianX realtime server');
      this.connected = true;
    });
    
    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from GuardianX realtime server');
      this.connected = false;
    });
    
    return this.socket;
  }
  
  // Join the dashboard room to receive updates
  joinDashboard() {
    if (!this.connected) this.connect();
    this.socket.emit('join-dashboard');
  }
  
  // Join the alerts room to receive alert updates
  joinAlerts() {
    if (!this.connected) this.connect();
    this.socket.emit('join-alerts');
  }
  
  // Join a specific infrastructure room
  joinInfrastructure(infrastructureId) {
    if (!this.connected) this.connect();
    this.socket.emit('join-infrastructure', infrastructureId);
  }
  
  // Listen for new alerts
  onNewAlert(callback) {
    if (!this.connected) this.connect();
    this.socket.on('new-alert', callback);
    this.listeners.set('new-alert', callback);
  }
  
  // Listen for status updates
  onStatusUpdate(callback) {
    if (!this.connected) this.connect();
    this.socket.on('status-update', callback);
    this.listeners.set('status-update', callback);
  }
  
  // Listen for sensor reading updates
  onSensorReading(callback) {
    if (!this.connected) this.connect();
    this.socket.on('sensor-reading', callback);
    this.listeners.set('sensor-reading', callback);
  }
  
  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }
  
  // Disconnect from socket
  disconnect() {
    if (this.socket) {
      this.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;