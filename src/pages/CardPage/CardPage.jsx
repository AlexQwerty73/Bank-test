import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCardByNumberQuery } from '../../redux';
import { CardData } from '../../components';
import { loadFromLocalStorage } from '../../utils';
import styles from './cardPage.module.css';

export const CardPage = () => {
   const { cardNumber } = useParams();
   const userId = loadFromLocalStorage('userId');

   const { data: cardData = [], isLoading, error } = useGetCardByNumberQuery(cardNumber);
   const card = cardData[0];

   const isUserCard = card?.userId === userId;

   return (
      <div className={styles.cardPage}>
         <div className="container">
            {
               isUserCard
                  ? isLoading
                     ? <p>Loading ...</p>
                     : error
                        ? <p>Error: {error}</p>
                        : <CardData card={card} />
                  : <h2>This is not your card!</h2>
            }
         </div>
      </div>
   );
};
