import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ element, role: requiredRole }) => {
  const token = localStorage.getItem('jwt');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp < Date.now() / 1000;
    if (isExpired) throw new Error("Token expired");

    const userRole = storedUser.role;
    const userDesignation = storedUser.designation;

    // If requiredRole is STAFF, allow receptionist(on designation)
    if (requiredRole === 'STAFF') {
      if (userRole === 'STAFF' && userDesignation === 'Receptionist') {
        return element;
      }
    }

    if (userRole !== requiredRole) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('role');
      return <Navigate to="/" replace />;
    }

    return element;
  } catch (err) {
    console.error("ProtectedRoute error:", err);
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
