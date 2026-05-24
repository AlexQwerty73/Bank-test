import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../config';

const typeTag = 'ExchangeRate';
const resource = 'exchangeRate';

export const exchangeRateApi = createApi({
   reducerPath: 'exchangeRateApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),

   endpoints: (build) => ({
      getExchangeRateApi: build.query({
         query: (id = '') => `${resource}/${id}`,
         providesTags: (result, error, id) => [
            { type: typeTag, id },
            { type: typeTag, id: 'LIST' },
         ],
      }),
   }),
});

export const { useGetExchangeRateApiQuery } = exchangeRateApi;
