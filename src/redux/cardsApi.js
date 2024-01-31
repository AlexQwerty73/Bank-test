import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';
const typeTag = 'Cards';
const resource = 'cards';

export const cardsApi = createApi({
   reducerPath: 'cardsApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl }),

   endpoints: (build) => ({
      getCards: build.query({
         query: (id = '') => `${resource}/${id}`,
         providesTags: (result) => [
            ...(result || []).map(({ id }) => ({ type: typeTag, id })),
            { type: typeTag, id: 'LIST' },
         ],
      }),

      addCard: build.mutation({
         query: (body) => ({
            url: resource,
            method: 'POST',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),

      updateCard: build.mutation({
         query: (body) => ({
            url: `${resource}/${body.id}`,
            method: 'PUT',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),
   }),
});

export const { useAddCardMutation, useGetCardsQuery, useUpdateCardMutation } = cardsApi;
