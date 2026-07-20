import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth session on app initialization
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get('/auth/profile');
        if (response.data?.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        // Not authenticated or token expired
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(userData);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/signup', formData);
      const { user: userData, token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(userData);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await API.put('/auth/profile', profileData);
      const { user: updatedUser } = response.data;
      setUser(updatedUser);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
