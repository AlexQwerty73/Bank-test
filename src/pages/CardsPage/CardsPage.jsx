import React from 'react';
import { Cards } from '../../components';
import { Link, useParams } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';
import { useGetCardsByUserIdQuery } from '../../redux';
import styles from './cardsPage.module.css';

export const CardsPage = () => {
   const { userId } = useParams();
   const localStorUserId = loadFromLocalStorage('userId');
   const { data: cardsData, isLoading, error } = useGetCardsByUserIdQuery(userId);

   const isUser = userId === localStorUserId;
   const cards = isUser ? cardsData : [];

   return (
      <div className='cardsPage'>
         <div className={styles.content}>
            {isLoading && <p>Loading ...</p>}
            {error && <p>Error: {error}</p>}
            {!cardsData || cardsData.length === 0 ? (
               <Link to={`/${userId}/create-card`}>
                  <button className={styles.btn}>Create new card!</button>
               </Link>
            ) : (
              <Cards cards={cards} />
            )}
         </div>
      </div>
   );
};
