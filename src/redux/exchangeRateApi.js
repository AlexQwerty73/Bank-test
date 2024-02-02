import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';
const typeTag = 'ExchangeRate';
const resource = 'exchangeRate';

export const exchangeRateApi = createApi({
  reducerPath: 'exchangeRateApi',
  tagTypes: [typeTag],
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),

  endpoints: (build) => ({
    getExchangeRateApi: build.query({
      query: (id = '') => `${resource}/${id}`,
      providesTags: (result, error, id) => [
        { type: typeTag, id: id },
        { type: typeTag, id: 'LIST' },
      ],
      onError: (error) => {
        console.error('Error fetching exchange rate:', error);
        return { error };
      },
    }),
  }),
});

export const { useGetExchangeRateApiQuery } = exchangeRateApi;
