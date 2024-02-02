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

      getCardsByUserId: build.query({
         query: (userId) => `${resource}?userId=${userId}`, 
         providesTags: (result, error, userId) => [
           { type: 'Card', id: userId },
           { type: 'Card', id: 'LIST' },
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

export const { useAddCardMutation, useGetCardsByUserIdQuery, useGetCardsQuery, useUpdateCardMutation } = cardsApi;
