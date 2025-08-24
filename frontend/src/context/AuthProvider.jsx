import React, { useState, useEffect, useMemo } from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user ? { token, user: JSON.parse(user) } : null;
  });

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(null);
  };

  // Sync auth state with localStorage changes across browser tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setAuth(token && user ? { token, user: JSON.parse(user) } : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(() => ({ auth, login, logout }), [auth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
