import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../config';

const typeTag = 'Deposit';
const resource = 'deposit';

export const depositApi = createApi({
   reducerPath: 'depositApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),

   endpoints: (build) => ({
      getDepositApi: build.query({
         query: () => resource,
         providesTags: [{ type: typeTag }],
      }),
   }),
});

export const { useGetDepositApiQuery } = depositApi;
