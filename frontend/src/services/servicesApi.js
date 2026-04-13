import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ---------------------------------------------------------------------------
// servicesApi  –  RTK Query slice for the Service Marketplace
// ---------------------------------------------------------------------------

export const servicesApi = createApi({
  reducerPath: 'servicesApi',

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ['Service', 'Category', 'City'],

  endpoints: (builder) => ({
    // -----------------------------------------------------------------------
    // GET /services  – paginated, filterable list
    // Params: { q?, category?, city?, minPrice?, maxPrice?, page?, limit? }
    // -----------------------------------------------------------------------
    getServices: builder.query({
      query: (params = {}) => ({
        url: 'services',
        params: {
          q: params.q ?? '',
          category: params.category ?? '',
          city: params.city ?? '',
          minPrice: params.minPrice ?? '',
          maxPrice: params.maxPrice ?? '',
          page: params.page ?? 1,
          limit: params.limit ?? 12,
        },
      }),
      // transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Service', id: _id })),
              { type: 'Service', id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Service', id: 'PARTIAL-LIST' }],
    }),

    // -----------------------------------------------------------------------
    // GET /services/cities – New endpoint for dynamic city filters
    // -----------------------------------------------------------------------
    getAvailableCities: builder.query({
      query: () => 'services/cities',
      providesTags: [{ type: 'City', id: 'LIST' }],
    }),

    // -----------------------------------------------------------------------
    // GET /services/:id  – single service detail
    // -----------------------------------------------------------------------
    getServiceById: builder.query({
      query: (id) => `services/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Service', id }],
    }),

    // -----------------------------------------------------------------------
    // GET /business/:id/services
    // -----------------------------------------------------------------------
    getBusinessServices: builder.query({
      query: (businessId) => `businesses/${businessId}/services`,
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Service', id: _id })),
              { type: 'Service', id: 'BUSINESS-LIST' },
            ]
          : [{ type: 'Service', id: 'BUSINESS-LIST' }],
    }),

    // -----------------------------------------------------------------------
    // POST /services  – create a new service
    // -----------------------------------------------------------------------
    createService: builder.mutation({
      query: (service) => ({
        url: 'services',
        method: 'POST',
        body: service,
      }),
      invalidatesTags: [{ type: 'Service', id: 'LIST' }],
    }),

    // -----------------------------------------------------------------------
    // GET /categories  – flat list used for nav + filters
    // -----------------------------------------------------------------------
    getCategories: builder.query({
      query: () => 'categories',
      providesTags: [{ type: 'Category', id: 'LIST' }],
      transformResponse: (response) => response.data,
    }),

    toggleServiceListing: builder.mutation({
      query: ({ id, isListed }) => ({
        url: `services/${id}`,
        method: 'PATCH',
        body: { isListed },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Service', id },
        { type: 'Service', id: 'BUSINESS-LIST' },
      ],
    }),

    deleteService: builder.mutation({
      query: (id) => ({ url: `services/${id}`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Service', id },
        { type: 'Service', id: 'BUSINESS-LIST' },
        { type: 'Service', id: 'PARTIAL-LIST' },
      ],
    }),

    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `services/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Service', id: id },
        { type: 'Service', id: 'BUSINESS-LIST' },
      ],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetAvailableCitiesQuery,
  useGetServiceByIdQuery,
  useGetCategoriesQuery,
  useCreateServiceMutation,
  useToggleServiceListingMutation,
  useDeleteServiceMutation,
  useGetBusinessServicesQuery,
  useUpdateServiceMutation,
} = servicesApi;
