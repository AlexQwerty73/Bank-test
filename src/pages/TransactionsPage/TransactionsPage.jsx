import React from 'react';
import { Link } from 'react-router-dom';
import { useGetCardsByUserIdQuery, useGetUsersQuery } from '../../redux';
import { loadFromLocalStorage } from '../../utils';

export const TransactionsPage = () => {
   const userId = loadFromLocalStorage('userId');
   const { data: cards = [], isLoading } = useGetCardsByUserIdQuery(userId);

   return (
      <div>
         <h1>Transactions Page</h1>
         <ul>
            {cards.map(card => (
               <li key={card?.id}>
                  <Link to={`${card.number}`}>
                     Card Number: {card.number}
                  </Link>
               </li>
            ))}
         </ul>
      </div>
   );
};
