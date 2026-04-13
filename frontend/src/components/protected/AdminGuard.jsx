import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import { Navigate } from 'react-router';

export function AdminGuard({ children }) {
  const user = useSelector(selectCurrentUser);
  console.log(user);

  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
