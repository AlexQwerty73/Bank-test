import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../config';

const tag      = 'Accounts';
const resource = 'accounts';

export const accountsApi = createApi({
   reducerPath: 'accountsApi',
   tagTypes: [tag],
   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),

   endpoints: (build) => ({

      getAccountsByUserId: build.query({
         query: (userId) => `${resource}?userId=${userId}`,
         providesTags: (result, error, userId) => [
            ...(result ?? []).map(({ id }) => ({ type: tag, id })),
            { type: tag, id: `user-${userId}` },
         ],
      }),

      getAccountById: build.query({
         query: (id) => `${resource}/${id}`,
         providesTags: (result, error, id) => [{ type: tag, id }],
      }),

      getAccountByNumber: build.query({
         query: (accountNumber) => `${resource}?accountNumber=${accountNumber}`,
         providesTags: (result) =>
            (result ?? []).map(({ id }) => ({ type: tag, id })),
      }),

      addAccount: build.mutation({
         query: (body) => ({ url: resource, method: 'POST', body }),
         invalidatesTags: (result, error, { userId }) => [
            { type: tag, id: 'LIST' },
            { type: tag, id: `user-${userId}` },
         ],
      }),

      updateAccount: build.mutation({
         query: (body) => ({ url: `${resource}/${body.id}`, method: 'PUT', body }),
         invalidatesTags: (result, error, { id }) => [{ type: tag, id }],
      }),

      deleteAccount: build.mutation({
         query: (id) => ({ url: `${resource}/${id}`, method: 'DELETE' }),
         invalidatesTags: (result, error, id) => [{ type: tag, id }],
      }),

   }),
});

export const {
   useGetAccountsByUserIdQuery,
   useGetAccountByIdQuery,
   useLazyGetAccountByNumberQuery,
   useAddAccountMutation,
   useUpdateAccountMutation,
   useDeleteAccountMutation,
} = accountsApi;
