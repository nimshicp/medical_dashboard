import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me/');
          setUser(data);
        } catch (err) {
          console.error('Failed to fetch user', err);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
  const { data } = await api.post('/auth/login/', { email, password });

  
  localStorage.setItem('access_token', data.access);


  const profileResponse = await api.get('/auth/me/');
  setUser(profileResponse.data);

  return data;
};

  const register = async (userData) => {
    const { data } = await api.post('/auth/register/', userData);
    return data;
  };

  const logout = async () => {
  try {
    await api.post('/auth/logout/'); 
  } catch (err) {
    console.error('Logout error', err);
  } finally {
    localStorage.removeItem('access_token');
    setUser(null);
  }
};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
