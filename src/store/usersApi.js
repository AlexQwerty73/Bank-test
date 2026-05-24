import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../config';

const typeTag = 'Users';
const src = 'users';

export const usersApi = createApi({
   reducerPath: 'usersApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),

   endpoints: (build) => ({

      getUsers: build.query({
         query: (id = '') => `${src}/${id}`,
         providesTags: (result) =>
            Array.isArray(result)
               ? [
                  ...result.map(({ id }) => ({ type: typeTag, id })),
                  { type: typeTag, id: 'LIST' },
               ]
               : [{ type: typeTag, id: 'LIST' }],
      }),

      // Запит користувача за email — не завантажує всіх юзерів
      getUserByEmail: build.query({
         query: (email) => `${src}?email=${encodeURIComponent(email)}`,
         providesTags: (result) =>
            Array.isArray(result)
               ? result.map(({ id }) => ({ type: typeTag, id }))
               : [],
      }),

      addUser: build.mutation({
         query: (body) => ({
            url: src,
            method: 'POST',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),

      updateUser: build.mutation({
         query: (body) => ({
            url: `${src}/${body.id}`,
            method: 'PUT',
            body,
         }),
         invalidatesTags: (result, error, { id }) => [{ type: typeTag, id }],
      }),

   }),
});

export const {
   useGetUsersQuery,
   useLazyGetUsersQuery,
   useGetUserByEmailQuery,
   useLazyGetUserByEmailQuery,
   useAddUserMutation,
   useUpdateUserMutation,
} = usersApi;
