// Simple socket test script for GuardianX
const fetch = require('node-fetch');
const socketUrl = 'http://localhost:5001/api/test/socket';

async function testSocketEvent(event, data, room) {
  try {
    const response = await fetch(socketUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event,
        data,
        room
      })
    });
    
    const result = await response.json();
    console.log('Test result:', result);
    return result;
  } catch (err) {
    console.error('Error testing socket:', err);
  }
}

// Test alert event
async function testAlertEvent() {
  console.log('Testing alert notification...');
  await testSocketEvent('new-alert', {
    id: 'test-alert-' + Date.now(),
    title: 'Test Alert',
    description: 'This is a test alert from the socket test script',
    severity: 'medium',
    infrastructureType: 'water',
    area: 'Test Area',
    createdAt: new Date().toISOString()
  }, 'alerts-updates');
}

// Test status update event
async function testStatusUpdate() {
  console.log('Testing status update...');
  await testSocketEvent('status-update', {
    infrastructureId: '123456789',
    status: 'warning',
    type: 'power'
  }, 'dashboard-updates');
}

// Run the tests
async function runTests() {
  await testAlertEvent();
  console.log('------------------');
  await testStatusUpdate();
}

runTests();