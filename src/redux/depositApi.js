import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';
const typeTag = 'Deposit';
const resource = 'deposit';

export const depositApi = createApi({
  reducerPath: 'depositApi',
  tagTypes: [typeTag],
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),

  endpoints: (build) => ({
    getDepositApi: build.query({
      query: () => `${resource}`,
      providesTags: (result, error) => [
        { type: typeTag },
      ],
      onError: (error) => {
        console.error('Error fetching deposit:', error);
        return { error };
      },
    }),
  }),
});

export const { useGetDepositApiQuery } = depositApi;
