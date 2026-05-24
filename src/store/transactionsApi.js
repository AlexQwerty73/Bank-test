import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../config';

const tag      = 'Transactions';
const resource = 'transactions';

export const transactionsApi = createApi({
   reducerPath: 'transactionsApi',
   tagTypes: [tag],
   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),

   endpoints: (build) => ({

      /* All transactions for one account (sorted newest first) */
      getTransactionsByAccountId: build.query({
         query: (accountId) =>
            `${resource}?accountId=${accountId}&_sort=-date`,
         providesTags: (result, error, accountId) => [
            { type: tag, id: `account-${accountId}` },
         ],
      }),

      /* All transactions for one user (sorted newest first) */
      getTransactionsByUserId: build.query({
         query: (userId) =>
            `${resource}?userId=${userId}&_sort=-date`,
         providesTags: (result, error, userId) => [
            { type: tag, id: `user-${userId}` },
         ],
      }),

      addTransaction: build.mutation({
         query: (body) => ({ url: resource, method: 'POST', body }),
         invalidatesTags: (result, error, { accountId, userId }) => [
            { type: tag, id: `account-${accountId}` },
            ...(userId ? [{ type: tag, id: `user-${userId}` }] : []),
         ],
      }),

   }),
});

export const {
   useGetTransactionsByAccountIdQuery,
   useGetTransactionsByUserIdQuery,
   useAddTransactionMutation,
} = transactionsApi;
