import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetCardsByUserIdQuery } from '../../redux';
import { convertToNumberCartFormat } from '../../utils';
import { Img } from '../../components'
import styles from './TransactionsPage.module.css';

export const TransactionsPage = () => {
   const { userId } = useParams();
   const { data: cards = [], isLoading } = useGetCardsByUserIdQuery(userId);

   return (
      <div className={styles.transactionsPage}>
         <div className={styles.container}>
            <ul className={styles.transactionsList}>
               {cards.map(card => (
                  <li key={card?.id} className={styles.transactionItem}>
                     <Link to={`${card.number}`} className={styles.transactionLink}>
                        <div className={styles.cardInfo}>
                           <div className={styles.transactionDetails}>
                              <p className={styles.cardNumber}>
                                 Card Number: {convertToNumberCartFormat(card.number)}
                              </p>
                              <p className={styles.balance}>
                                 Balance: {card.balance} {card.currency}
                              </p>
                           </div>
                           <div className={styles.img}>
                              <Img folder='icon/card' img={`${card.type.toLowerCase()}.png`} />
                           </div>
                        </div>
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
};
