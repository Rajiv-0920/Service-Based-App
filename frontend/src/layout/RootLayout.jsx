import { Outlet, ScrollRestoration } from 'react-router';
import Navbar from '../components/misc/Navbar';
import Footer from '../components/misc/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '../services/authApi';
import { useEffect } from 'react';
import {
  setCredentials,
  clearCredentials,
  selectCurrentToken,
} from '../store/authSlice';

const RootLayout = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken); // ← reactive, updates on logout

  // Only fetch /me if a token exists in Redux (rehydrated from localStorage)
  const { data, error } = useGetMeQuery(undefined, {
    skip: !token, // ← skip entirely if no token, don't waste a request
  });

  useEffect(() => {
    if (data)
      dispatch(
        setCredentials({
          user: data.user,
          business: data.business ?? null,
          token,
        }),
      );
    if (error) dispatch(clearCredentials()); // token expired/invalid → log out
  }, [data, error, token, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration
        getKey={(location) => location.pathname + location.search}
      />
    </div>
  );
};

export default RootLayout;
