import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeToken, isTokenExpired, roleHomePath } from '../utils/jwt';

const PrivateRoute = ({ allowedRoles }) => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('venuesync_token');

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  }

  const payload = decodeToken(token);
  if (!payload) {
    return <Navigate to="/login" replace state={{ from: pathname }} />;
  }

  if (!allowedRoles.includes(payload.role)) {
    return <Navigate to={roleHomePath(payload.role)} replace />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
