import React, { useState } from 'react';
import styles from './card.module.css';
import { convertYYYYMMDDToMMYY, convertToNumberCartFormat } from '../../../utils';
import { Img } from '../Img';

export const Card = ({ card }) => {
   const [isActive, setIsActive] = useState(false);
   const { number, expiryDate, cvv, currency, type } = card;

   return (
      <div onClick={() => setIsActive(!isActive)} className={`${styles.card} ${isActive ? 'active' : ''}`}>
         <div className={styles.frontSide}>
            <div className={styles.cardTop}>
               <div className={styles.bankName}>BankName</div>
               <div className={styles.currency}>{currency}</div>
            </div>
            <div className={styles.cardMiddleTop}>
               <div className={styles.number}>{convertToNumberCartFormat(number)}</div>
            </div>
            <div className={styles.cardMiddleBottom}>
               <div className={styles.date}>{convertYYYYMMDDToMMYY(expiryDate)}</div>
            </div>
            <div className={styles.cardBottom}>
               <div className={styles.type}>
                  <div className={styles.img}>
                     {
                        <Img folder='icon/card' img={`${type.toLowerCase()}${type.toLowerCase()==='visa'?'2':''}.png`} />
                     }
                  </div>
               </div>
            </div>
         </div>
         <div className={styles.backSide}>
            <div className={styles.cvv}>{cvv}</div>
         </div>
      </div>
   );
};
