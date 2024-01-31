import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';

const typeTag = 'ExchangeRate';
const src = 'exchangeRate';

export const exchangeRateApi = createApi({
   reducerPath: 'exchangeRateApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),

   endpoints: (build) => ({
      getExchangeRateApi: build.query({
         query: (id = '') => `${resource}/${id}`,
         providesTags: (result) => [
            ...(result || []).map(({ id }) => ({ type: typeTag, id })),
            { type: typeTag, id: 'LIST' },
         ],
      }),
   }),
});

export const { useGetExchangeRateApiQuery } = exchangeRateApi;
