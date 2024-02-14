import React from 'react';
import { Link } from 'react-router-dom';
import { Img } from '../commons';
import styles from './CardsTransactionList.jsx.module.css';
import { convertToNumberCartFormat } from '../../utils';

export const CardsTransactionList = ({ cards }) => {
   return (
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
   );
};