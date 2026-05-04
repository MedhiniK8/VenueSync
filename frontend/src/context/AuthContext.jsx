import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { decodeToken, isTokenExpired, roleHomePath } from '../utils/jwt';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  const token = localStorage.getItem('venuesync_token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('venuesync_token');
    return { token: null, user: null };
  }

  const payload = decodeToken(token);
  return {
    token,
    user: payload
      ? { id: payload.userId, name: payload.name, role: payload.role, email: payload.email }
      : null
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => getStoredAuth());

  useEffect(() => {
    setAuth(getStoredAuth());
  }, []);

  const login = async ({ email, password, role }) => {
    const { data } = await api.post('/auth/login', { email, password, role });
    localStorage.setItem('venuesync_token', data.token);
    const payload = decodeToken(data.token);
    const user = payload
      ? { id: payload.userId, name: payload.name, role: payload.role, email: payload.email }
      : data.user;
    setAuth({ token: data.token, user });
    return { user, token: data.token, redirectTo: roleHomePath(user.role) };
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('venuesync_token');
    setAuth({ token: null, user: null });
  };

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(auth.token && auth.user),
      roleHomePath
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
