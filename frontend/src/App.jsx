import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import RootLayout from './layout/RootLayout';
import SignInPage from './pages/SigninPage';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'services/:id', element: <ServiceDetailPage /> },
      { path: 'login', element: <SignInPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
