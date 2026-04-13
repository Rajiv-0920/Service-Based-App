import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const businessApi = createApi({
  reducerPath: 'businessApi',

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ['Business'],

  endpoints: (builder) => ({
    // -----------------------------------------------------------------------
    // GET /business/profile
    // -----------------------------------------------------------------------
    getBusinessProfile: builder.query({
      query: () => 'businesses/profile',
      providesTags: [{ type: 'Business', id: 'PROFILE' }],
      transformResponse: (response) => response.data,
    }),

    updateBusinessProfile: builder.mutation({
      query: (profile) => ({
        url: 'businesses/profile',
        method: 'PUT',
        body: profile,
      }),
      invalidatesTags: [{ type: 'Business', id: 'PROFILE' }],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetBusinessProfileQuery, useUpdateBusinessProfileMutation } =
  businessApi;
