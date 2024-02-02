import React, { useState } from 'react';
import styles from './card.module.css';

export const Card = ({ card }) => {
   const [isActive, setIsActive] = useState(false);
   const { number, expiryDate, cvv, currency, type } = card;

   const cardNumber = number.split('').map((char, i) => char + `${(i + 1) % 4 === 0 && i + 1 !== 16 ? ' ' : ''}`);
  
   return (
      <div onClick={() => setIsActive(!isActive)} className={`${styles.card} ${isActive ? 'active' : ''}`}>
         <div className={styles.frontSide}>
            <div className={styles.cardTop}>
               <div className={styles.bankName}>BankName</div>
               <div className={styles.currency}>{currency}</div>
            </div>
            <div className={styles.cardMiddleTop}>
               <div className={styles.number}>{cardNumber}</div>
            </div>
            <div className={styles.cardMiddleBottom}>
               <div className={styles.date}>{expiryDate}</div>
            </div>
            <div className={styles.cardBottom}>
               <div className={styles.type}>{type}</div>
            </div>
         </div>
         <div className={styles.backSide}>
            <div className={styles.cvv}>{cvv}</div>
         </div>
      </div>
   );
};
