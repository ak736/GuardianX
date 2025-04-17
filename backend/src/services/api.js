// Example update to your frontend API service
// src/services/api.js

const API_BASE_URL = 'http://localhost:5001/api';

export const fetchInfrastructure = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/infrastructure`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching infrastructure:', error);
    throw error;
  }
};

export const fetchAlerts = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  try {
    const response = await fetch(`${API_BASE_URL}/alerts?${queryParams}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const fetchUserProfile = async (walletAddress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${walletAddress}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// More API functions for other endpoints