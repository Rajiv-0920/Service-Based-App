import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import RootLayout from './layout/RootLayout';
import SignInPage from './pages/SigninPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/protected/ProtectedRoute';
import AuthLayout from './layout/AuthLayout';
import SettingsPage from './pages/SettingPage';
import RegisterPage from './pages/RegisterPage';
import BusinessSetupPage from './pages/BusinessSetupPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import AdminPage from './pages/AdminPage';
import { AdminGuard } from './components/protected/AdminGuard';
import CreateServicePage from './pages/CreateServicePage';
import ManageServicesPage from './pages/ManageServicePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'services/:id', element: <ServiceDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
      {
        path: 'business',
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <BusinessProfilePage /> },
          { path: 'setup', element: <BusinessSetupPage /> },
          { path: 'services/new', element: <CreateServicePage /> },
          { path: 'services', element: <ManageServicesPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <SignInPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: 'admin', element: <AdminPage /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
