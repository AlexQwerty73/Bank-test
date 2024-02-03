import React from 'react';
import { UserProfile } from '../../components';
import { useParams } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';
import { useGetUsersQuery } from '../../redux';

export const UserProfilePage = () => {
   const { userId } = useParams();
   const localUserId = loadFromLocalStorage('userId');

   const id = userId === localUserId ? localUserId : '';

   const { data: userData, isLoading, error } = useGetUsersQuery(id);

   if (isLoading) {
      return <p>Loading...</p>;
   }

   if (error) {
      return <p>Error: {error}</p>;
   }

   return (
      <div className="userProfile">
         <div className="container">
            <UserProfile user={userData} />
         </div>
      </div>
   )
};