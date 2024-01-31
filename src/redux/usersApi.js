import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';

const typeTag = 'Users'; 
const src = 'users';

export const usersApi = createApi({
   reducerPath: 'usersApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),

   endpoints: (build) => ({

      getUsers: build.query({
         query: (id = '') => `${src}/${id}`,
         providesTags: (result) =>
            result && Array.isArray(result)
               ? [
                  ...result.map(({ id }) => ({ type: typeTag, id })),
                  { type: typeTag, id: 'LIST' },
               ]
               : [{ type: typeTag, id: 'LIST' }],
      }),

      addUser: build.mutation({
         query: (body) => ({
            url: src,
            method: 'POST',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }]
      }),
      
      updateUser: build.mutation({
         query: (body) => ({
            url: `${src}/${body.id}`,
            method: 'PUT',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      })

   }),
});

export const { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation } = usersApi;
