import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CardCreationBlock.module.css';
import { Card } from '../commons';

export const CardCreationBlock = () => {
   const card = {
      number: 'XXXXXXXXXXXXXXXX',
      cvv: 'XXX',
      currency: 'USD',
      type: 'VISA',
      expiryDate: 'XX/XX'

   }
   return (
      <div className={styles.cardCreationBlock}>
         <div className={styles.left}>
            <h2 className={styles.title}>Open a new card!</h2>
            <p className={styles.description}>Get access to unique features and benefits.</p>
            <Link to="/create-card" className={styles.createCardButton}>
               GO
            </Link>
         </div>

         <div className={styles.right}>
            <Card card={card} />
         </div>
      </div>
   );
};
