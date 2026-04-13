import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';
import { selectCurrentToken, selectCurrentUser } from '../../store/authSlice';

export default function ProtectedRoute() {
  const tokenInStore = useSelector(selectCurrentToken);
  const userInStore = useSelector(selectCurrentUser);
  const tokenInStorage = localStorage.getItem('token');

  const isAuthenticated = !!(tokenInStore || tokenInStorage);
  const isAdmin = userInStore?.role === 'admin';

  return isAdmin ? (
    <Navigate to="/admin" replace />
  ) : isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}
