import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../config';

const tag      = 'UserDeposits';
const resource = 'userDeposits';

export const userDepositsApi = createApi({
   reducerPath: 'userDepositsApi',
   tagTypes: [tag],
   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),

   endpoints: (build) => ({

      getUserDepositsByUserId: build.query({
         query: (userId) => `${resource}?userId=${userId}&_sort=-openedAt`,
         providesTags: (result, error, userId) => [
            { type: tag, id: `user-${userId}` },
         ],
      }),

      addUserDeposit: build.mutation({
         query: (body) => ({ url: resource, method: 'POST', body }),
         invalidatesTags: (result, error, { userId }) => [
            { type: tag, id: `user-${userId}` },
         ],
      }),

      updateUserDeposit: build.mutation({
         query: ({ id, ...body }) => ({ url: `${resource}/${id}`, method: 'PATCH', body }),
         invalidatesTags: (result, error, { userId }) => [
            { type: tag, id: `user-${userId}` },
         ],
      }),

   }),
});

export const {
   useGetUserDepositsByUserIdQuery,
   useAddUserDepositMutation,
   useUpdateUserDepositMutation,
} = userDepositsApi;
