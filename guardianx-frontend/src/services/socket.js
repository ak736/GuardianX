// src/services/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket) return;
    
    this.socket = io(SOCKET_URL);
    
    this.socket.on('connect', () => {
      console.log('Connected to GuardianX realtime server');
      this.connected = true;
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from GuardianX realtime server');
      this.connected = false;
    });
    
    return this.socket;
  }
  
  joinDashboard() {
    if (!this.connected) this.connect();
    this.socket.emit('join-dashboard');
  }
  
  joinAlerts() {
    if (!this.connected) this.connect();
    this.socket.emit('join-alerts');
  }
  
  onNewAlert(callback) {
    if (!this.connected) this.connect();
    this.socket.on('new-alert', callback);
  }
  
  onStatusUpdate(callback) {
    if (!this.connected) this.connect();
    this.socket.on('status-update', callback);
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

export default SocketService();