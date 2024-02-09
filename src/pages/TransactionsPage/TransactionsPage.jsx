import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetCardsByUserIdQuery } from '../../redux';
import { convertToNumberCartFormat } from '../../utils';
import styles from './TransactionsPage.module.css';

export const TransactionsPage = () => {
   const { userId } = useParams();
   const { data: cards = [], isLoading } = useGetCardsByUserIdQuery(userId);

   return (
      <div className={styles.transactionsPage}>
         <div className='container'>
            <ul className={styles.transactionsList}>
               {cards.map(card => (
                  <li key={card?.id} className={styles.transactionItem}>
                     <Link to={`${card.number}`} className={styles.transactionLink}>
                        <div className={styles.transactionDetails}>
                           <p className={styles.cardNumber}>
                              Card Number: {convertToNumberCartFormat(card.number)}
                           </p>
                           <p className={styles.balance}>
                              Balance: {card.balance} {card.currency}
                           </p>
                        </div>
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
};
