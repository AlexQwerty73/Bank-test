import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';
const typeTag = 'Cards';
const resource = 'cards';

export const cardsApi = createApi({
   reducerPath: 'cardsApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl }),

   endpoints: (build) => ({
      getProducts: build.query({
         query: (id = '') => `${resource}/${id}`,
         providesTags: (result) => [
            ...(result || []).map(({ id }) => ({ type: typeTag, id })),
            { type: typeTag, id: 'LIST' },
         ],
      }),

      addProducts: build.mutation({
         query: (body) => ({
            url: resource,
            method: 'POST',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),

      updateProducts: build.mutation({
         query: (body) => ({
            url: `${resource}/${body.id}`,
            method: 'PUT',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),
   }),
});

export const { useAddProductsMutation, useGetProductsQuery, useUpdateProductsMutation } = cardsApi;
