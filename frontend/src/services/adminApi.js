import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['AdminBusinesses', 'AdminUsers', 'AdminServices'],
  endpoints: (builder) => ({
    // Businesses
    getAdminBusinesses: builder.query({
      query: () => '/admin/businesses',
      providesTags: ['AdminBusinesses'],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.message,
    }),
    approveBusiness: builder.mutation({
      query: (id) => ({
        url: `/admin/businesses/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminBusinesses'],
    }),
    suspendBusiness: builder.mutation({
      query: (id) => ({
        url: `/admin/businesses/${id}/suspend`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminBusinesses'],
    }),
    // Users
    getAdminUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['AdminUsers'],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.message,
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AdminUsers'],
    }),
    // Services
    getAdminServices: builder.query({
      query: () => '/admin/services',
      providesTags: ['AdminServices'],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.message,
    }),
    deleteService: builder.mutation({
      query: (id) => ({ url: `/admin/services/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AdminServices'],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.message,
    }),
  }),
});

export const {
  useGetAdminBusinessesQuery,
  useApproveBusinessMutation,
  useSuspendBusinessMutation,
  useGetAdminUsersQuery,
  useDeleteUserMutation,
  useGetAdminServicesQuery,
  useDeleteServiceMutation,
} = adminApi;
