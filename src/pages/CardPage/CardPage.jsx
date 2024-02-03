import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCardByNumberQuery } from '../../redux';
import { CardData } from '../../components';

export const CardPage = () => {
   const { cardNumber } = useParams();

   const { data: cardData = [], isLoading, error } = useGetCardByNumberQuery(cardNumber);
   const card = cardData[0];
   console.log(card);

   return (
      <div className='cardPage'>
         <div className="container">
            {
               isLoading
                  ? <p>Loading ...</p>
                  : error
                     ? <p>Error: {error}</p>
                     : <CardData card={card} />
            }
         </div>
      </div>
   );
};
