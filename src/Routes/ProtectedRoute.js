import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ element, role: requiredRole }) => {
  const token = localStorage.getItem('jwt');
  const role = localStorage.getItem('role');

  if (!token || !role) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp < Date.now() / 1000;

    if (isExpired || role !== requiredRole) {
      // Clear invalid token
      localStorage.removeItem("jwt");
      localStorage.removeItem("role");
      return <Navigate to="/" replace />;
    }

    return element;
  } catch (err) {
    console.error("Invalid token", err);
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
