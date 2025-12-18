import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ role, designations = [] }) => {
  const token = localStorage.getItem('jwt');
  const userRaw = localStorage.getItem('user');

  // ❌ Not logged in
  if (!token || !userRaw) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userRaw);
    const decoded = jwtDecode(token);

    // ❌ Token expired
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error('Token expired');
    }

    // ✅ ADMIN / DOCTOR direct role match
    if (user.role === role) {
      return <Outlet />;
    }

    // ✅ STAFF + designation based access
    if (
      role === 'STAFF' &&
      user.role === 'STAFF' &&
      designations.includes(user.designation)
    ) {
      return <Outlet />;
    }

    // ❌ Unauthorized
    return <Navigate to="/" replace />;
  } catch (err) {
    console.error('Auth error:', err.message);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
