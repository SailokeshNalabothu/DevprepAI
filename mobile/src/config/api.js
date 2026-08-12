import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Live Cloud Backend on Render:
 * Connects directly to MongoDB Atlas and Gemini AI 24/7 from any device/network.
 */
export const API_BASE_URL = 'https://devprepai.onrender.com';

console.log('[DevPrep Mobile API] Connecting to Live Cloud Backend at:', `${API_BASE_URL}/api`);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach JWT Bearer Token automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not retrieve token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Received 401 Unauthorized from live backend');
    }
    return Promise.reject(error);
  }
);

export default api;
