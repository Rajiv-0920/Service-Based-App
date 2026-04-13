import { configureStore } from '@reduxjs/toolkit';
import { servicesApi } from '../services/servicesApi';
import { authApi } from '../services/authApi';
import authReducer from './authSlice';
import { userApi } from '../services/userApi';
import { businessApi } from '../services/businessApi';
import { adminApi } from '../services/adminApi';

// ---------------------------------------------------------------------------
// Redux Store
// ---------------------------------------------------------------------------
// All server-state lives in RTK Query caches.
// Add your own slices below for any client-only state (e.g. cart, auth).
// ---------------------------------------------------------------------------

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [businessApi.reducerPath]: businessApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(servicesApi.middleware)
      .concat(userApi.middleware)
      .concat(authApi.middleware)
      .concat(businessApi.middleware)
      .concat(adminApi.middleware),

  devTools: import.meta.env.DEV !== 'production',
});
