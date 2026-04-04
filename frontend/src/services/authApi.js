import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AuthUser'],
  endpoints: (builder) => ({
    googleLogin: builder.mutation({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        try {
          // 1. Firebase Popup
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          const result = await signInWithPopup(auth, provider);
          const idToken = await result.user.getIdToken();

          // 2. Exchange Firebase token for App JWT
          const response = await baseQuery({
            url: '/auth/google-login',
            method: 'POST',
            body: { idToken },
          });

          if (response.error) return { error: response.error };
          return { data: response.data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['AuthUser'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) localStorage.setItem('token', data.token);
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
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.token) localStorage.setItem('token', data.data.token);
        } catch (err) {}
      },
    }),

    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['AuthUser'],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          localStorage.removeItem('token');
        }
      },
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['AuthUser'],
    }),
  }),
});

export const {
  useGoogleLoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
