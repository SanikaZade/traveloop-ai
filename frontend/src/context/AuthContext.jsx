import React, { createContext, useState, useEffect } from 'react';
import { getMe, login, register, logout } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const data = await getMe();
          setUser(data.data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const loginUser = async (userData) => {
    const data = await login(userData);
    setUser(data.data);
  };

  const registerUser = async (userData) => {
    const data = await register(userData);
    setUser(data.data);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
