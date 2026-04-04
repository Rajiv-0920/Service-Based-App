import { configureStore } from '@reduxjs/toolkit';
import { servicesApi } from '../services/servicesApi';
import { authApi } from '../services/authApi';
import authReducer from './authSlice';

// ---------------------------------------------------------------------------
// Redux Store
// ---------------------------------------------------------------------------
// All server-state lives in RTK Query caches.
// Add your own slices below for any client-only state (e.g. cart, auth).
// ---------------------------------------------------------------------------

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // RTK Query cache reducer – MUST match the `reducerPath` on the api slice
    [servicesApi.reducerPath]: servicesApi.reducer,
    [authApi.reducerPath]: authApi.reducer, // ← new
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(servicesApi.middleware)
      .concat(authApi.middleware),

  devTools: import.meta.env.DEV !== 'production',
});
