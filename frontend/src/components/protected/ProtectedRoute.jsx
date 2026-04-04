// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute() {
  const isAuthenticated = !!localStorage.getItem('token'); // or use your auth context/store

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
