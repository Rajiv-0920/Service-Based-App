import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import RootLayout from './layout/RootLayout';
import SignInPage from './pages/SigninPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/protected/ProtectedRoute';
import AuthLayout from './layout/AuthLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'services/:id', element: <ServiceDetailPage /> },

      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <SignInPage /> },
          // { path: 'sign-up', element: <SignUpPage /> },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          // add more protected routes here
        ],
      },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
