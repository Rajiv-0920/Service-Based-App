import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import { clearCredentials, setCredentials } from '../store/authSlice.js';

// 1. Define the base query
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Priority: Try to get token from Redux state first, fallback to localStorage
    const token = getState().auth.token || localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// 2. Wrap the base query to handle 401 (Expired/Invalid Token)
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const isAuthRoute = window.location.pathname === '/login';
    if (!isAuthRoute) {
      api.dispatch(clearCredentials());
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AuthUser'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `/auth/register/user`,
        method: 'POST',
        body: data,
      }),
      transformErrorResponse: (response) => response.message,
      transformResponse: (response) => response.data,
    }),
    registerBusiness: builder.mutation({
      query: (data) => ({
        url: '/auth/register/business',
        method: 'POST',
        body: data,
      }),
      transformErrorResponse: (response) => response.message,
      transformResponse: (response) => response.data,
    }),
    googleLogin: builder.mutation({
      queryFn: async (arg, _api, _extraOptions, baseQuery) => {
        try {
          const { rememberMe } = arg;

          // Firebase Popup
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          const result = await signInWithPopup(auth, provider);
          const idToken = await result.user.getIdToken();

          // Exchange Firebase token for App JWT
          const response = await baseQuery({
            url: '/auth/google-login',
            method: 'POST',
            body: { idToken, rememberMe },
          });

          if (response.error) return { error: response.error };
          return { data: response.data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['AuthUser'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store in both Redux and LocalStorage
          if (data?.token) {
            localStorage.setItem('token', data.token);
            dispatch(setCredentials({ user: data.user, token: data.token }));
          }
        } catch (err) {}
      },
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['AuthUser'],
      transformErrorResponse: (response) => response.data,
      transformResponse: (response) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Note: added check for nested data structure based on your original snippet
          const token = data?.data?.token || data?.token;
          const user = data?.data?.user || data?.user;

          if (token) {
            localStorage.setItem('token', token);
            dispatch(setCredentials({ user, token }));
          }
        } catch (err) {}
      },
    }),

    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['AuthUser'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Always clear local data regardless of server success
          localStorage.removeItem('token');
          dispatch(clearCredentials());
        }
      },
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['AuthUser'],
      transformResponse: (response) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Ensure Redux state is hydrated if a token exists but user object is missing
          if (data) {
            dispatch(
              setCredentials({
                data: data,
                token: localStorage.getItem('token'),
                business: data.business || null,
              }),
            );
          }
        } catch (err) {
          // If /me fails, it will hit the 401 logic in baseQueryWithReauth automatically
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useRegisterBusinessMutation,
  useGoogleLoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
