import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-login on mount
  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('user_token');
      const storedUser = await AsyncStorage.getItem('user_data');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify and refresh profile from backend
        fetchProfile(storedToken);
      }
    } catch (e) {
      console.error('Failed to load session from storage', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async (currentToken) => {
    try {
      const res = await api.get('/users/profile');
      if (res.data) {
        setUser(res.data);
        await AsyncStorage.setItem('user_data', JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn('Profile sync failed, using cached profile:', err.message);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      if (receivedToken) {
        setToken(receivedToken);
        setUser(receivedUser);

        await AsyncStorage.setItem('user_token', receivedToken);
        await AsyncStorage.setItem('user_data', JSON.stringify(receivedUser));

        // Fetch complete profile in background
        fetchProfile(receivedToken);
        return { success: true };
      }
      return { success: false, message: 'No token received' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const signup = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      return { success: true, message: res.data.message, email: res.data.email, devOtp: res.data.devOtp };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const verifyOtp = async (email, otp) => {
    setError(null);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'OTP verification failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithToken = async (receivedToken) => {
    setError(null);
    try {
      if (receivedToken) {
        setToken(receivedToken);
        await AsyncStorage.setItem('user_token', receivedToken);

        // Fetch profile with new token
        const res = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${receivedToken}` },
        });

        if (res.data) {
          setUser(res.data);
          await AsyncStorage.setItem('user_data', JSON.stringify(res.data));
        }
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.warn('loginWithToken failed:', err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout').catch(() => {});
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('user_data');
    } catch (e) {
      console.warn('Error during logout cleanup', e);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        error,
        login,
        loginWithToken,
        signup,
        verifyOtp,
        logout,
        refreshProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
