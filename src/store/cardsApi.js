import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../config';

const typeTag = 'Cards';
const resource = 'cards';

export const cardsApi = createApi({
   reducerPath: 'cardsApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),

   endpoints: (build) => ({
      getCards: build.query({
         query: (id = '') => `${resource}/${id}`,
         providesTags: (result) => [
            ...(Array.isArray(result) ? result : []).map(({ id }) => ({ type: typeTag, id })),
            { type: typeTag, id: 'LIST' },
         ],
      }),

      getCardsByUserId: build.query({
         query: (userId) => `${resource}?userId=${userId}`,
         providesTags: (result, error, userId) => [
            { type: typeTag, id: `user-${userId}` },
            { type: typeTag, id: 'LIST' },
         ],
      }),

      getCardByNumber: build.query({
         query: (number) => `${resource}?number=${number}`,
         providesTags: (result) => [
            ...(Array.isArray(result) ? result : []).map(({ id }) => ({ type: typeTag, id })),
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
         invalidatesTags: (result, error, { id }) => [{ type: typeTag, id }, { type: typeTag, id: 'LIST' }],
      }),

      deleteCard: build.mutation({
         query: (id) => ({
            url: `${resource}/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: (result, error, id) => [{ type: typeTag, id }, { type: typeTag, id: 'LIST' }],
      }),
   }),
});

export const {
   useAddCardMutation,
   useGetCardByNumberQuery,
   useLazyGetCardByNumberQuery,
   useGetCardsByUserIdQuery,
   useGetCardsQuery,
   useUpdateCardMutation,
   useDeleteCardMutation,
} = cardsApi;
