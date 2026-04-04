import { Outlet, Navigate } from 'react-router';

export default function AuthLayout() {
  const isAuthenticated = !!localStorage.getItem('token'); // or your auth hook

  if (isAuthenticated) return <Navigate to="/explore" replace />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}
