import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? '/api',
    credentials: 'include',
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (user) => ({
        url: '/users/profile',
        method: 'PUT',
        body: user,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: '/users/change-password',
        method: 'PUT',
        body: { currentPassword, newPassword },
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['User'],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/users/account',
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = userApi;
