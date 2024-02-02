import React from 'react';
import { Cards } from '../../components';
import { useParams } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';
import { useGetCardsByUserIdQuery } from '../../redux';

export const CardsPage = () => {
   const { userId } = useParams();
   const localStorUserId = loadFromLocalStorage('userId');
   const { data: cardsData, isLoading, error } = useGetCardsByUserIdQuery(userId);

   const isUser = userId === localStorUserId;

   const cards = isUser ? cardsData : [];

   return (
      <div className='cardsPage'>
         {
            isLoading
               ? <p>Loading ...</p>
               : error ?
                  <p>Error: {error}</p>
                  : <Cards cards={cards} />
         }
      </div>
   );
};
